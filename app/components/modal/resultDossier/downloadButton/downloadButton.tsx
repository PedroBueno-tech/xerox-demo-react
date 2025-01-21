import { Button } from 'primereact/button';
import React from 'react';

interface DownloadButtonProps {
  jsonData: object; // Objeto JSON que você deseja baixar
  fileName: string; // Nome do arquivo que será baixado
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ jsonData, fileName }) => {
  const downloadJsonFile = () => {
    // Converte o objeto JSON em formato de string
    const jsonStr = JSON.stringify(jsonData, null, 2);
    
    // Cria um blob com o JSON stringificado
    const blob = new Blob([jsonStr], { type: 'application/json' });
    
    // Cria um URL para o blob
    const url = URL.createObjectURL(blob);
    
    // Cria um elemento 'a' invisível para o download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    
    // Adiciona o elemento 'a' ao corpo do documento
    document.body.appendChild(a);
    
    // Simula um clique no elemento 'a' para iniciar o download
    a.click();
    
    // Remove o elemento 'a' após o download
    document.body.removeChild(a);
    
    // Libera o objeto URL criado
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={downloadJsonFile} label='Download JSON' severity='danger'/>
  );
};

export default DownloadButton;
