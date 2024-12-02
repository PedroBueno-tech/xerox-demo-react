import { useState } from 'react';
import ViewResult from '../modal/viewResult/viewResult';
import './processedDocuments.css'

const ProcessedDocuments = ({ dossier }) => {

    const [modal, setModal] = useState(false);
    const [infoToShow, setInfoToShow] = useState();

    const formatDateIntl = (dateString:any) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const openModal = (data:any) => {
        console.log(data)
        setModal(true)
        setInfoToShow(data)
    }

    return (
        
        <div className="body-forProcessedDocuments">
            {modal && <ViewResult item={infoToShow} setModal={setModal}/>}
            <div className="processedDocuments">
                <p>Processed Document List</p>
                <div className="tableWrapper">
                    <table>
                        <thead>
                            <tr>
                                <th className="dossierId" >Dossier Identification </th>
                                <th className="documentType">Document Type</th>
                                <th className="status">Status</th>
                                <th className="dateAndTime">Date and Time</th>
                                <th className="result">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dossier != null &&
                                dossier?.documentTypes?.map((item: any) => (

                                    <tr key={item.id}>
                                        <td className="dossierId">{item.dossier}</td>
                                        <td className="documentType">{item.code}</td>
                                        <td className="status">{item.status == 'FINISHED'? 'APPROVED': 'REJECTED'}</td>
                                        <td className="dateAndTime">{formatDateIntl(item.audit.createdOn)}</td>
                                        <td className="result">
                                            <button onClick={() => openModal(item)}>view</button>
                                        </td>
                                    </tr>

                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}

export default ProcessedDocuments;