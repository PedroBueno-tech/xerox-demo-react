import { useState } from 'react';
import './newDocuments.css';



const NewDocument = ({ setModal, addDocuments, loading }) => {
  const [base64String, setBase64String] = useState<string | null>(null);
  const [inputFileName, setInputFileName] = useState<string>('');

  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "No file chosen");
  };

  const onFileSelectedChange = (event) => {
    handleFileChange(event)
    onFileSelected(event)
  }

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;

    if (!input.files || input.files.length === 0) {
      console.error('No file selected');
      return;
    }

    const file = input.files[0]; // O primeiro arquivo selecionado
    setInputFileName(file.name); // Armazena o nome do arquivo
    console.log(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const base64WithPrefix = reader.result as string;
      const base64WithoutPrefix = base64WithPrefix.replace(/^data:.*;base64,/, ''); // Remove o prefixo
      setBase64String(base64WithoutPrefix); // Armazena a string Base64
    };

    reader.onerror = (error) => {
      console.error('Error reading the file:', error);
    };

    reader.readAsDataURL(file); // Inicia a leitura do arquivo como Base64
    event.target.value = '';
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleSend = () => {
    if (!inputFileName || !base64String) {
      console.error('No file selected or file content is invalid');
      return;
    }
    console.log(inputFileName)
    console.log(base64String)
    addDocuments(inputFileName, base64String);
    setModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload New Document</h2>

        <div>
          <label>File Path: </label>
          <label htmlFor="fileInput" style={labelStyles}>
            Choose File
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={onFileSelectedChange}
          />
          <span style={{ marginLeft: "10px" }}>{fileName}</span>
        </div>

        <div className="button-group">
          <button onClick={handleClose}>
            Close
          </button>
          <button onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyles = {
  border: "1px solid rgb(193, 193,193)",
  padding: "10px 15px",
  cursor: "pointer",
  display: "inline-block",
};

export default NewDocument;
