// index.ts
// Подключение модуля для работы с метаданными TypeScript
import "reflect-metadata";
import { config } from "dotenv-safe";
import expressApp from './server/expressApp';
import { startApolloServer } from './server/apolloServer';
import { initializeDatabase } from './database/databaseInitializer';
import {dataSourceMiddleware} from './middleware/dataSourceMiddleware';


config({
  allowEmptyValues: true,
});
// Инициализация базы данных
initializeDatabase()
.then(() => {

    
    // Добавление middleware для доступа к dataSource
    expressApp.use(dataSourceMiddleware);
    
    // Добавление обработчика маршрута для фильмов
    // expressApp.get('/movies', moviesRouteHandler);

    // Запуск Express-приложения
    expressApp.listen(process.env.PORT, () => {
      console.log(`Сервер запущен на порту ${process.env.PORT}`);
    });

    // Запуск Apollo Server
    startApolloServer();

      })
      .catch((error) => {
        console.error('Ошибка при инициализации базы данных:', error);
        console.error('Что-то пошло не так. Пожалуйста, проверьте конфигурацию и настройки вашего приложения.');
      });
