const { createServer } = require('http');
const next = require('next');
const { Eureka } = require('eureka-js-client');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function initEureka() {
  const client = new Eureka({
    instance: {
      app: 'document-retrieval',
      hostName: 'localhost',
      ipAddr: '127.0.0.1',
      port: {
        '$': 4200,
        '@enabled': 'true',
      },
      vipAddress: 'document-retrieval',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'Alphaville/Barueri',
      },
      environment: 'test',
      leaseExpirationEnabled: true,
      renewsThreshold: 0,
      renewsLastMin: 92,
    },
    eureka: {
      host: '172.16.1.42',
      port: 8761,
      servicePath: '/eureka/apps/',
    },
  });

  console.log('Iniciando o cliente Eureka...');
  await new Promise((resolve, reject) => {
    client.start((error) => {
      if (error) {
        console.error('Erro ao iniciar Eureka:', error);
        reject(error);
      } else {
        console.log('Cliente Eureka iniciado com sucesso!');
        resolve();
      }
    });
  });
}

app.prepare().then(async () => {
    await initEureka();
  
    createServer((req, res) => {
      handle(req, res);
    }).listen(4200, () => {
      console.log('Servidor rodando na porta 4200');
    });
  });