// database.config.ts

import { DataSource } from 'typeorm';
import { Movie } from '../entities/Movie';
import { Genre } from '../entities/Genre';

const dataSource = new DataSource({
    type: 'postgres',
    url:process.env.DATABASE_UR,
    entities: [Movie, Genre], // Укажите все ваши сущности здесь
    synchronize: true,// Автоматическое создание таблиц приложения в базе данных (в разработке это удобно, но не рекомендуется в продакшене)
    logging: true, // Логгирование SQL-запросов (включено для отладки)
});


export default dataSource;