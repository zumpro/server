// movieService.ts
import { Genre } from "../entities/Genre";
import { Movie } from "../entities/Movie";
import {  FindManyOptions, FindOneOptions, ILike } from "typeorm";
import { dataSource } from "../database/database.config";

export async function getAllGenres(): Promise<Genre[]> {
    try {
        return await dataSource.getRepository(Genre).find();
    } catch (error) {
        console.error("Ошибка при получении всех жанров:", error.message);
        throw new Error("Ошибка при получении всех жанров");
    }
}

export async function getAllMovies(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: "ASC" | "DESC",
    searchTerm: string | null,
    genreIds: number | null,
    movieRepository: any
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

        if (genreIds !== null && genreIds !== undefined) {
        queryBuilder.andWhere("genre.id = :genreIds", { genreIds });
        }
        


        return await queryBuilder.getMany();
    } catch (error) {
        console.error("Ошибка при получении фильмов:", error.message);
        throw new Error("Ошибка при получении фильмов");
    }
}

export async function getMovieById(id: number,movieRepository:any): Promise<Movie | null | undefined> {
    try {
                    if (!Number.isInteger(id)) {
                        console.error(`ID должен быть целым числом, получено: ${id}`);
                        throw new Error(`ID должен быть целым числом, получено: ${id}`);
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

export async function searchMovies(query: string, movieRepository:any): Promise<Movie[]> {
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
