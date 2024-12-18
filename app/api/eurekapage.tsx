import { GetServerSideProps } from "next";
import { Eureka } from "eureka-js-client";

type Props = {
  message: string; // Mensagem para exibir no caso de sucesso
  error?: string;  // Mensagem de erro (opcional)
};

const EurekaPage = ({ message, error }: Props) => {
  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>Erro: {error}</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}



export const getServerSideProps: GetServerSideProps = async () => {
  console.log('1')
  try {
    const client = new Eureka({
      instance: {
        app: 'document-retrieval', // Nome da aplicação
        hostName: 'localhost',      // Nome do host (pode ser 'localhost' ou o IP do seu servidor)
        ipAddr: '127.0.0.1',       // IP local
        port: {
          '$': 4200,              // Porta onde a aplicação está rodando
          '@enabled': 'true',     // Habilitar a porta
        },
        vipAddress: 'document-retrieval', // Endereço VIP (pode ser qualquer nome de serviço)
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'Alphaville/Barueri', // Nome do data center
        },
        environment: 'test',          // Ambiente de execução
        leaseExpirationEnabled: true, // Lease expiration habilitado
        renewsThreshold: 0,           // Threshold de renovações
        renewsLastMin: 92,            // Últimas renovações
      },
      eureka: {
        host: '172.16.1.42',        // IP do servidor Eureka
        port: 8761,                 // Porta do servidor Eureka
        servicePath: '/eureka/apps/', // Caminho para registrar serviços no Eureka
      }
    });
    console.log('2')

    // Inicia o cliente do Eureka
    await new Promise<void>((resolve, reject) => {
      client.start((error) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          console.log('sucess')
          resolve();
        }
      });
    });
    console.log('4')

    // Retorna mensagem de sucesso
    return {
      props: { message: "Registrado com sucesso no Eureka!" },
    };
  } catch (error: any) {
    // Retorna mensagem de erro
    return {
      props: { message: "Falha ao registrar no Eureka", error: error.message },
    };
  }
};

export default EurekaPage;
