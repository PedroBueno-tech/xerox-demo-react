"use client";
import { useEffect, useState } from 'react';
import NewDocument from '../modal/newDocument/newDocument'
import './documentsForProcess.css';
import axios from 'axios';

const DocumentsForProcess = ({ header, setLoading, setDossier, dossier, loading, setDocumentTypes }) => {

    const [inputValue, setInputValue] = useState('');
    const [enableAdd, setEnableAdd] = useState(false)
    const [enableRemove, setEnableRemove] = useState(false)
    const [enableSubmit, setEnableSubmit] = useState(false)
    const [enableDossierID, setEnableDossierID] = useState(true)
    const [enableSearch, setEnableSearch] = useState(true)
    const [modal, setModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [JSONtoSend, setJSONtoSend] = useState({
        dossier: '',
        files: [] as any[], // Array inicial vazio
    });
    // Inicializa o estado como um array vazio
    const [documents, setDocuments] = useState<{ key: string, base64: string }[]>([]);

    // Função para adicionar um item ao array
    const addDocument = (key: string, base64: string) => {
        setDocuments(prevDocs => [...prevDocs, { key, base64 }]);
    };

    // Função para remover um item pelo índice
    const removeDocument = (index: number) => {
        setDocuments(prevDocuments => prevDocuments.filter((_, i) => i !== index));
    };

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };
    const handleRowClick = (id: number) => {
        console.log(id)
        setSelectedRow(id); // Define a linha selecionada
    };

    async function searchDossier() {
        localStorage.clear()
        if (inputValue == '') {
            alert('Dossier identification is empty')
            return;
        }
        setLoading(true);
        let dossierList: any;
        let foundedDossier: any;
        let documentTypeListID: any;
        await axios({
            method: 'get',
            url: 'https://www-portal.dev.alphaxerox.com.br/doctype-service/v1/jobdossiers?size=500',
            headers: header,
        }).then(response => {
            dossierList = response.data._embedded.JobDossiers;
            dossierList.forEach((item: any) => {
                if (item.dossier == inputValue) {
                    foundedDossier = item.id;
                }
            });
            if (!foundedDossier) {
                setLoading(false);
                setDossier({ dossier: inputValue })
                alert('No dossier found')
                setEnableAdd(true)
                return;
            }

        }).catch(error => {
            console.log(error)
            return;
        })
        await axios({
            method: 'get',
            url: 'https://www-portal.dev.alphaxerox.com.br/doctype-service/v1/jobdossiers/' + foundedDossier,
            headers: header
        }).then(response => {
            setDossier(response.data)
            setEnableAdd(true)
            setLoading(false)
            documentTypeListID = response.data.documentTypes[0].documentTypeListId

        }).catch(error => {
            console.log(error)
            return;
        })
        await axios({
            method: 'get',
            url: 'https://www-portal.dev.alphaxerox.com.br/doctype-service/v1/doctypelists/' + documentTypeListID,
            headers: header
        }).then(response => {

            let flag = false;
            let code = '';
            const updatedDocs: { flag: boolean; code: string;}[] = []; // Crie um array temporário para armazenar os elementos

            response.data.documentTypes?.forEach((element: any) => {
                code = element.code;
                updatedDocs.push({flag, code}); // Adiciona o novo item no array temporário
            });

            // Atualize o estado com o array completo de uma vez
            setDocumentTypes(updatedDocs);
            console.log(response)
        }).catch(error => {

        })

    }

    function onSubmit() {
        setLoading(true)
        if (inputValue == null || inputValue == '') {
            alert("No name for dossier")
            return;
        }
        console.log(documents)
        if (documents.length === 0) {
            alert("No document for process")
            return;

        }
        setJSONtoSend({
            dossier: inputValue,
            files: documents
        })
        axios({
            method: 'post',
            url: 'https://www-portal.dev.alphaxerox.com.br/dip-service/insertPackage',
            headers: header,
            data: JSONtoSend
        }).then(response => {
            console.log(response)
            setDocuments([])
            searchDossier()
        })

    }


    //Console.log para ver o que está sendo enviado ao backend está fora da função pois o react é assincrono então ele rodava antes do JSONtoSend
    useEffect(() => {
        console.log("Updated JSONtoSend:", JSONtoSend);
    }, [JSONtoSend]);
    //verifica se o conteudo de dossier id não foi apagado
    useEffect(() => {
        if (inputValue == '') {
            setEnableAdd(false)
            setEnableRemove(false)
            setEnableRemove(false)
        }
    }, [inputValue])
    useEffect(() => {
        if (documents.length == 0) {
            setEnableRemove(false)
            setEnableSubmit(false)
            setEnableDossierID(true)
            setEnableSearch(true)
        } else {
            setEnableRemove(true)
            setEnableSubmit(true)
            setEnableDossierID(false)
            setEnableSearch(false)
        }
    }, [documents])

    function openModal() {
        setModal(true)
    }

    return (

        <div className="bodyForDocProcess">
            {modal && <NewDocument setModal={setModal} addDocuments={addDocument} loading={loading} />}
            <div className="documentsForProcess">
                <p>Documents for process</p>
                <div className="tableWrapper">
                    <table className='table-for-docProcess'>
                        <thead>
                            <tr>
                                <th className="dossierId">Dossier Identification</th>
                                <th className="fileName">File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents?.map((item, index) => (
                                <tr
                                    key={index}
                                    className={selectedRow === index ? 'selected' : ''} // Adiciona a classe 'selected' se for a linha clicada
                                    onClick={() => handleRowClick(index)} // Manipula o clique
                                >
                                    <td className="dossierId">{dossier.dossier}</td>
                                    <td className="fileName">{item.key}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="options">
                <div className="searchDiv">
                    Dossier Identification: <input type="text" value={inputValue} onChange={handleInputChange} disabled={!enableDossierID} /> <button onClick={searchDossier} disabled={!enableSearch}>Search</button>
                </div>
                <div className="docButtons">
                    <button disabled={!enableAdd} onClick={() => openModal()}>Add Document</button>
                    <button disabled={!enableRemove} onClick={() => removeDocument(selectedRow)}>Remove Document</button>
                    <button disabled={!enableSubmit} onClick={onSubmit}>Submit</button>
                </div>
            </div>

        </div>
    );
}

export default DocumentsForProcess;