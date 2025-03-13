package com.pkmnteambuilder.teambuilder.services;

import com.pkmnteambuilder.teambuilder.models.Pokemon;
import com.pkmnteambuilder.teambuilder.repositories.PokemonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PokemonService {

    private final PokemonRepository pokemonRepository;

    public PokemonService(PokemonRepository pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }

    public List<Pokemon> getPokemonsByTeam(Long teamId) {
        return pokemonRepository.findByTeamId(teamId);  // Usar un método en el repositorio para filtrar directamente
    }


    public Pokemon createPokemon(Pokemon pokemon) {
        if (pokemon.getName() == null || pokemon.getName().isEmpty()) {
            throw new RuntimeException("El nombre del Pokémon es obligatorio");
        }
        return pokemonRepository.save(pokemon);
    }


    public Pokemon updatePokemon(Long id, Pokemon updatedPokemon) {
        return pokemonRepository.findById(id).map(pokemon -> {
            pokemon.setName(updatedPokemon.getName());
            pokemon.setLevel(updatedPokemon.getLevel());
            pokemon.setAbility(updatedPokemon.getAbility());
            pokemon.setNature(updatedPokemon.getNature());
            pokemon.setItem(updatedPokemon.getItem());
            pokemon.setTypes(updatedPokemon.getTypes());
            pokemon.setHp(updatedPokemon.getHp());
            pokemon.setAttack(updatedPokemon.getAttack());
            pokemon.setDefense(updatedPokemon.getDefense());
            pokemon.setSpecialAttack(updatedPokemon.getSpecialAttack());
            pokemon.setSpecialDefense(updatedPokemon.getSpecialDefense());
            pokemon.setSpeed(updatedPokemon.getSpeed());
            pokemon.setMove1(updatedPokemon.getMove1());  // Actualizando los movimientos
            pokemon.setMove2(updatedPokemon.getMove2());
            pokemon.setMove3(updatedPokemon.getMove3());
            pokemon.setMove4(updatedPokemon.getMove4());
            return pokemonRepository.save(pokemon);
        }).orElseThrow(() -> new RuntimeException("Pokémon no encontrado"));
    }

    public void deletePokemon(Long id) {
        pokemonRepository.deleteById(id);
    }

    public Pokemon getPokemonById(Long id) {
        return pokemonRepository.findById(id).orElseThrow(() -> new RuntimeException("Pokémon no encontrado"));
    }

}
