import { useEffect, useState } from "react";
import ViewResult from "../modal/viewResult/viewResult";
import "./processedDocuments.css";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ProcessedDocuments = ({ dossier }) => {
  let newDossier = dossier?.documentTypes?.sort((a, b) =>
    a.audit.createdOn < b.audit.createdOn ? 1 : -1
  );

  const [modal, setModal] = useState(false);
  const [infoToShow, setInfoToShow] = useState();

  const formatDateIntl = (dateString: any) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);

    return `${formattedDate} ${formattedTime}`;
  };

  const openModal = (data: any) => {
    setModal(true);
    setInfoToShow(data);
  };

  const itemStatus = (data: any) => {
    if (data.status == "FINISHED") {
      return "APPROVED";
    } else if (data.status == "IDLE") {
      return "PROCESSING";
    } else if (data.status == "ERROR") {
      if (
        data.step === "COMPLEMENTATION_AUTO" ||
        data.step === "TYPIFY_AUTO" ||
        data.step === "VALIDATION_AUTO"
      ) {
        return "PROCESSING";
      }
      return "REJECTED";
    }
  };

  return (
    <div className="body-forProcessedDocuments">
      {modal && <ViewResult item={infoToShow} setModal={setModal} />}
      <div className="processedDocuments">
        <strong>Processed Document List</strong>
        <div className="tableWrapper-processed">
          <DataTable value={newDossier} dataKey="id" responsiveLayout="scroll">
                {/* Coluna para Dossier Identification */}
                <Column
                  field="dossier"
                  header="Dossier Identification"
                  bodyClassName="dossierId"
                />
          
                {/* Coluna para Document Type */}
                <Column
                  field="name"
                  header="Document Type"
                  bodyClassName="documentType"
                />
          
                {/* Coluna para Status */}
                <Column
                  field="status"
                  header="Status"
                  body={(rowData) => itemStatus(rowData)}
                  bodyClassName="status"
                />
          
                {/* Coluna para Date and Time */}
                <Column
                  field="audit.createdOn"
                  header="Date and Time"
                  body={(rowData) => formatDateIntl(rowData.audit.createdOn)}
                  bodyClassName="dateAndTime"
                />
          
                {/* Coluna para Result com botão */}
                <Column
                  header="Result"
                  body={(rowData) => (
                    <Button
                      onClick={() => openModal(rowData)}
                      label="View"
                      severity="danger"
                    />
                  )}
                  bodyClassName="result"
                />
              </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ProcessedDocuments;
