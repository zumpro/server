// Genre.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Movie } from './Movie';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Genre {
    @Field(() => String)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: true })
    @Column({ unique: true })
    name: string;

    @Field(() => [Movie])
    @ManyToMany(() => Movie, movie => movie.genres) // Многие ко многим, используем @ManyToMany
    movies: Movie[];


}
