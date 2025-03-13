// pokemon-tb.interface.ts

import { Nature, NATURE_EFFECTS } from './../services/pokemon-natures';  // Importamos las naturalezas
import { Pokemon } from './pokemon'; // Importamos el tipo Pokemon
import { PokemonService } from './../services/pokemon.service';  // Importamos el servicio

export interface PokemonTB {
    name: string;
    types: string[];
    moves: string[];  // Será un array con 4 slots vacíos inicialmente
    level: number;
    ability: string;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    };
    nature: string;
    item?: string;
    imageUrl?: string;
}

// Función que transforma los datos de la pokeapi a PokemonTB
export function transformToPokemonTB(pokemon: Pokemon, nature: Nature = 'quirky'): PokemonTB {
    // Obtención de las estadísticas base del Pokémon
    let stats = {
        hp: pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
        attack: pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
        defense: pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
        specialAttack: pokemon.stats.find(stat => stat.stat.name === 'special-attack')?.base_stat || 0,
        specialDefense: pokemon.stats.find(stat => stat.stat.name === 'special-defense')?.base_stat || 0,
        speed: pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
    };

    // Aplicamos los efectos de la naturaleza con la función separada
    stats = applyNatureEffects(stats, nature);

    // Inicializamos el array moves con 4 slots vacíos
    const initialMoves = ["", "", "", ""];  // 4 espacios vacíos para los movimientos

    // Creamos el objeto PokemonTB
    return {
        name: pokemon.name,
        types: pokemon.types.map(type => type.type.name),
        moves: initialMoves,  // Asignamos los slots vacíos
        level: 50,
        ability: pokemon.abilities.length > 0 ? pokemon.abilities[0].ability.name : "Desconocida",
        stats,
        nature,
        imageUrl: pokemon.sprites.other['official-artwork'].front_default
    };
}


// Función que transforma los datos de la pokeapi a PokemonTB
export async function transformToPokemonTBfrombackend(pokemon: any, nature: Nature = 'quirky'): Promise<PokemonTB> {
    // Verificación de propiedades de stats
    let stats = {
        hp: pokemon.hp || 0,
        attack: pokemon.attack || 0,
        defense: pokemon.defense || 0,
        specialAttack: pokemon.specialAttack || 0,
        specialDefense: pokemon.specialDefense || 0,
        speed: pokemon.speed || 0,
    };

    // Aplicamos los efectos de la naturaleza con la función separada
    stats = applyNatureEffects(stats, nature);

    // Inicializamos los movimientos, reemplazando los null con cadenas vacías
    const initialMoves = [
        pokemon.move1 || "", 
        pokemon.move2 || "", 
        pokemon.move3 || "", 
        pokemon.move4 || ""
    ];

    // Ahora obtenemos la imagen usando la función async
    const imageUrl = await PokemonService.getPokemonImageUrl(pokemon.name); // Debes esperar que retorne la URL

    // Creamos el objeto PokemonTB
    return {
        name: pokemon.name,
        types: pokemon.types ? pokemon.types.split('/').map((type: string) => type.trim()) : [], // Si 'types' es una cadena, la convertimos en un array
        moves: initialMoves,  // Asignamos los slots vacíos si son null
        level: pokemon.level || 50,  // Nivel predeterminado en caso de que no esté definido
        ability: pokemon.ability || "Desconocida",  // Hacer fallback si no hay habilidad
        stats,
        nature,
        item: pokemon.item || "", // Si no hay item, lo dejamos vacío
        imageUrl: imageUrl || ''  // Si no tiene imagen, se deja vacío
    };
}

// Función para aplicar los efectos de la naturaleza a las estadísticas
export function applyNatureEffects(stats: PokemonTB['stats'], nature: Nature): PokemonTB['stats'] {
    if (nature && NATURE_EFFECTS[nature]) {
        const { increase, decrease } = NATURE_EFFECTS[nature];

        return {
            ...stats,
            [increase]: Math.floor(stats[increase] * 1.1), // Aumenta un 10%
            [decrease]: Math.floor(stats[decrease] * 0.9), // Reduce un 10%
        };
    }
    return stats;
}
