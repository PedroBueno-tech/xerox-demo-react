// pages/api/eureka.js
import { Eureka } from 'eureka-js-client';

export default function handler(req, res) {
    const client = new Eureka({
        instance: {
            app: 'document-retrieval',
            hostName: 'localhost',
            ipAddr: '127.0.0.1',
            port: {
                '$': 4200,
                '@enabled': 'true',
            },
            vipAddress: 'nodejs-service',
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: 'localhost',
            port: 8761,
            servicePath: '/eureka/apps/',
        }
    });

    // Inicializa o cliente Eureka no lado do servidor
    client.start((error) => {
        if (error) {
            console.error('Error starting Eureka client:', error);
            return res.status(500).json({ error: 'Failed to start Eureka client' });
        }
        res.status(200).json({ message: 'Eureka client started successfully' });
    });
}
