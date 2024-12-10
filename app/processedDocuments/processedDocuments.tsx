import { useEffect, useState } from 'react';
import ViewResult from '../modal/viewResult/viewResult';
import './processedDocuments.css'

const ProcessedDocuments = ({ dossier }) => {

    let newDossier = dossier?.documentTypes?.sort((a,b) => (a.audit.createdOn < b.audit.createdOn ? -1 : 1));

    const [modal, setModal] = useState(false);
    const [infoToShow, setInfoToShow] = useState();

    const formatDateIntl = (dateString:any) => {
        const date = new Date(dateString);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(date);

        return `${formattedDate} ${formattedTime}`;
    };

    const openModal = (data:any) => {
        console.log(data)
        setModal(true)
        setInfoToShow(data)
    }

    const itemStatus = (data:any) => {
        if(data.status == 'FINISHED'){
            return 'APPROVED';
        } else if (data.status == 'IDLE') {
            return 'PROCESSING'
        } else if (data.status == 'ERROR'){
            return 'REJECTED'
        }
    }

    return (
        
        <div className="body-forProcessedDocuments">
            {modal && <ViewResult item={infoToShow} setModal={setModal}/>}
            <div className="processedDocuments">
                <p>Processed Document List</p>
                <div className="tableWrapper-processed">
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
                                newDossier?.map((item: any) => (

                                    <tr key={item.id}>
                                        <td className="dossierId">{item.dossier}</td>
                                        <td className="documentType">{item.code}</td>
                                        <td className="status">{itemStatus(item)}</td>
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