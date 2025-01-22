import { Button } from "primereact/button";
import React, { useRef, useEffect, useState } from "react";

const WebcamAccess = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
      const [takePhoto, setTakePhoto] = useState(false);
  
    useEffect(() => {
      // Ativa a câmera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setStream(mediaStream); // Salva o stream no estado
        })
        .catch((err) => {
          console.error("Erro ao acessar a câmera:", err);
        });
  
      // Limpa o stream ao desmontar o componente
      return () => {
        stopCamera();
      };
    }, []);
  
    const stopCamera = () => {
      if (stream) {
        // Para todas as trilhas do stream
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };

  return (
   <>
    <Button onClick={() => setTakePhoto(!takePhoto)}  label="Take selfie" severity="danger"/>
        {takePhoto && (
            <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />;
            </div>
        )}
        
    
   </> 
  )
};

export default WebcamAccess;
