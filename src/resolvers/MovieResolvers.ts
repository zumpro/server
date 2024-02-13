import { EntityMetadata, FindManyOptions, FindOneOptions, ILike, Repository } from "typeorm";
import { Movie } from "../entities/Movie";
import { Arg, Int, Query, Resolver } from "type-graphql";
import {dataSource} from "../database/database.config";
// import { GraphQLString } from "graphql";
import { Genre } from "../entities/Genre";

interface SortFilterItem {
    name: string;
    slug: string | null;
    sortKey: string;
    reverse: boolean;
}

export const defaultSort: SortFilterItem = {
    name: 'Актуальность',
    slug: null,
    sortKey: 'desc',
    reverse: false
};

@Resolver()
export class MovieResolver {
    private readonly movieRepository: Repository<Movie>;

    constructor() {
        this.movieRepository = dataSource.getRepository(Movie);
    }


    @Query(() => [Genre])
    async allGenres(): Promise<Genre[]> {
        try {
            const allGenres = await dataSource.getRepository(Genre).find();
            return allGenres;
        } catch (error) {
            console.error("Ошибка при получении всех жанров:", error.message);
            throw new Error("Ошибка при получении всех жанров");
        }
    }

    @Query(() => [Movie])
    async movies(
        @Arg("page", () => Int, { defaultValue: 1 }) page: number,
        @Arg("limit", () => Int, { defaultValue: 50 }) limit: number,
        @Arg("sortBy", { defaultValue: "updated_at" }) sortBy: string,
        @Arg("sortOrder", { defaultValue: "DESC" }) sortOrder: "ASC" | "DESC",
        @Arg("searchTerm", () => String, { nullable: true }) searchTerm: string | null,
        @Arg("genreIds", () => [Int], { nullable: true }) genreIds: number[] | null
    ): Promise<Movie[]> {
        try {
            const offset = (page - 1) * limit;

            let entityMetadata: EntityMetadata | undefined;

            try {
                entityMetadata = dataSource.getMetadata(Movie);
            } catch (error) {
                console.error("Ошибка при получении метаданных сущности Movie:", error.message);
                throw new Error("Не удалось получить метаданные сущности Movie");
            }

            // Проверка наличия поля sortBy в метаданных сущности Movie
            if (!entityMetadata || !entityMetadata.columns.find((column) => column.propertyName === sortBy)) {
                throw new Error(`Поле сортировки "${sortBy}" не существует в сущности Movie`);
            }

            // Создаем QueryBuilder
            const queryBuilder = this.movieRepository
                .createQueryBuilder("movie")
                .leftJoinAndSelect("movie.genres", "genre")
                .orderBy(`movie.${sortBy}`, sortOrder)
                .skip(offset)
                .take(limit);

            if (searchTerm) {
                queryBuilder.where(`movie.title ILike :searchTerm`, { searchTerm: `%${searchTerm}%` });
            }

            // Добавляем фильтрацию по жанрам, если они предоставлены
            if (genreIds && genreIds.length > 0) {
                queryBuilder.andWhere("genre.id IN (:...genreIds)", { genreIds });
            }

            // Получаем фильмы
            const movies = await queryBuilder.getMany();

            return movies;
        } catch (error) {
            console.error("Ошибка при получении фильмов:", error.message);
            throw new Error("Ошибка при получении фильмов");
        }
    }
    /**
     * Получить фильм по идентификатору
     * @param id - Идентификатор фильма
     */
    @Query(() => Movie, { nullable: true })
    async movieById(@Arg("id") id: number): Promise<Movie | null | undefined> {
        try {
            // Проверяем, что id является целым числом
            if (!Number.isInteger(id)) {
                console.error(`ID должен быть целым числом, получено: ${id}`);
                throw new Error(`ID должен быть целым числом, получено: ${id}`);
            }

            const options: FindOneOptions<Movie> = { where: { id } };
            const movie = await this.movieRepository.findOne(options);

            if (!movie) {
                console.error(`Фильм с id ${id} не найден`);
                // Можно выбросить ошибку или вернуть null в зависимости от вашего случая
                throw new Error(`Фильм с id ${id} не найден`);
            }

            return movie;
        } catch (error) {
            console.error(`Ошибка при получении фильма с id ${id}:`, error.message);
            throw new Error(`Ошибка при получении фильма с id ${id}`);
        }
    }


    /**
     * Поиск фильмов по запросу
     * @param query - Запрос для поиска
     */
    @Query(() => [Movie])
    async searchMovies(@Arg("query") query: string): Promise<Movie[]> {
        try {
            const options: FindManyOptions<Movie> = {
                where: {
                    title: ILike(`%${query}%`),
                },
            };
            return await this.movieRepository.find(options);
        } catch (error) {
            console.error(`Ошибка при поиске фильмов для запроса ${query}:`, error.message);
            throw new Error(`Ошибка при поиске фильмов для запроса ${query}`);
        }
    }
}
