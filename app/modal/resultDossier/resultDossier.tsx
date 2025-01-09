import { TabPanel, TabView } from "primereact/tabview";
import "./resultDossier.css";

const ResultDossier = ({ setModal, resultDossier }) => {
  const headerType = (object) => {
    if (object.action) {
      return object.action;
    } else if (object.type) {
      return object.type;
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
          <img
            src={`data:image/png;base64,${data}`}
            alt="Base64 content"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        );
      }
      return <span>{data}</span>;
    }

    if (typeof data !== "object") {
      // Renderiza valores primitivos diretamente
      return <span>{data.toString()}</span>;
    }

    if (Array.isArray(data)) {
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
          <div key={key} style={{ marginLeft: "1rem" }}>
            <strong>{key}:</strong> {renderFields(value)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="resultDossier-content">
        <TabView>
          {resultDossier.map((object, index) => (
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
                <h3>Detalhes do Objeto</h3>
                {renderFields(object)}
              </div>
            </TabPanel>
          ))}
        </TabView>
        <button onClick={() => setModal(false)}>Close</button>
      </div>
    </div>
  );
};
export default ResultDossier;
