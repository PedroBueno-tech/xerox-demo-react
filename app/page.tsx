"use client";
import { useEffect, useState } from "react";
import DocumentsForProcess from "./documentsForProcess/documentsForProcess";
import DossierTimeline from "./dossierTimeline/dossierTimeline";
import ProcessedDocuments from "./processedDocuments/processedDocuments";
import Loading from "./modal/loading/loading";
import Info from "./modal/info/info";
import { PrimeReactProvider } from "primereact/api";
import Login from "./modal/login/login";
import Flow from "./flow/flow";

export default function Home() {
  //Login area
  const [accessToken, setAccessToken] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [logged, setLogged] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([
    {
      flag: false,
      code: "",
      status: "",
    },
  ]);

  let headers = {
    "x-tenant": tenant,
    Authorization: "Bearer " + accessToken,
  };
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const updateDocumentType = (codeToUpdate: any, newData: any) => {
    setDocumentTypes((prevDocumentTypes: any[]) =>
      prevDocumentTypes.map(
        (doctype) =>
          doctype.code === codeToUpdate
            ? { ...doctype, ...newData } // Atualiza apenas o elemento correspondente
            : doctype // Mantém os demais elementos inalterados
      )
    );
  };
  useEffect(() => {
    isLogged();
    setDossier(null);
  }, []);

  const isLogged = () => {
    let stored = sessionStorage.getItem("profile_data");
    if (stored) {
      let log = JSON.parse(stored);
      setLogged(true);
      setTenant(log.organization);
      setAccessToken(log.accessToken);
    } else {
      setLogged(false);
    }
  };

  return (
    <PrimeReactProvider>
      <div className="bodyDiv">
        {loading && <Loading />}
        {!logged && (
          <Login
            headers={headers}
            loading={setLoading}
            accessToken={setAccessToken}
            logged={setLogged}
            tenant={setTenant}
          />
        )}
        <span>Version: {version}</span>
        <div className="contentContainer">
          <Flow
            header={headers}
            apiUrl={process.env.NEXT_PUBLIC_API_URL}
            logged={logged}
            selectedFlow={setSelectedFlow}
          />
        </div>
        <div className="contentContainer">
          <Info />
          <DossierTimeline
            dossier={dossier}
            documentTypes={documentTypes}
            setLoading={setLoading}
            updateDocumentTypes={updateDocumentType}
          />
          <DocumentsForProcess
            header={headers}
            setLoading={setLoading}
            setDossier={setDossier}
            dossier={dossier}
            loading={setLoading}
            setDocumentTypes={setDocumentTypes}
            selectedFlow={selectedFlow}
          />
          <ProcessedDocuments dossier={dossier} />
        </div>
      </div>
    </PrimeReactProvider>
  );
}
