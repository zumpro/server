// Подключение модуля для работы с метаданными TypeScript
import "reflect-metadata";
// Подключение модуля для конфигурации переменных окружения
import "dotenv-safe/config";
// Подключение библиотек для создания Express-приложения, работы с GraphQL и другими модулями
import express, { Request, Response, NextFunction } from 'express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { MovieResolver } from './resolvers/MovieResolvers';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { Movie } from './entities/Movie';
import dataSource from './database.config';
import session from 'express-session';
import bodyParser from 'body-parser';
// import cors from "cors";
import http from 'http';
// import fs from 'fs';
// import { addMoviesToDatabase } from "./parser";

// Асинхронная функция для запуска Express-приложения и Apollo Server
async function startExpressApp() {
    // Инициализация Express-приложения

    const app = express();



    // Подключение middleware для работы с сессиями
    app.use(
        session({
            secret: 'your-secret-key',
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


    if (!dataSource.isConnected) {
        await dataSource.initialize();
        console.log('Подключение к базе данных успешно!');
    }



    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [MovieResolver],
            validate: true,
        }),
        context: ({ req }) => ({
            dataSource: (req as any).dataSource
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageGraphQLPlayground()],
        introspection: true,
    });

    // Добавление middleware для CORS в ответах сервера
    app.use((_, res, next): any => {
        res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

    // Запуск Apollo Server с использованием Express
    await server.start();
    server.applyMiddleware({
        app,
        cors: true
    });

    try {
        // // Инициализация подключения к базе данных


        // Middleware для доступа к dataSource в маршрутах Express
        app.use((req: Request, res: Response, next: NextFunction) => {
            if (dataSource.isInitialized) {
                (req as any).dataSource = dataSource;
                next();
            } else {
                res.status(500).send('Ошибка подключения к базе данных');
            }
        });

        // Пример обработчика маршрута Express для запроса данных из базы
        app.get('/movies', async (req: Request, res: Response) => {
            try {
                const movies = await (req as any).dataSource.getRepository(Movie).find();
                res.json(movies);
            } catch (error) {
                console.error('Ошибка при запросе фильмов:', error.message);
                res.status(500).send('Ошибка при запросе фильмов');
            }
        });

        // Запуск сервера Express
        app.listen(process.env.PORT, () => {
            console.log(`Сервер запущен на порту ${process.env.PORT}`);
        });

        // Обработчик завершения работы приложения для закрытия соединения с базой данных
        process.on('SIGINT', async () => {
            try {
                await dataSource.destroy();
                console.log('Соединение с базой данных закрыто.');
                process.exit(0);
            } catch (error) {
                console.error('Ошибка при закрытии соединения с базой данных:', error.message);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Ошибка инициализации подключения:', error.message);
    }
}

// Запуск функции для старта Express-приложения
startExpressApp().catch((err) => {
    console.error(err);
});;










