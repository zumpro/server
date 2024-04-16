
/// movieResolvers.ts
import { Query, Resolver, Arg, Int, Mutation } from "type-graphql";
import { Movie } from "../entities/Movie";
import { Genre } from "../entities/Genre";
import { SortBy, getAllGenres, getAllMovies, getMovieById, searchMovies } from "./movieService";
import { Repository } from "typeorm";
import { dataSource } from "../database/database.config";



@Resolver()
export class MovieResolver {
    private readonly movieRepository: Repository<Movie>;
    private readonly genreRepository: Repository<Genre>;


    constructor() {
        this.movieRepository = dataSource.getRepository(Movie);
        this.genreRepository = dataSource.getRepository(Genre);

    }

    // Получить все жанры
    @Query(() => [Genre])
    async allGenres(

    ): Promise<Genre[]> {
        return getAllGenres(this.genreRepository);
    }

    // Получить фильмы
    @Query(() => [Movie])
    async movies(
        @Arg("page", () => Int, { defaultValue: 1 }) page: number,
        @Arg("limit", () => Int, { defaultValue: 20 }) limit: number,
        @Arg("sortBy", { defaultValue: SortBy.UPDATED_AT }) sortBy: SortBy,
        @Arg("sortOrder", { defaultValue: "DESC" }) sortOrder: "ASC" | "DESC",
        @Arg("searchTerm", () => String, { nullable: true }) searchTerm: string | null,
        @Arg("genreIds", () => Int, { nullable: true }) genreIds: number | null,
        @Arg("year", () => Int, { nullable: true }) year: number | null,

        @Arg("movieKind", () => String, { nullable: true }) movieKind: string | null // Добавляем аргумент для фильтрации по movie_kind
    ): Promise<Movie[]> {
        return getAllMovies(page, limit, sortBy, sortOrder, searchTerm, genreIds, this.movieRepository, movieKind,year);
    }

    // Получить фильм по идентификатору
    @Query(() => Movie, { nullable: true })
    async movieById(@Arg("id") id: number): Promise<Movie | null | undefined> {
        return getMovieById(id, this.movieRepository);
    }

    // Поиск фильмов по запросу
    @Query(() => [Movie])
    async searchMovies(@Arg("query") query: string): Promise<Movie[]> {
        return searchMovies(query, this.movieRepository);
    }

    // Добавить один фильм
    @Mutation(() => Movie)
    async createMovie(
        @Arg("title") title: string,
        @Arg("enTitle", { nullable: true }) enTitle: string,
        @Arg("year", { nullable: true }) year: number,
        // @Arg("type", { nullable: true }) type: string,
        // @Arg("poster", { nullable: true }) poster: string,
    ): Promise<Movie> {
        const movie = new Movie();
        movie.title = title;
        movie.enTitle = enTitle;
        movie.year = year;
        // movie.type = type;
        // movie.poster = poster;

        return await this.movieRepository.save(movie);
    }

    @Mutation(() => Boolean)
    async deleteMovie(
        @Arg("id") id: number
    ): Promise<boolean> {
        try {
            await this.movieRepository.delete(id);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

}

// Вспомогательный тип для ввода фильма

