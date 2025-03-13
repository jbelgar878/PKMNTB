package com.pkmnteambuilder.teambuilder.controllers;

import com.pkmnteambuilder.teambuilder.models.Pokemon;
import com.pkmnteambuilder.teambuilder.services.PokemonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    private final PokemonService pokemonService;

    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    @GetMapping("/{id}")
    public Pokemon getPokemonById(@PathVariable Long id) {
        return pokemonService.getPokemonById(id);
    }


    @GetMapping("/team/{teamId}")
    public List<Pokemon> getPokemonsByTeam(@PathVariable Long teamId) {
        return pokemonService.getPokemonsByTeam(teamId);
    }

    @PostMapping
    public Pokemon createPokemon(@RequestBody Pokemon pokemon) {
        System.out.println("Recibiendo Pokémon: " + pokemon.getName()); // 🔍
        return pokemonService.createPokemon(pokemon);
    }


    @PutMapping("/{id}")
    public Pokemon updatePokemon(@PathVariable Long id, @RequestBody Pokemon updatedPokemon) {
        return pokemonService.updatePokemon(id, updatedPokemon);
    }

    @DeleteMapping("/{id}")
    public void deletePokemon(@PathVariable Long id) {
        pokemonService.deletePokemon(id);
    }
}
