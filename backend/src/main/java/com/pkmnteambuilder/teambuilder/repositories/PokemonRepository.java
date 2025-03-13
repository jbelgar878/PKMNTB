package com.pkmnteambuilder.teambuilder.repositories;

import com.pkmnteambuilder.teambuilder.models.Pokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PokemonRepository extends JpaRepository<Pokemon, Long> {
    List<Pokemon> findByTeamId(Long teamId);
}

