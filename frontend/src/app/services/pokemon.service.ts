import { Injectable } from '@angular/core';
import { Resultado } from '../interfaces/pokeapi';
import { Pokemon } from '../interfaces/pokemon';
import { BattleItem } from './../services/battleItems';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
    

  constructor() { }

  // Función para obtener los Pokémon por página
  async getByPage(page: number, size: number = 40): Promise<Resultado[]> {
    try {
      const offset = size * (page - 1);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${size}=&offset=${offset}`); // Asegúrate de que la URL es correcta
      const data = await response.json();

      if (data && data.results) {
        return data.results;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  // Función para obtener un Pokémon por su ID
  async getById(id: string): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await response.json();
  }

  // Función para obtener la descripción de un Pokémon
  async getDescription(id: string | number) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const resJson = await response.json();
    const texto = resJson.flavor_text_entries.find((e: any) => e.language.name === "es");
    return texto.flavor_text;
  }

  // Nueva función para obtener un objeto por ID o nombre
  async getItemDetails(idOrName: string): Promise<any> {
    try {
      // Convertir a minúsculas y reemplazar los espacios por guiones
      const formattedIdOrName = idOrName.toLowerCase().replace(/ /g, '-');

      const response = await fetch(`https://pokeapi.co/api/v2/item/${formattedIdOrName}`);
      const itemDetails = await response.json();
      return itemDetails;
    } catch (error) {
      console.error("Error al obtener el objeto:", error);
      return null;
    }
  }




  // Dentro de pokemon.service.ts
  getAllItems(): any[] {
    return Object.values(BattleItem); // Devuelve los valores (los objetos) dentro de BattleItem
  }


  // Función para obtener las habilidades de un Pokémon por su ID
  async getPokemonAbilities(pokemonName: string): Promise<any[]> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);  // Asegúrate de que pokemonName esté en minúsculas
      const pokemonData = await response.json();
      const abilities = pokemonData.abilities.map((abilityInfo: any) => abilityInfo.ability);
      return abilities;
    } catch (error) {
      console.error('Error al obtener las habilidades del Pokémon:', error);
      return [];
    }
  }



  // Función para obtener la descripción de una habilidad específica
  // Función para obtener la descripción larga de una habilidad específica
  async getAbilityDescription(abilityName: string): Promise<string> {
    try {
      // Llamamos a la API de habilidades con el nombre de la habilidad
      const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
      const data = await response.json();

      // Buscar la descripción larga en español (si no existe, buscar en inglés)
      const effectEntry = data.effect_entries.find((entry: any) => entry.language.name === "es")
        || data.effect_entries.find((entry: any) => entry.language.name === 'en');

      // Retornar la descripción larga si está disponible, o un mensaje por defecto
      return effectEntry ? effectEntry.effect : 'Sin descripción';
    } catch (error) {
      console.error("Error al obtener la descripción de la habilidad:", error);
      return 'Sin descripción';
    }
  }




  // Función para obtener los movimientos de un Pokémon por su ID
  async getPokemonMoves(pokemonName: string): Promise<any[]> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      return data.moves; // Devuelve los movimientos que el Pokémon puede aprender
    } catch (error) {
      console.error("Error al obtener movimientos del Pokémon:", error);
      return [];
    }
  }

  // Función para obtener la descripción de un movimiento
  async getMoveDescription(moveId: string): Promise<string> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/move/${moveId}`);
      const data = await response.json();
      return data.effect_entries.find((entry: any) => entry.language.name === 'es')?.short_effect || 'Sin descripción';
    } catch (error) {
      console.error("Error al obtener la descripción del movimiento:", error);
      return 'Sin descripción';
    }
  }

  // Función para obtener los detalles del Pokémon desde su URL
  async getPokemonDetails(url: string): Promise<any> {
    try {
      const response = await fetch(url);  // Realizamos una solicitud GET a la URL proporcionada
      const pokemonDetails = await response.json();
      return pokemonDetails;
    } catch (error) {
      console.error("Error al obtener los detalles del Pokémon:", error);
      return null;  // Si hay error, retornamos null
    }
  }

  // Función para obtener la URL de la imagen de un Pokémon por su ID
static async getPokemonImageUrl(pokemonId: number): Promise<string> {
        try {
            // Aquí puedes hacer la lógica para obtener la imagen desde la API o localmente
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const pokemonData = await response.json();
            return pokemonData.sprites.other['official-artwork'].front_default || ''; // Devuelve la URL de la imagen
        } catch (error) {
            console.error("Error obteniendo la imagen del Pokémon:", error);
            return '';  // Devuelve un string vacío en caso de error
        }
    }

}
