import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Genre } from './Genre';

@ObjectType()
@Entity()
export class Movie {

    @Field(() => ID, { description: "Идентификатор фильма - первичный ключ" })
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ description: "Тип фильма, например, 'movie'" })
    @Column({ default: 'type', comment: "Тип фильма" })
    type: string;

    @Field({ nullable: true, description: "URL постера фильма" })
    @Column({ nullable: true, comment: "URL постера фильма" })
    poster: string;

    @Field({ description: "Название фильма" })
    @Column({ default: 'title', comment: "Название фильма" })
    title: string;

    @Field({ nullable: true, description: "Англоязычное название фильма" })
    @Column({ nullable: true, default: 'title_orig', comment: "Англоязычное название фильма" })
    enTitle: string;

    @Field({ nullable: true, description: "Год выпуска фильма" })
    @Column({ nullable: true, default: 1999, comment: "Год выпуска фильма" })
    year: number;

    @Field({ nullable: true, description: "Краткое описание фильма" })
    @Column({ nullable: true, comment: "Краткое описание фильма" })
    shortDescription: string;

    @Field({ nullable: true, description: "Описание фильма" })
    @Column({ nullable: true, comment: "Описание фильма" })
    description: string;

    @Field({ nullable: true, description: "Тип Movie" })
    @Column({ nullable: true, comment: "Тип Movie" })
    movie_kind: string;

    @Field({ nullable: true, description: "Возрастной рейтинг фильма" })
    @Column({ nullable: true, comment: "Возрастной рейтинг фильма" })
    ageRating: number;

    @Field({ nullable: true, description: "Рейтинг MPAA фильма" })
    @Column({ nullable: true, comment: "Рейтинг MPAA фильма" })
    rating_mpaa: string;

    @Field({ nullable: true, description: "Статус фильма" })
    @Column({ nullable: true, comment: "Статус фильма" })
    status: string;

    @Field({ nullable: true, description: "Эпизод (Всегосерий или фильм)" })
    @Column({ default: "1", comment: "Эпизод (Всегосерий или фильм)" })
    episode: string;

    @Field({ nullable: true, description: "Слоган фильма" })
    @Column({ nullable: true, comment: "Слоган фильма" })
    tagline: string;

    @Field({ nullable: true, description: "Продолжительность фильма в минутах" })
    @Column({ nullable: true, comment: "Продолжительность фильма в минутах" })
    movieLength: number;

    @Field({ nullable: true, description: "Ссылка на плеер" })
    @Column({ nullable: true, comment: "Ссылка на плеер" })
    player_link: string;

    @Field({ nullable: true, description: "Дата начала показа" })
    @Column({ nullable: true, comment: "Дата начала показа" })
    aired_at: Date;

    @Field({ nullable: true, description: "Дата релиза" })
    @Column({ nullable: true, comment: "Дата релиза" })
    released_at: Date;

    @Field({ nullable: true, description: "Дата релиза" })
    @Column({ nullable: true, comment: "Дата релиза" })
    premiere_ru: Date;

    @Field({ nullable: true, description: "Дата релиза" })
    @Column({ nullable: true, comment: "Дата релиза" })
    premiere_world: Date;

    @Field({ nullable: true, description: "Дата следующей серии" })
    @Column({ nullable: true, comment: "Дата следующей серии" })
    next_episode_at: Date;

    @Field({ nullable: true, description: "Продолжительность фильма в минутах" })
    @Column({ nullable: true, comment: "Продолжительность фильма в минутах" })
    duration: number;

    @Field({ nullable: true, description: "Минимальный возраст" })
    @Column({ nullable: true, comment: "Минимальный возраст" })
    minimal_age: number;

    @Field({ nullable: true, description: "Общее количество эпизодов" })
    @Column({ nullable: true, comment: "Общее количество эпизодов" })
    episodes_total: number;

    @Field({ nullable: true, description: "Количество эпизодов, которые уже вышли" })
    @Column({ nullable: true, comment: "Количество эпизодов, которые уже вышли" })
    episodes_aired: number;

    @Field({ nullable: true, description: "Рейтинг на Shikimori" })
    @Column({ nullable: true, comment: "Рейтинг на Shikimori" })
    shikimori_rating: number;

    @Field({ nullable: true, description: "Дата создания записи о фильме" })
    @Column({ nullable: true, comment: "Дата создания записи о фильме" })
    created_at: Date;

    @Field({ nullable: true, description: "Дата последнего обновления записи о фильме" })
    @Column({ nullable: true, comment: "Дата последнего обновления записи о фильме" })
    updated_at: Date;

    @Field(() => [Genre]) // Обратите внимание на использование [Genre] для массива жанров
    @ManyToMany(() => Genre, genre => genre.movies) // Многие ко многим, используем @ManyToMany
    @JoinTable() // Добавляем JoinTable для создания промежуточной таблицы
    genres: Genre[];
}

