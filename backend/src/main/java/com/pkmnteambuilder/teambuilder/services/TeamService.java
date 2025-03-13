package com.pkmnteambuilder.teambuilder.services;

import com.pkmnteambuilder.teambuilder.models.Team;
import com.pkmnteambuilder.teambuilder.repositories.TeamRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Transactional
    public List<Team> getTeamsByUser(Long userId) {
        return teamRepository.findByUserId(userId);
    }

    @Transactional
    public Team createTeam(Team team) {
        return teamRepository.save(team);
    }

    @Transactional
    public Team updateTeam(Long id, Team updatedTeam) {
        return teamRepository.findById(id).map(team -> {
            team.setName(updatedTeam.getName());
            team.setIdPokemon1(updatedTeam.getIdPokemon1());
            team.setIdPokemon2(updatedTeam.getIdPokemon2());
            team.setIdPokemon3(updatedTeam.getIdPokemon3());
            team.setIdPokemon4(updatedTeam.getIdPokemon4());
            team.setIdPokemon5(updatedTeam.getIdPokemon5());
            team.setIdPokemon6(updatedTeam.getIdPokemon6());
            return teamRepository.save(team);
        }).orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    @Transactional
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}
