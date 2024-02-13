import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создание таблиц
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS genre (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS movie (
                id SERIAL PRIMARY KEY,
                type VARCHAR(255) NOT NULL DEFAULT 'type',
                poster_url VARCHAR(255),
                title VARCHAR(255) NOT NULL DEFAULT 'title',
                enTitle VARCHAR(255) NOT NULL DEFAULT 'title_orig',
                year INT DEFAULT 1999,
                shortDescription VARCHAR(255),
                description VARCHAR(255),
                ageRating INT,
                rating_mpaa VARCHAR(255),
                status VARCHAR(255),
                episode VARCHAR(255) NOT NULL DEFAULT '1',
                tagline VARCHAR(255),
                movieLength INT,
                top10 INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS movie_genres_genre (
                "movieId" INT NOT NULL,
                "genreId" INT NOT NULL,
                PRIMARY KEY ("movieId", "genreId"),
                FOREIGN KEY ("movieId") REFERENCES movie(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY ("genreId") REFERENCES genre(id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        // Вставка данных
        await queryRunner.query(`
            INSERT INTO genre (id, name)
            VALUES
                (21, 'Драма'),
                (22, 'Романтика'),
                -- Добавьте остальные записи здесь
                (70, 'Юри');
        `);

        await queryRunner.query(`
            INSERT INTO movie (id, type, poster_url, title, "enTitle", year, "shortDescription", description, "ageRating", rating_mpaa, status, episode, tagline, "movieLength", top10, created_at, updated_at)
            VALUES
                (2558, 'movie', 'https://st.kp.yandex.net/images/film_big/5331991.jpg', 'Этот глупый свин не понимает мечту сестры на прогулке', 'Seishun Buta Yarou wa Odekake Sister no Yume wo Minai', 2023, NULL, 'Позади изнурительный декабрь, близится окончание учебного года. У Сакуты и Маи осталось не так много времени, ведь Маи в этом году оканчивает школу. Тем временем Каэдэ, сестра Сакуты, планирует поступить в школу, где учится брат.', NULL, 'PG-13', 'released', '1', NULL, NULL, 1000, 2024-01-12 23:19:38, 2024-01-29 17:46:48),
                -- Добавьте остальные записи здесь
                (4964, 'movie', 'https://st.kp.yandex.net/images/film_big/8233.jpg', 'Манускрипт ниндзя', 'Jûbê Ninpûchô', 1993, NULL, 'В провинции Ямасиро неожиданно начинается эпидемия чумы. Все жители бегут оттуда, а глава одного из соседних самурайских кланов, клана Мотидзукэ, отправляет на разведку в эти места подчиняющиеся ему остатки клана ниндзя Кога. Однако какие-то странные существа, наделенные невероятной силой, мгновенно расправляются с незваными гостями, и спастись удается только девушке-ниндзя Кагэро, потому что ей помог бродячий ниндзя-самурай Дзюбэй. Но Дзюбэй и не догадывается, что убил не просто демона, а одного из Восьми демонов Кимона — группы воинов с поразительными нечеловеческими возможностями, и для оставшейся семерки он — смертельный враг.', NULL, 'R+', 'released', '1', NULL, NULL, 3406, 2015-04-27 13:26:04, 2015-04-27 13:26:04);
        `);

        await queryRunner.query(`
            INSERT INTO movie_genres_genre ("movieId", "genreId")
            VALUES
                (2558, 21),
                (2558, 22),
                -- Добавьте остальные записи здесь
                (4964, 59),
                (4964, 40),
                (4964, 35),
                (4964, 32);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM movie_genres_genre;`);
        await queryRunner.query(`DELETE FROM movie;`);
        await queryRunner.query(`DELETE FROM genre;`);

        await queryRunner.query(`DROP TABLE IF EXISTS movie_genres_genre;`);
        await queryRunner.query(`DROP TABLE IF EXISTS movie;`);
        await queryRunner.query(`DROP TABLE IF EXISTS genre;`);
    }
}


