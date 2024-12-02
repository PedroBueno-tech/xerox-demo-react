import { useState } from 'react';
import './newDocuments.css';



const NewDocument = ({ setModal, addDocuments, loading }) => {
  const [base64String, setBase64String] = useState<string | null>(null);
  const [inputFileName, setInputFileName] = useState<string>('');

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("hello");
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
      console.log(file, base64String)
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
    addDocuments(inputFileName, base64String);
    setModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload New Document</h2>

        <div>
          <label htmlFor="fileInput">File Path:</label>
          <input
            id="fileInput"
            type="file"
            className="inputFile"
            onChange={onFileSelected}            
          />
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

export default NewDocument;
