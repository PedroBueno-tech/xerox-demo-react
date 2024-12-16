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
    for (let dossierDoctype of dossier?.documentTypes || []) {
      if (dossierDoctype.code === null || dossierDoctype === "other") {
      } else if (!updatedDocs.some((e) => e.code === dossierDoctype.code)) {
        code = dossierDoctype.code;
        updatedDocs.push({ code, flag, status });
        console.log(updatedDocs);
      }
    }

    for (let dossierDoctype of dossier?.documentTypes || []) {
      for (let doctypeList of updatedDocs || []) {
        if (
          dossierDoctype.code === doctypeList.code &&
          doctypeList.code !== "other"
        ) {
          doctypeList.flag = true;
          doctypeList.status = dossierDoctype.status;
        }
      }
    }

    if (dossier?.documentTypes == null) {
      setStart("LOD");
      setProcessing("LOD");
      setFinish("LOD");
    } else {
      setStart("OK");
      let docStatuses = false;

      for (let doctypeList of updatedDocs || []) {
        if (doctypeList.code === "other") {

        } else if (doctypeList.status == "ERROR" || doctypeList.status === "IDLE") {
          setProcessing("NOK");
          setFinish("NOK");
        } else if (doctypeList.flag === false) {
          docStatuses = false;
          setProcessing("LOD");
          setFinish("LOD");
          break;
        } else {
          docStatuses = true;
        }
      }

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
