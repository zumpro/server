import dataSource from './database.config';

/**
 * Инициализирует базу данных.
 * @throws Error если инициализация базы данных не удалась.
 */
export async function initializeDatabase(): Promise<void> {
    try {
        await dataSource.initialize();
        console.log('Подключение к базе данных успешно!');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
        throw new Error('Failed to initialize database');
    }
}
