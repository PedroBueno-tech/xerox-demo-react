import { useEffect, useState } from 'react';
import './info.css'
import { Button } from 'primereact/button';

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
      }, 10000);
    };
  
    // Restaura a função original ao desmontar o componente
    return () => {
      window.alert = originalAlert;
    };
  }, []);
  function preClose () {
    setIsModalOpen(false)
  }

return (
  <>
    {isModalOpen && (
      <div className='modal-overlay-info'>
        <div className="modal-content">
          <div style={{display:"flex", justifyContent: "space-between"}}>
            <div>
              <p>{modalMessage}</p>
            </div>
            <div>
              <Button className='Button' onClick={() => preClose()} label='Close' severity='danger' />
            </div>
          </div>
          
          
          
        </div>
      </div>
    )}
  </>

)

}