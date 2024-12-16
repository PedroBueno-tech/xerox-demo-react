const Eureka = require('eureka-js-client').Eureka;

// Configure Eureka client
const client = new Eureka({
    instance: {
        app: 'document-retrieval', // Nome da aplicação
        hostName: 'localhost',      // Nome do host (pode ser 'localhost' ou o IP do seu servidor)
        ipAddr: '127.0.0.1',       // IP local
        port: {
            '$': 4200,              // Porta onde a aplicação está rodando
            '@enabled': 'true',     // Habilitar a porta
        },
        vipAddress: 'nodejs-service', // Endereço VIP (pode ser qualquer nome de serviço)
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',        // Nome do data center
        },
    },
    eureka: {
        host: 'localhost',        // Host do servidor Eureka
        port: 8761,               // Porta do servidor Eureka (padrão é 8761)
        servicePath: '/eureka/apps/', // Caminho para registrar serviços no Eureka
    }
});

// Start Eureka client
client.start(error => {
    if (error) {
        console.error('Error starting Eureka client:', error);
    } else {
        console.log('Eureka client started successfully');
    }
});
