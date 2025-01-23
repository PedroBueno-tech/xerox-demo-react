import { useRef, useState } from "react";
import "./addSelfie.css";
import { Button } from "primereact/button";
import WebcamAccess from "./webcamAcess/webcamAccess";
import { Photo } from "@/app/components/interfaces/photo";

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

  const handleFileChange = (event) => {
    const file = event.target.files;
    setFileName(file ? file.length + " files selected" : "No file chosen");
  };

  const onFileSelectedChange = (
    input: React.ChangeEvent<HTMLInputElement> | Photo
  ) => {
    if ("key" in input && "base64" in input) {
      // Caso seja um objeto do tipo Photo
      onFileSelected(undefined, input);
    } else {
      // Caso seja um evento de input
      handleFileChange(input);
      onFileSelected(input);
    }
  };

  type Photo = {
    key: string;
    base64: string;
  };
  
  const onFileSelected = (
    event?: React.ChangeEvent<HTMLInputElement>,
    photo?: Photo
  ) => {
    if (event) {
      const input = event.target;
  
      if (!input.files || input.files.length === 0) {
        alert("No file selected");
        return;
      }
  
      const newFiles = Array.from(input.files).map((file) => {
        const reader = new FileReader();
  
        const promise = new Promise<{ name: string; value: string }>(
          (resolve, reject) => {
            reader.onload = () => {
              const base64WithPrefix = reader.result as string;
              const base64WithoutPrefix = base64WithPrefix.replace(
                /^data:.*;base64,/,
                ""
              );
              resolve({ name: file.name, value: base64WithoutPrefix });
            };
  
            reader.onerror = () => {
              reject(new Error("Error reading the file"));
            };
  
            reader.readAsDataURL(file);
          }
        );
  
        return promise;
      });
  
      Promise.all(newFiles)
        .then((files) => {
          // Substituir arquivos antigos pela nova seleção
          setTempFiles(files);
        })
        .catch((error) => {
          alert("Error processing files: " + error.message);
        });
    }
  
    if (photo) {
      // Substituir arquivos antigos pela nova foto
      setTempFiles([{ name: photo.key, value: photo.base64 }]);
    }
  };
  

  const handleSend = () => {

    if (tempFiles.length === 0) {
      alert("No file selected or Selfie taken");
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
      <div className="modal-content-selfie">
        {/*<h2>Upload New Selfie</h2>

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
        <span> Or Take One right now: </span>*/}
        <WebcamAccess setPhoto={onFileSelectedChange} />

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
