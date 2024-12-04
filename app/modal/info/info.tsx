import { useEffect, useState } from 'react';
import './info.css'

export default function Info() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  useEffect(() => {
    // Armazena a função original de window.alert
    const originalAlert = window.alert;
  
    // Substitui window.alert com a função personalizada
    window.alert = (message) => {
      setModalMessage(message); // Define a mensagem
      setIsModalOpen(true); // Abre o modal
  
      // Fecha automaticamente após 3 segundos
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    };
  
    // Restaura a função original ao desmontar o componente
    return () => {
      window.alert = originalAlert;
    };
  }, []);

return (
  <>
    {isModalOpen && (
      <div className='modal-overlay'>
        <div className="modal-content">
          <p>{modalMessage}</p>
        </div>
      </div>
    )}
  </>

)

}