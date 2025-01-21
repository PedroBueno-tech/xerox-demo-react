import { TabPanel, TabView } from "primereact/tabview";
import "./resultDossier.css";
import { Image } from "primereact/image";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DownloadButton from "./downloadButton/downloadButton";
import { Button } from "primereact/button";

const ResultDossier = ({ setModal, resultDossier }) => {
  const headerType = (object) => {
    if (object.action) {
      return object.action.toUpperCase();
    } else if (object.type) {
      return object.type.toUpperCase();
    }
  };

  const isBase64Image = (str) => {
    try {
      const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!base64Pattern.test(str) || str.length % 4 !== 0) {
        return false;
      }
      const decoded = atob(str);
      return (
        decoded.startsWith("\x89PNG") ||
        decoded.startsWith("GIF") ||
        decoded.startsWith("\xFF\xD8\xFF")
      );
    } catch (e) {
      return false;
    }
  };

  const renderFields = (data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return <span>No data</span>;
    }

    if (typeof data === "string") {
      if (isBase64Image(data)) {
        return (
          <Image
            src={`data:image/png;base64,${data}`}
            alt="Base64 content"
            height="100px"
            preview
          />
        );
      }
      return <span>{data}</span>;
    }

    if (typeof data === "object" && !Array.isArray(data)) {
      // Verifica se o objeto tem propriedades (filhos)
      const keys = Object.keys(data);
      if (keys.length === 0) {
        return <span>No data</span>;
      }

      return (
        <DataTable value={keys.map((key) => ({ key, value: data[key] }))}>
          <Column field="key" header="Key" />
          <Column
            field="value"
            header="Value"
            body={(rowData) => renderFields(rowData.value)}
          />
        </DataTable>
      );
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <span>No data</span>;
      }

      return (
        <DataTable value={data}>
          {Object.keys(data[0]).map((key) => (
            <Column
              key={key}
              field={key}
              header={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </DataTable>
      );
    }

    return <span>{data.toString()}</span>;
  };

  const orderedResultDossier = () => {
    return [...resultDossier].sort((a, b) => {
      const aKey = a.action || a.type || "";
      const bKey = b.action || b.type || "";
      return aKey.localeCompare(bKey);
    });
  };

  const ordered = orderedResultDossier();

  return (
    <div className="modal-overlay">
      <div className="resultDossier-content">
        <div className="resultDossier-ButtonDiv">
          <DownloadButton jsonData={resultDossier} fileName={"ResultDossier"} />
          <Button onClick={() => setModal(false)} label="Close" severity="danger" />
        </div>
        <div className="card">
          <TabView>
            {ordered.map((object, index) => (
              <TabPanel
                key={index}
                headerTemplate={(options) => (
                  <div
                    className="flex align-items-center gap-2 p-3"
                    style={{ cursor: "pointer" }}
                    onClick={options.onClick}
                  >
                    <span className="font-bold white-space-nowrap">
                      {headerType(object)}
                    </span>
                  </div>
                )}
              >
                <h3>Processed Document</h3>
                {renderFields(object)}
              </TabPanel>
            ))}
          </TabView>
        </div>
      </div>
    </div>
  );
};

export default ResultDossier;
