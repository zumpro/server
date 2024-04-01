// database.config.ts
import "reflect-metadata";
import { config } from "dotenv-safe";

config({
    allowEmptyValues: true,
});

import { DataSource } from 'typeorm';
import { Movie } from '../entities/Movie';
import { Genre } from '../entities/Genre';
// import * as path from "path"; 

 const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Movie, Genre], // Укажите все ваши сущности здесь
    synchronize: true,// Автоматическое создание таблиц приложения в базе данных (в разработке это удобно, но не рекомендуется в продакшене)
    logging: false, // Логгирование SQL-запросов (включено для отладки)
    // migrations: [path.join(__dirname, "./migrations/*")],
});


export {dataSource}
