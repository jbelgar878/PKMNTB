package com.pkmnteambuilder.teambuilder.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "teams")
@Getter @Setter
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "user_id")
    private Long userId;  // Cambiado a Long, en lugar de un objeto 'User'

    @Column(name = "id_pokemon_1")
    private Long idPokemon1;

    @Column(name = "id_pokemon_2")
    private Long idPokemon2;

    @Column(name = "id_pokemon_3")
    private Long idPokemon3;

    @Column(name = "id_pokemon_4")
    private Long idPokemon4;

    @Column(name = "id_pokemon_5")
    private Long idPokemon5;

    @Column(name = "id_pokemon_6")
    private Long idPokemon6;

    @Version
    private Long version = 0L;
}
