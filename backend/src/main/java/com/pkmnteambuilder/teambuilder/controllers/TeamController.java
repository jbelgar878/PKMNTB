package com.pkmnteambuilder.teambuilder.controllers;

import com.pkmnteambuilder.teambuilder.DTO.PokemonDTO;
import com.pkmnteambuilder.teambuilder.DTO.StatsDTO;
import com.pkmnteambuilder.teambuilder.DTO.TeamDTO;
import com.pkmnteambuilder.teambuilder.models.Pokemon;
import com.pkmnteambuilder.teambuilder.models.Team;
import com.pkmnteambuilder.teambuilder.repositories.PokemonRepository;
import com.pkmnteambuilder.teambuilder.repositories.TeamRepository;
import com.pkmnteambuilder.teambuilder.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/teams")  // Ruta base para todos los métodos
public class TeamController {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final PokemonRepository pokemonRepository;

    // Elimina el segundo parámetro pokemonRepository1 y usa pokemonRepository
    public TeamController(TeamRepository teamRepository, UserRepository userRepository, PokemonRepository pokemonRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.pokemonRepository = pokemonRepository;
    }

    // Obtener equipos por ID de usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTeamsByUser(@PathVariable Long userId) {
        log.info("Obteniendo equipos para el usuario con ID: {}", userId);
        List<Team> teams = teamRepository.findByUserId(userId);
        if (teams == null || teams.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontraron equipos para el usuario con ID: " + userId);
        }
        return ResponseEntity.ok(teams);
    }

    // Crear un nuevo equipo
    @PostMapping("/{userId}")
    @Transactional
    public ResponseEntity<Team> createTeam(@PathVariable("userId") Long userId, @RequestBody Team team) {
        // Verificamos que el usuario existe
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Asignamos el userId directamente sin crear la relación de entidad User
        team.setId(null);  // Hibernate asignará el ID automáticamente
        team.setUserId(userId);  // Asignamos solo el userId

        // Verificar que no existe un equipo con el mismo nombre para este usuario
        if (teamRepository.existsByNameAndUserId(team.getName(), userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        // Guardamos el equipo
        Team savedTeam = teamRepository.save(team);
        return ResponseEntity.ok(savedTeam);
    }

    // Actualizar equipo
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody TeamDTO updatedTeam) {

        // Buscar el equipo en la base de datos
        return teamRepository.findById(id).map(team -> {

            // Verificar que el Id del equipo es el mismo que el que estamos actualizando
            if (!team.getId().equals(updatedTeam.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // El usuario no tiene permiso para actualizar este equipo
            }

            // Comparar y actualizar los Pokémon
            updatePokemons(team, updatedTeam);

            // Guardamos el equipo actualizado
            Team savedTeam = teamRepository.save(team);
            return ResponseEntity.ok(savedTeam);

        }).orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    private void updatePokemons(Team team, TeamDTO updatedTeam) {


        // Obtener los Pokémon actuales del equipo desde la base de datos
        List<Pokemon> currentPokemons = pokemonRepository.findByTeamId(team.getId());

        // Lista de Pokémon recibidos del frontend
        List<PokemonDTO> newPokemons = updatedTeam.getPokemons();

        // Crear una lista de nombres de Pokémon recibidos, para comparar
        List<String> newPokemonNames = newPokemons.stream()
                .map(PokemonDTO::getName)   // Extrae el nombre de cada Pokémon
                .filter(Objects::nonNull)  // Filtra los nombres nulos
                .toList();  // Recoge los resultados en una lista

        // Comparar Pokémon y actualizarlos o agregarlos
        for (PokemonDTO newPokemon : newPokemons) {
            if (newPokemon == null) continue; // Si el Pokémon es nulo, lo ignoramos

            // Buscar Pokémon por nombre
            Optional<Pokemon> existingPokemonOpt = currentPokemons.stream()
                    .filter(pokemon -> pokemon.getName().equals(newPokemon.getName()))
                    .findFirst();



            if (existingPokemonOpt.isPresent()) {

                // El Pokémon ya está en el equipo, actualizar sus atributos
                Pokemon existingPokemon = existingPokemonOpt.get();

                // Actualizamos los atributos del Pokémon
                updatePokemonAttributes(existingPokemon, newPokemon);

                // Guardar el Pokémon actualizado
                pokemonRepository.save(existingPokemon);

            } else {


                // Si el Pokémon no está en el equipo, lo agregamos
                Pokemon createdPokemon = new Pokemon();
                createdPokemon.setName(newPokemon.getName());
                createdPokemon.setTeam(team);
                updatePokemonAttributes(createdPokemon, newPokemon);


                // Guardar el nuevo Pokémon creado
                pokemonRepository.save(createdPokemon);
                // Asignamos el Pokémon al primer slot vacío
                assignPokemonToTeamSlot(team, createdPokemon);
            }
        }

        // Eliminar Pokémon que ya no están en el equipo (si se eliminó alguno)
        // Eliminar Pokémon que ya no están en el equipo (si se eliminó alguno)
        for (Pokemon currentPokemon : currentPokemons) {

            log.info("pokemon a borrar: {}", currentPokemon.getName());

            // Si el Pokémon no está en el nuevo conjunto de nombres, lo eliminamos
            if (!newPokemonNames.contains(currentPokemon.getName())) {
                // Buscar en los 6 Pokémon del equipo y poner en null el que coincida
                if (team.getIdPokemon1() != null && team.getIdPokemon1().equals(currentPokemon.getId())) {
                    team.setIdPokemon1(null); // Poner el ID en null
                } else if (team.getIdPokemon2() != null && team.getIdPokemon2().equals(currentPokemon.getId())) {
                    team.setIdPokemon2(null);
                } else if (team.getIdPokemon3() != null && team.getIdPokemon3().equals(currentPokemon.getId())) {
                    team.setIdPokemon3(null);
                } else if (team.getIdPokemon4() != null && team.getIdPokemon4().equals(currentPokemon.getId())) {
                    team.setIdPokemon4(null);
                } else if (team.getIdPokemon5() != null && team.getIdPokemon5().equals(currentPokemon.getId())) {
                    team.setIdPokemon5(null);
                } else if (team.getIdPokemon6() != null && team.getIdPokemon6().equals(currentPokemon.getId())) {
                    team.setIdPokemon6(null);
                }

                // Actualizamos el equipo en la base de datos
                teamRepository.save(team); // Guardamos el equipo con el Pokémon en null

                // Eliminamos el Pokémon de la base de datos
                pokemonRepository.delete(currentPokemon);
            }
        }

    }

    private void updatePokemonAttributes(Pokemon pokemon, PokemonDTO newPokemon) {
        pokemon.setLevel(newPokemon.getLevel());
        pokemon.setAbility(newPokemon.getAbility());
        pokemon.setNature(newPokemon.getNature());
        pokemon.setItem(newPokemon.getItem());

        // Asignar los movimientos
        List<String> movesList = newPokemon.getMoves();
        if (movesList != null) {
            // Asignar movimientos a los slots correspondientes
            if (movesList.size() > 0) pokemon.setMove1(movesList.get(0));
            if (movesList.size() > 1) pokemon.setMove2(movesList.get(1));
            if (movesList.size() > 2) pokemon.setMove3(movesList.get(2));
            if (movesList.size() > 3) pokemon.setMove4(movesList.get(3));
        }


        // Convertir la lista de tipos en un solo string
        List<String> typesList = newPokemon.getTypes();

        String types = null;
        if (typesList != null && !typesList.isEmpty()) {
            if (typesList.size() == 1) {
                types = typesList.get(0);
            } else if (typesList.size() == 2) {
                types = typesList.get(0) + "/" + typesList.get(1);
            }
        }
        pokemon.setTypes(types);  // Asignar el string de tipos



        // Acceder a las estadísticas desde el DTO StatsDTO
        StatsDTO stats = newPokemon.getStats();
        if (stats != null) {
            pokemon.setHp(stats.getHp());
            pokemon.setAttack(stats.getAttack());
            pokemon.setDefense(stats.getDefense());
            pokemon.setSpecialAttack(stats.getSpecialAttack());
            pokemon.setSpecialDefense(stats.getSpecialDefense());
            pokemon.setSpeed(stats.getSpeed());
        }


    }

    private void assignPokemonToTeamSlot(Team team, Pokemon savedPokemon) {
        if (team.getIdPokemon1() == null) {
            team.setIdPokemon1(savedPokemon.getId());
            savedPokemon.setTeam(team); // Asociamos el Pokémon con el equipo
        } else if (team.getIdPokemon2() == null) {
            team.setIdPokemon2(savedPokemon.getId());
            savedPokemon.setTeam(team); // Asociamos el Pokémon con el equipo
        } else if (team.getIdPokemon3() == null) {
            team.setIdPokemon3(savedPokemon.getId());
            savedPokemon.setTeam(team); // Asociamos el Pokémon con el equipo
        } else if (team.getIdPokemon4() == null) {
            team.setIdPokemon4(savedPokemon.getId());
            savedPokemon.setTeam(team); // Asociamos el Pokémon con el equipo
        } else if (team.getIdPokemon5() == null) {
            team.setIdPokemon5(savedPokemon.getId());
            savedPokemon.setTeam(team); // Asociamos el Pokémon con el equipo
        } else if (team.getIdPokemon6() == null) {
            team.setIdPokemon6(savedPokemon.getId());
            savedPokemon.setTeam(team); // Asociamos el Pokémon con el equipo
        }

        // Guardamos el Pokémon con la relación al equipo
        pokemonRepository.save(savedPokemon);
    }

    // Eliminar equipo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        if (!teamRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Equipo no encontrado
        }
        teamRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Eliminación exitosa
    }
}
