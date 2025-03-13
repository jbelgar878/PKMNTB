package com.pkmnteambuilder.teambuilder.repositories;

import com.pkmnteambuilder.teambuilder.models.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByUserId(Long userId);  // Buscar equipos por ID de usuario

    boolean existsByNameAndUserId(String name, Long userId);  // Comprobar existencia de un equipo con el mismo nombre y usuario
}
