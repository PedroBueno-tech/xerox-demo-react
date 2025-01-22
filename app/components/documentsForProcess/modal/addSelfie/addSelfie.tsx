import { useRef, useState } from "react";
import "./addSelfie.css";
import { Button } from "primereact/button";
import Webcam from "react-webcam";
import WebcamAccess from "./webcamAcess/webcamAcess";

const AddSelfie = ({
  setModal,
  addDocuments,
  loading,
  selectedFlow,
  doctype,
}) => {
  const [fileName, setFileName] = useState("No file chosen");

  type FileEntry = { name: string; value: string };
  const [tempFiles, setTempFiles] = useState<FileEntry[]>([]);
  const webcam = useRef<Webcam>(null);

  const handleFileChange = (event) => {
    const file = event.target.files;
    setFileName(file ? file.length + " files selected" : "No file chosen");
  };

  const onFileSelectedChange = (event) => {
    handleFileChange(event);
    onFileSelected(event);
  };

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;

    if (!input.files || input.files.length === 0) {
      alert("No file selected");
      return;
    }

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64WithPrefix = reader.result as string;
        const base64WithoutPrefix = base64WithPrefix.replace(
          /^data:.*;base64,/,
          ""
        ); // Remove o prefixo

        // Atualiza o estado tempFiles de forma imutável
        setTempFiles((prevFiles) => [
          ...prevFiles,
          { name: file.name, value: base64WithoutPrefix },
        ]);
      };

      reader.onerror = (error) => {
        alert("Error reading the file:" + error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleSend = () => {
    if (tempFiles.length === 0) {
      alert("No file selected or file content is invalid");
      return;
    }

    tempFiles.forEach((docs) => {
      if (!docs.name || !docs.value) {
        alert("Invalid document entry:" + docs);
        return; // Pule este documento inválido
      }
      if (selectedFlow == undefined) {
        alert("No flow selected");
        return;
      }
      try {
        if (selectedFlow.id == 15) {
          console.log(doctype);
          addDocuments(docs.name, docs.value, doctype);
        } else {
          addDocuments(docs.name, docs.value);
        }
      } catch (error) {
        alert(`Failed to add document ${docs.name}:` + error);
      }
    });

    setModal(false);
  };

  const handleClose = () => {
    setModal(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload New Selfie</h2>

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
            multiple
          />
          <span style={{ marginLeft: "10px" }}>{fileName}</span>
        </div>
        <WebcamAccess/>
        <div className="button-group">
          <Button onClick={handleClose} label="Close" />
          <Button onClick={handleSend} label="Send" />
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

export default AddSelfie;
