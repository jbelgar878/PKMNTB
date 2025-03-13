import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Pokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './pokemon-info.component.html',
  styleUrls: ['./pokemon-info.component.scss']
})
export class PokemonInfoComponent implements OnChanges {
  @Input() pokemon!: Pokemon; // Pokémon seleccionado
  pokemonForm!: FormGroup; // Formulario reactivo

  constructor(private fb: FormBuilder) { }

  // Detecta cambios en los datos de pokemon
  ngOnChanges(changes: SimpleChanges) {
    if (changes['pokemon'] && this.pokemon) {
      this.initForm(); // Inicializar el formulario al cambiar el Pokémon
    }
  }

  // Función de validación personalizada para limitar el total de EVs a 64
/*   static evsTotalValidator(control: AbstractControl): ValidationErrors | null {
    const evs = control.value;
    const totalEVs =
      evs.hp +
      evs.attack +
      evs.defense +
      evs.specialAttack +
      evs.specialDefense +
      evs.speed;

    return totalEVs > 64 ? { totalEVsExceeded: true } : null;
  } */

  // Inicializar el formulario con los datos del Pokémon
  initForm() {
    // Verificar si el Pokémon tiene movimientos
    const moves = this.pokemon.moves && this.pokemon.moves.length > 0
      ? this.pokemon.moves.slice(0, 4).map(move => this.fb.group({
        moveName: [move.move.name, Validators.required]
      }))
      : []; // Si no tiene movimientos, inicializamos como vacío

    this.pokemonForm = this.fb.group({
      name: [this.pokemon.name, Validators.required], // Nombre (no editable)
      ability: [this.pokemon.abilities[0]?.ability.name || '', Validators.required], // Habilidad
      moves: this.fb.array(moves), // Movimientos (inicialmente vacío si no hay movimientos)
      evs: this.fb.group({
        hp: [0, [Validators.min(0), Validators.max(64)]],
        attack: [0, [Validators.min(0), Validators.max(64)]],
        defense: [0, [Validators.min(0), Validators.max(64)]],
        specialAttack: [0, [Validators.min(0), Validators.max(64)]],
        specialDefense: [0, [Validators.min(0), Validators.max(64)]],
        speed: [0, [Validators.min(0), Validators.max(64)]]
      }),
      ivs: this.fb.group({
        hp: [31, [Validators.min(0), Validators.max(31)]],
        attack: [31, [Validators.min(0), Validators.max(31)]],
        defense: [31, [Validators.min(0), Validators.max(31)]],
        specialAttack: [31, [Validators.min(0), Validators.max(31)]],
        specialDefense: [31, [Validators.min(0), Validators.max(31)]],
        speed: [31, [Validators.min(0), Validators.max(31)]]
      })
    });
  }

  // Getter para acceder a los movimientos (FormArray)
  get moves(): FormArray {
    return this.pokemonForm.get('moves') as FormArray;
  }


  // Verificar si se excede el límite de EVs
  hasTotalEvsError(): boolean {
    return this.pokemonForm.get('evs')?.hasError('totalEVsExceeded') ?? false;
  }

  // Calcular el valor total de una estadística
  getTotalStat(stat: string): number {
    const baseStat = this.pokemon.stats.find(s => s.stat.name === stat)?.base_stat || 0;
    const evs = this.pokemonForm.get('evs')?.get(stat)?.value || 0;
    const ivs = this.pokemonForm.get('ivs')?.get(stat)?.value || 0;
    return baseStat + evs + ivs;
  }

  // Guardar los cambios del Pokémon
  saveChanges() {
    if (this.pokemonForm.valid) {
      const updatedPokemon = { ...this.pokemon, ...this.pokemonForm.value };
      console.log('Pokémon actualizado:', updatedPokemon);
      // Aquí puedes llamar a un servicio para actualizar el Pokémon en el equipo
    }
  }


}
