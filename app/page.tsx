"use client";
import { useEffect, useState } from "react";
import DocumentsForProcess from "./documentsForProcess/documentsForProcess";
import DossierTimeline from "./dossierTimeline/dossierTimeline";
import ProcessedDocuments from "./processedDocuments/processedDocuments";
import Loading from "./modal/loading/loading"
import axios from "axios";
import Info from "./modal/info/info";

export default function Home() {

  //Login area
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([{
    flag: false,
    code: '',
    status: ''
  }])
  let loginData = { username: "xcorp", password: "Xerox123" }
  let apiUrl = 'https://www-portal.dev.alphaxerox.com.br/';
  let headers = {
      'x-tenant': 'xerox',
      'Authorization': "Bearer " + accessToken
  }
  const updateDocumentType = (codeToUpdate: any, newData: any) => {
    setDocumentTypes((prevDocumentTypes: any[]) =>
      prevDocumentTypes.map((doctype) =>
        doctype.code === codeToUpdate
          ? { ...doctype, ...newData } // Atualiza apenas o elemento correspondente
          : doctype // Mantém os demais elementos inalterados
      )
    );
  };
  useEffect(() => { login();
    setDossier(null);
      }, []);

  const login = () => {
    setLoading(true);
    // Enviar a requisição de login com Axios
    axios({
      method: 'post',
      url: apiUrl + 'auth-service/login',
      headers: headers,
      data: loginData, // Usar "data" para enviar o corpo da requisição
    })
      .then(response => {
        setAccessToken(response.data.accessToken); // Armazenar o accessToken após o login
        setLoading(false);
        setError(null);
        console.log(response)
      })
      .catch(error => {
        setError('Erro ao fazer login. Tente novamente.');
        setLoading(false);
      });
  }

  return (
    <div className='bodyDiv'>
      {loading && <Loading/>}
      <div className='contentContainer'>
        <Info />
        <DossierTimeline dossier={dossier} documentTypes={documentTypes} setLoading={setLoading} updateDocumentTypes={updateDocumentType}/>
        <DocumentsForProcess header={headers} setLoading={setLoading} setDossier={setDossier} dossier={dossier} loading={setLoading} setDocumentTypes={setDocumentTypes}/>
        <ProcessedDocuments dossier={dossier} />
      </div>
    </div>
  );
}