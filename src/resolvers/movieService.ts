import { Genre } from "../entities/Genre";
import { Movie } from "../entities/Movie";
import { Repository, FindManyOptions, FindOneOptions, ILike } from "typeorm";


// Определение перечисления для допустимых значений сортировки
export enum SortBy {
    TITLE = "title",
    TYPE = "type",
    YEAR = "year",
    MOVIE_KIND = "movie_kind",
    AGE_RATING = "ageRating",
    RATING_MPAA = "rating_mpaa",
    STATUS = "status",
    EPISODE = "episode",
    MOVIE_LENGTH = "movieLength",
    AIRED_AT = "aired_at",
    RELEASED_AT = "released_at",
    PREMIERE_RU = "premiere_ru",
    PREMIERE_WORLD = "premiere_world",
    DURATION = "duration",
    MINIMAL_AGE = "minimal_age",
    SHIKIMORI_RATING = "shikimori_rating",
    CREATED_AT = "created_at",
    UPDATED_AT = "updated_at",
    // Добавьте другие поля сортировки по мере необходимости
}
// Получить все фильмы с учетом поиска, фильтрации и пагинации
export async function getAllMovies(
    page: number,
    limit: number,
    sortBy: SortBy,
    sortOrder: "ASC" | "DESC",
    searchTerm: string | null,
    genreIds: number | null,
    movieRepository: Repository<Movie>,
    movieKind: string | null,
    year: number | null,

    
): Promise<Movie[]> {
    try {
        const offset = (page - 1) * limit;

        const queryBuilder = movieRepository.createQueryBuilder("movie")
            .leftJoinAndSelect("movie.genres", "genre")
            .orderBy(`movie.${sortBy}`, sortOrder)
            .skip(offset)
            .take(limit);

        if (searchTerm) {
            queryBuilder.where(`movie.title ILike :searchTerm`, { searchTerm: `%${searchTerm}%` });
        }

        if (year !== null && year !== undefined) {
            queryBuilder.andWhere("movie.year = :year", { year });
        }

        if (genreIds !== null && genreIds !== undefined) {
            queryBuilder.andWhere("genre.id = :genreIds", { genreIds });
        }


        if (movieKind) { // Добавляем фильтрацию по movieKind, если он определен
            queryBuilder.andWhere("movie.movie_kind = :movieKind", { movieKind });
        }

        return await queryBuilder.getMany();
    } catch (error) {
        console.error("Ошибка при получении фильмов:", error.message);
        throw new Error("Ошибка при получении фильмов");
    }
}

// Получить все жанры
export async function getAllGenres(
    genreRepository: Repository<Genre>,
): Promise<Genre[]> {
    try {
        return await genreRepository.find();
    } catch (error) {
        console.error("Ошибка при получении всех жанров:", error.message);
        throw new Error("Ошибка при получении всех жанров");

    }
}

// Получить фильм по идентификатору
export async function getMovieById(id: number, movieRepository: Repository<Movie>): Promise<Movie | null> {
    try {
        if (!Number.isInteger(id) || id <= 0) {
            console.error(`ID должен быть положительным целым числом, получено: ${id}`);
            throw new Error(`ID должен быть положительным целым числом, получено: ${id}`);
        }

        const options: FindOneOptions<Movie> = { where: { id } };
        const movie = await movieRepository.findOne(options);

        if (!movie) {
            console.error(`Фильм с id ${id} не найден`);
            throw new Error(`Фильм с id ${id} не найден`);
        }

        return movie;
    } catch (error) {
        console.error(`Ошибка при получении фильма с id ${id}:`, error.message);
        throw new Error(`Ошибка при получении фильма с id ${id}`);
    }
}

// Поиск фильмов по запросу
export async function searchMovies(query: string, movieRepository: Repository<Movie>): Promise<Movie[]> {
    try {
        const options: FindManyOptions<Movie> = {
            where: {
                title: ILike(`%${query}%`),
            },
        };
        return await movieRepository.find(options);
    } catch (error) {
        console.error(`Ошибка при поиске фильмов для запроса ${query}:`, error.message);
        throw new Error(`Ошибка при поиске фильмов для запроса ${query}`);
    }
}
