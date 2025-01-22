import React, { useRef, useEffect } from "react";

const WebcamAccess = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Agora o TypeScript não reclama
        }
      })
      .catch((err) => {
        console.error("Erro ao acessar a câmera:", err);
      });
  }, []);

  return <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />;
};

export default WebcamAccess;
