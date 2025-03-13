package com.pkmnteambuilder.teambuilder.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pokemon")
@Getter @Setter
public class Pokemon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;


    private String name;
    private int level;
    private String ability;
    private String nature;
    private String item;
    private String types;

    private int hp;
    private int attack;
    private int defense;
    private int specialAttack;
    private int specialDefense;
    private int speed;

    private String move1;  // Nuevo campo para el primer movimiento
    private String move2;  // Nuevo campo para el segundo movimiento
    private String move3;  // Nuevo campo para el tercer movimiento
    private String move4;  // Nuevo campo para el cuarto movimiento
}
