import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MovieResolver } from '../resolvers/MovieResolvers';
import http from 'http';
import https from 'https';
import fs from 'fs';
import expressApp from './expressApp';
import {  ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { Request } from 'express';
import { DataSource } from 'typeorm';

// Определяем режим работы приложения (разработка или продакшн)
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Запускает Apollo Server.
 * @returns Промис, который разрешается после запуска сервера.
 */
export async function startApolloServer(): Promise<void> {
    // Создаем схему GraphQL на основе резолверов
    const schema = await buildSchema({
        resolvers: [MovieResolver],
        validate: true,
    });

    // Создаем сервер
    let server: http.Server | https.Server; // Явное указание типа данных для переменной server
    if (isProduction) {
            // Получаем пути к файлам сертификата и ключа из переменных окружения
        const privateKeyPath = process.env.SSL_PRIVATE_KEY_PATH || '/etc/ssl/private.key';
        const certificatePath = process.env.SSL_CERTIFICATE_PATH || '/etc/ssl//certificate.crt';

        // Читаем приватный ключ и сертификат из файлов
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
        const certificate = fs.readFileSync(certificatePath, 'utf8');

        // Создаем объект credentials для HTTPS
        const credentials = { key: privateKey, cert: certificate };

        server = https.createServer(credentials, expressApp);
    } else {
        // В разработке используем HTTP
         server = http.createServer(expressApp);
    }

    // Создаем Apollo Server
    const apolloServer = new ApolloServer({
        schema,
        cache: 'bounded',
        context: ({ req }: { req: Request }) => ({
            dataSource: (req as any).dataSource as DataSource,
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        introspection: true,
        persistedQueries: false,
    });

    // Запускаем Apollo Server
    await apolloServer.start();

    // Применяем Apollo Server как промежуточное ПО для Express приложения
    apolloServer.applyMiddleware({
        app: expressApp,
        cors: true,
    });

    // Возвращаем промис, разрешенный после запуска сервера
    await new Promise<void>((resolve) => server.listen({ port: process.env.PORT }, resolve));
    console.log(`🚀 Server ready at ${isProduction ? 'https' : 'http'}://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
}
