import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { MovieResolver } from '../resolvers/MovieResolvers';
import http from 'http';
import expressApp from './expressApp';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { Request } from 'express'; // Импортируем только тип Request из express
import { DataSource } from 'typeorm';

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

    // Создаем HTTP-сервер с использованием Express приложения
    const httpServer = http.createServer(expressApp);

    // Создаем Apollo Server
    const apolloServer = new ApolloServer({
        schema,
        cache: 'bounded', // Устанавливаем ограниченный кэш
        context: ({ req }: { req: Request }) => ({
            dataSource: (req as any).dataSource as DataSource, // Добавляем источник данных в контекст
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageGraphQLPlayground()],
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
}

