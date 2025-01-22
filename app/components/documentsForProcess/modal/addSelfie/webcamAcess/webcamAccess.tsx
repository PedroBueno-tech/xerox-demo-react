import React, { useState } from "react";
import { Button } from "primereact/button";
import Webcam from "react-webcam";
import { Photo } from "@/app/components/interfaces/photo";
import './webcamAccess.css'

const WebcamAccess = ({ setPhoto }) => {
  const [takePhoto, setTakePhoto] = useState(false);
  const webcamRef = React.useRef<Webcam>(null);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot(); // Captura a imagem como base64
      if (imageSrc) {
        // Obtém a data atual formatada
        const currentDate = new Date().toISOString(); // Formato ISO 8601
        const photo: Photo = {
          key: `screenshot-${currentDate}`, // Chave com prefixo e data
          base64: imageSrc.replace(/^data:image\/\w+;base64,/, ""), // Remove o prefixo do base64
        };

        setPhoto(photo);
        alert("Photo captured!");
      } else {
        alert("Failed to capture photo.");
      }
    } else {
      alert("Webcam is not available.");
    }
  };

  return (
    <div>
      <Button
        onClick={() => setTakePhoto(!takePhoto)}
        label={takePhoto ? "Stop Camera" : "Start Camera"}
        severity="danger"
      />
      {takePhoto && (
        <div className="webcam-container">
          {/* Webcam */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user", // Usa a câmera frontal
            }}
            className="webcam-video"
          />
          <Button
            onClick={capturePhoto}
            label="Capture Photo"
            style={{ marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
};

export default WebcamAccess;
