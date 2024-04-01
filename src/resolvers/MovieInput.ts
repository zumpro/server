import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class MovieInput {

    @Field()
    title: string;

    @Field({ nullable: true })
    enTitle: string;

    @Field(() => Int, { nullable: true })
    year: number;
}



