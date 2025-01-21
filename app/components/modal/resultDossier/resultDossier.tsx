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

  // Função robusta para verificar se uma string é Base64
  const isBase64Image = (str: string) => {
    try {
      const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!base64Pattern.test(str) || str.length % 4 !== 0) {
        return false; // Verifica se é um Base64 válido
      }

      // Decodifica para verificar se é uma imagem
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

  const renderFields = (data: any) => {
    if (data === null || data === undefined) {
      // Renderiza valores nulos ou indefinidos como "N/A"
      return <span>N/A</span>;
    }

    if (typeof data === "string") {
      // Verifica se a string é Base64 e tenta renderizar como imagem
      if (isBase64Image(data)) {
        return (
          <>
            <br />
            <Image
              src={`data:image/png;base64,${data}`}
              alt="Base64 content"
              className=""
              height="100px"
              preview
            />
          </>
        );
      }
      return <span>{data}</span>;
    }

    if (typeof data !== "object") {
      // Renderiza valores primitivos diretamente
      return <span>{data.toString()}</span>;
    }

    if (typeof data === "object" && data?.action === "LLMPROMPT") {
      console.log(data)
      return (
        <>
          <div>
            
            {Object.entries(data)
              .filter(([key]) => key !== "fields" && key !== "payload")
              .map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {renderFields(value)}
                </div>
              ))}
          </div>
          <DataTable value={data.payload.fields}>
            <Column field="name" header="name"></Column>
            <Column field="stdName" header="stdName"></Column>
            <Column field="score" header="score"></Column>
            <Column field="value" header="value"></Column>
          </DataTable>
        </>
      );
    }

    if (Array.isArray(data)) {
      // Verifica se o array está vazio
      if (data.length === 0) {
        return <span>No item found </span>; // Ou qualquer mensagem apropriada
      }

      // Renderiza arrays como uma lista de itens
      return (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {typeof item === "object" ? renderFields(item) : item.toString()}
            </li>
          ))}
        </ul>
      );
    }

    // Renderiza objetos como campos e valores
    return (
      <div>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {renderFields(value)}
          </div>
        ))}
      </div>
    );
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
          <Button onClick={() => setModal(false)} label="close" severity="danger"/>
        </div>
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
              <div>
                <h3>Processed Document</h3>
                {renderFields(object)}
              </div>
            </TabPanel>
          ))}
        </TabView>
      </div>
    </div>
  );
};
export default ResultDossier;
