"use client";
import { useEffect, useState } from "react";
import NewDocument from "../modal/newDocument/newDocument";
import ResultDossier from "../modal/resultDossier/resultDossier";
import "./documentsForProcess.css";
import axios from "axios";
import { brbDocuments } from "../interfaces/BrbDocument";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import DataTable from "./DataTable/dataTable";

const DocumentsForProcess = ({
  header,
  setLoading,
  setDossier,
  dossier,
  loading,
  setDocumentTypes,
  selectedFlow,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [enableAdd, setEnableAdd] = useState(false);
  const [enableRemove, setEnableRemove] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [enableDossierID, setEnableDossierID] = useState(true);
  const [enableSearch, setEnableSearch] = useState(true);
  const [enableResultDossier, setEnableResultDossier] = useState(false);
  const [addDocumentModal, setAddDocumentModal] = useState(false);
  const [dossierResultModal, setDossierResultModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [resultDossier, setResultDossier] = useState(null);
  const [doctype, setDoctype] = useState("");

  let apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Inicializa o estado como um array vazio
  const [documents, setDocuments] = useState<{ key: string; base64: string }[]>([]);
  const [brbDocuments, setBrbDocuments] = useState<brbDocuments[]>([]);

  // BRB especific
  const addBrbDocument = (key: string, base64: string, type: string) => {
    let toSave: brbDocuments;
    if (type == "document") {
      toSave = {
        internalIdType: "Document",
        internalId: "Activity_0c1qtcj",
        internalIdDocType: null,
        key,
        base64,
      };
    } else if (type == "selfie") {
      toSave = {
        internalIdType: "Selfie",
        internalId: "Activity_0qybbf3",
        internalIdDocType: "Activity_0z4ygat",
        key,
        base64,
      };
    }

    setBrbDocuments((prevDocs) => [...prevDocs, toSave]);
  };

  // Função para adicionar um item ao array
  const addDocument = (key: string, base64: string) => {
    setDocuments((prevDocs) => [...prevDocs, { key, base64 }]);
  };

  const removeDocumentOrBrbDocument = (index: number) => {
    if (index < documents.length) {
      // Remove do array `documents`
      setDocuments((prevDocuments) =>
        prevDocuments.filter((_, i) => i !== index)
      );
    } else {
      // Remove do array `brbDocuments`
      const brbIndex = index - documents.length;
      setBrbDocuments((prevBrbDocs) =>
        prevBrbDocs.filter((_, i) => i !== brbIndex)
      );
    }
  };

  async function searchDossier() {
    localStorage.clear();
    if (inputValue == "") {
      alert("Dossier identification is empty");
      return;
    }
    setLoading(true);
    let dossierList: any;
    let foundedDossier: any;
    //let documentTypeListID: any;
    await axios({
      method: "get",
      url: apiUrl + "doctype-service/v1/jobdossiers?size=500",
      headers: header,
    })
      .then((response) => {
        dossierList = response.data._embedded.JobDossiers;
        dossierList.forEach((item: any) => {
          if (item.dossier.toUpperCase() == inputValue.toUpperCase()) {
            foundedDossier = item.id;
          }
        });
        if (!foundedDossier) {
          setLoading(false);
          setDossier({ dossier: inputValue });
          alert(
            "No dossier found - you can use this dossier number to upload your files"
          );
          setEnableAdd(true);
          return;
        }
      })
      .catch((error) => {
        return;
      });
    await axios({
      method: "get",
      url: apiUrl + "doctype-service/v1/jobdossiers/" + foundedDossier,
      headers: header,
    })
      .then((response) => {
        setDossier(response.data);
        setEnableAdd(true);
        //documentTypeListID = response.data.documentTypes[0].documentTypeListId;
      })
      .catch((error) => {
        return;
      });

    //Antigo código do document type list mantenho ele ai pra caso de uso futuro
    /*await axios({
            method: 'get',
            url: apiUrl + 'doctype-service/v1/doctypelists/' + documentTypeListID,
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
        }).catch(error => {

        }) */
    let toSearch = {
      action: "READ",
      target: inputValue + "_result.json",
    };
    await axios({
      method: "post",
      url: apiUrl + "api-service/repository/v1/0040",
      headers: header,
      data: toSearch,
    })
      .then((response) => {
        if (response?.data?.payload?.content) {
          let convert = JSON.parse(response.data.payload.content);
          setResultDossier(convert);
          console.log(convert);
        } else {
          setResultDossier(null);
          console.log("No result found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  async function onSubmit() {
    setLoading(true);
    if (inputValue == null || inputValue == "") {
      alert("No name for dossier");
      return;
    }
    let jsonToSend: any = {};
    if (documents.length === 0 && brbDocuments.length === 0) {
      alert("No document for process");
      return;
    } else {
      console.log(selectedFlow?.id);
      if (selectedFlow?.id == 15) {
        jsonToSend = {
          flowID: JSON.stringify(selectedFlow.id),
          dossier: inputValue,
          requisicaoFluxoUnico: true,
          dossierInternalId: "Activity_04dfjb3",
          files: brbDocuments,
        };
      } else {
        jsonToSend = {
          dossier: inputValue,
          files: documents,
        };
      }
      await axios({
        method: "post",
        url: apiUrl + "dip-service/insertPackage",
        headers: header,
        data: jsonToSend,
      })
        .then((response) => {
          setEnableAdd(false);
          setLoading(false);
          setDossier({ dossier: inputValue });
          setDocuments([]);
          setBrbDocuments([]);
        })
        .catch((error) => {
          alert("Request failed due to: " + error);
          setLoading(false);
        });
    }
  }

  //verifica se o conteudo de dossier id não foi apagado
  useEffect(() => {
    if (inputValue == "") {
      setEnableAdd(false);
      setEnableRemove(false);
      setEnableRemove(false);
    }
  }, [inputValue]);

  useEffect(() => {
    if (documents.length === 0 && brbDocuments.length === 0) {
      setEnableRemove(false);
      setEnableSubmit(false);
      setEnableDossierID(true);
      setEnableSearch(true);
    } else {
      setEnableRemove(true);
      setEnableSubmit(true);
      setEnableDossierID(false);
      setEnableSearch(false);
    }
  }, [documents, brbDocuments]);

  useEffect(() => {
    if (resultDossier != null) {
      setEnableResultDossier(true);
    } else {
      setEnableResultDossier(false);
    }
  }, [resultDossier]);

  function openAddDocumentModal() {
    setAddDocumentModal(true);
  }

  function openDossierResultModal() {
    setDossierResultModal(true);
  }

  return (
    <div className="bodyForDocProcess">
      {dossierResultModal && (
        <ResultDossier
          setModal={setDossierResultModal}
          resultDossier={resultDossier}
        />
      )}
      {addDocumentModal && (
        <NewDocument
          setModal={setAddDocumentModal}
          addDocuments={selectedFlow?.id == 15 ? addBrbDocument : addDocument}
          loading={loading}
          selectedFlow={selectedFlow}
          doctype={doctype}
        />
      )}
      <div className="documentsForProcess">
        <strong>Documents for process</strong>
        <div className="tableWrapper">
          <table className="table-for-docProcess">
            <thead>
              <tr>
                <th className="dossierId">Dossier Identification</th>
                <th className="fileName">File Name</th>
              </tr>
            </thead>
            <tbody>
              {[...documents, ...brbDocuments].map((item, index) => (
                <tr
                  key={index}
                  className={selectedRow === index ? "selected" : ""}
                  onClick={() => setSelectedRow(index)}
                >
                  <td className="dossierId">{dossier.dossier}</td>
                  <td className="fileName">{item.key}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
      <DataTable documents={[...documents,...brbDocuments]} dossierName={dossier?.dossier} selectedDoc={setSelectedRow}/>
      <div className="options">
        <div className="searchDiv">
          <strong style={{ marginLeft: "5px" }}>Dossier Identification:</strong>
          <span className="p-input-icon-left">
            <i className="pi pi-folder" />
            <InputText
              placeholder={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!enableDossierID}
            />
          </span>
          <Button
            onClick={searchDossier}
            disabled={!enableSearch}
            label="Search"
            severity="danger"
          />
        </div>

        <div className="docButtons">
          <Button
            disabled={!enableAdd}
            onClick={() => {
              
              setDoctype("document");
              selectedFlow? openAddDocumentModal() : alert("No flow selected");
            }}
            label="Add Document"
            severity="danger"
          />
          <Button
            disabled={!enableAdd}
            onClick={() => {
              openAddDocumentModal();
              setDoctype("selfie");
            }}
            label="Add Selfie"
            severity="danger"
          />
          <Button
            disabled={!enableRemove}
            onClick={() => removeDocumentOrBrbDocument(selectedRow)}
            label="Remove Document"
            severity="danger"
          />
          <Button disabled={!enableSubmit} onClick={onSubmit} label="Submit" />
          <Button
            disabled={!enableResultDossier}
            onClick={() => openDossierResultModal()}
            label="Result Dossier"
            severity="danger"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentsForProcess;
