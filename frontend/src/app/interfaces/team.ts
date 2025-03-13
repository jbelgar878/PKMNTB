import { PokemonTB } from "./pokemon-tb";

export interface Team {
    id: number;
    name: string;
    pokemons: PokemonTB[];
}