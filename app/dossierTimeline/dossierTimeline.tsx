import { useEffect, useMemo, useState } from "react";
import "./dossierTimeline.css";

export default function DossierTimeline({
  dossier,
  documentTypes,
  setLoading,
  updateDocumentTypes,
}) {
  const [start, setStart] = useState("OK");
  const [processing, setProcessing] = useState("NOK");
  const [finish, setFinish] = useState("LOD");

  const dependencies = useMemo(
    () => [dossier, documentTypes],
    [documentTypes, dossier]
  );
  useEffect(() => {
    setStart("LOD");
    setProcessing("LOD");
    setFinish("LOD");

    let flag = false;
    let code = "";
    let status = "";
    const updatedDocs: { flag: boolean; code: string; status: string }[] = [];


    // Iteração do dossier.documentTypes de baixo para cima
    for (let i = (dossier?.documentTypes?.length || 0) - 1; i >= 0; i--) {
      const dossierDoctype = dossier?.documentTypes[i];

      if (dossierDoctype.code === null || dossierDoctype.code === "other") {
        continue;  // Ignora documentos com código null ou "other"
      }

      // Verifica se o código já existe no updatedDocs
      const existingIndex = updatedDocs.findIndex((e) => e.code === dossierDoctype.code);

      if (existingIndex === -1) {
        // Se não existe, adiciona um novo item
        code = dossierDoctype.code;
        flag = dossierDoctype.status === "FINISHED";  // Se status é "FINISHED", flag é true

        updatedDocs.push({ code, flag, status: dossierDoctype.status });
      } else {
        // Se o código já existe, atualiza o item no índice encontrado
        if (dossierDoctype.status === "ERROR" || dossierDoctype.status === "IDLE") {
          flag = false;  // Se o status é "ERROR" ou "IDLE", flag é false
        } else {
          flag = true;  // Caso contrário, flag é true
        }

        updatedDocs[existingIndex].status = dossierDoctype.status;
        updatedDocs[existingIndex].flag = flag; // Atualiza o flag para o valor correto
      }

    }

    if (dossier?.documentTypes == null) {
      setStart("LOD");
      setProcessing("LOD");
      setFinish("LOD");
    } else {
      setStart("OK");
      let docStatuses = true; // Inicializa como true

      for (let doctypeList of updatedDocs || []) {
        if (doctypeList.code === "other") {
          continue; // Ignora o item se for "other"
        } else if (doctypeList.status === "ERROR" || doctypeList.status === "IDLE") {
          docStatuses = false;
          setProcessing("NOK");
          setFinish("NOK");
          break; // Sai do loop se encontrar um erro, evitando chamadas posteriores
        } else if (doctypeList.flag === false) {
          docStatuses = false;
          setProcessing("LOD");
          setFinish("LOD");
          break; // Sai do loop assim que encontrar o flag falso
        }
      }

      // Se não houver erro, finalize o processo
      if (docStatuses) {
        setProcessing("OK");
        setFinish("OK");
      }
    }
  }, [dependencies]);


  function getStyle(type: string, state: string) {
    if (state == "LOD") {
      if (type == "ball") {
        return { borderColor: "rgb(115, 115, 115)" };
      } else {
        return { backgroundColor: "rgb(115, 115, 115)" };
      }
    } else if (state == "NOK") {
      if (type == "ball") {
        return { borderColor: "rgb(217, 34, 49)" };
      } else {
        return { backgroundColor: "rgb(217, 34, 49)" };
      }
    } else if (state == "OK") {
      if (type == "ball") {
        return { borderColor: "rgb(39, 128, 14)" };
      } else {
        return { backgroundColor: "rgb(39, 128, 14)" };
      }
    }
  }

  return (
    <div className="headerDiv">
      <p>Dossier Timeline </p>
      <table className="headerTable">
        <tbody>
          <tr className="headerTr">
            <td className="headerTd">
              <div className="headerTdDiv">
                <label className="ball" style={getStyle("ball", start)}>
                  {start}
                </label>
              </div>
            </td>
            <td className="headerTd">
              <div className="headerTdDiv">
                <div className="arrow" style={getStyle("arrow", start)}></div>
                <div
                  className="arrow"
                  style={getStyle("arrow", processing)}
                ></div>
              </div>
            </td>
            <td className="headerTd">
              <div className="headerTdDiv">
                <label className="ball" style={getStyle("ball", processing)}>
                  {processing}
                </label>
              </div>
            </td>
            <td className="headerTd">
              <div className="headerTdDiv">
                <div
                  className="arrow"
                  style={getStyle("arrow", processing)}
                ></div>
                <div className="arrow" style={getStyle("arrow", finish)}></div>
              </div>
            </td>
            <td className="headerTd">
              <div className="headerTdDiv">
                <label className="ball" style={getStyle("ball", finish)}>
                  {finish}
                </label>
              </div>
            </td>
          </tr>
          <tr className="headerTr">
            <td
              style={{
                textAlign: "center",
                width: "50px",
                margin: 0,
                padding: 0,
              }}
            >
              <label>Start</label>
            </td>
            <td
              style={{
                textAlign: "center",
                width: "50px",
                margin: 0,
                padding: 0,
              }}
              colSpan={3}
            >
              <label>Processing</label>
            </td>
            <td
              style={{
                textAlign: "center",
                width: "50px",
                margin: 0,
                padding: 0,
              }}
            >
              <label>Finish</label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
