import React, { useState } from "react";
import { Button } from "primereact/button";
import Webcam from "react-webcam";
import { Photo } from "@/app/components/interfaces/photo";
import "./webcamAccess.css";

const WebcamAccess = ({ setPhoto }) => {
  const [takePhoto, setTakePhoto] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null); // Estado para armazenar a foto capturada
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
        setCapturedPhoto(imageSrc); // Define a foto capturada
        setTakePhoto(true);
        alert("Selfie captured!");
      } else {
        alert("Failed to capture Selfie.");
      }
    } else {
      alert("Webcam is not available.");
    }
  };

  return (
    <div>
      <div className="webcam-container">
        {/* Exibe a webcam enquanto nenhuma foto foi tirada */}
        {!takePhoto && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 1920, // Largura máxima
                height: 1080, // Altura máxima
                facingMode: "user", // Usa a câmera frontal
              }}
              className="webcam-video"
            />
            <Button
              onClick={capturePhoto}
              label="Capture selfie"
              style={{ marginTop: "10px" }}
            />
          </>
        )}

        {takePhoto && capturedPhoto && (
          <>
            <div className="webcam-video">
              <img
                src={capturedPhoto}
                alt="Captured"
                className="webcam-video"
              />
            </div>
            <Button
              onClick={() => {
                setTakePhoto(false);
                setCapturedPhoto(null);
              }}
              label="Retake Selfie"
              style={{ marginTop: "10px", marginLeft: "10px" }}
              severity="secondary"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WebcamAccess;
