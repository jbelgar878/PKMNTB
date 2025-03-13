import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PokemonTB } from '../../interfaces/pokemon-tb';
import { CommonModule } from '@angular/common';
import { ListResourcesComponent } from '../list-resources/list-resources.component';
import { MoveService } from '../../services/move.service';

@Component({
  selector: 'app-pokemon-box',
  standalone: true,
  imports: [CommonModule, ListResourcesComponent],
  templateUrl: './pokemon-box.component.html',
  styleUrls: ['./pokemon-box.component.scss']
})
export class PokemonBoxComponent implements OnInit, OnChanges {
  @Input() pokemon!: PokemonTB;  // Recibe un Pokémon de tipo PokemonTB
  @Output() pokemonUpdated: EventEmitter<PokemonTB> = new EventEmitter(); // Emite el Pokémon actualizado

  // Campo seleccionado para editar (item, ability o moves)
  selectedField: 'item' | 'ability' | 'moves' | null = null;
  selectedMoveIndex: number | null = null; // Índice del movimiento seleccionado

  // Formulario reactivo
  pokemonForm: FormGroup;

  // Mapa para almacenar los colores de cada tipo de movimiento
  moveTypes: string[] = [];
  moveTypesCache: { [key: string]: string } = {};  // Mapa de caché para tipos de movimientos

  constructor(private fb: FormBuilder, private moveService: MoveService, private cdr: ChangeDetectorRef) {
    this.pokemonForm = this.fb.group({
      item: [''],
      ability: [''],
      moves: this.fb.array([]),
    });
  }

  ngOnInit() {
    // Inicializa el formulario cuando el componente se monta
    this.initializeForm();
    this.updateMoveTypes();  // Actualiza los tipos de los movimientos
  }

  // Se llama cuando el @Input() pokemon cambia
ngOnChanges(changes: SimpleChanges): void {
  if (changes['pokemon'] && this.pokemon) {
    // Cada vez que el Pokémon cambia, actualizamos el formulario
    this.pokemonForm.patchValue({
      item: this.pokemon.item || '',
      ability: this.pokemon.ability || '',
      moves: this.pokemon.moves.map(move => this.fb.control(move)) // Actualiza los movimientos en el formulario
    });

    // Solo actualizamos los tipos si los movimientos han cambiado
    if (changes['pokemon'].currentValue.moves !== changes['pokemon'].previousValue?.moves) {
      this.updateMoveTypes();
    }

    // Forzamos la detección de cambios para que el componente se actualice
    this.cdr.detectChanges();
  }
}


  // Método para inicializar el formulario con los datos del Pokémon
  private initializeForm() {
    if (this.pokemon) {
      this.pokemonForm = this.fb.group({
        item: [this.pokemon.item || ''],
        ability: [this.pokemon.ability || ''],
        moves: this.fb.array(this.pokemon.moves.map(move => this.fb.control(move))) // Inicializa los movimientos
      });
    }
  }

  // Método para obtener los tipos de los movimientos, con almacenamiento en caché
  private async updateMoveTypes() {
    const moveTypes: string[] = [];
    for (const move of this.pokemon?.moves || []) {
      // Verifica si el tipo de movimiento ya está en el caché
      if (this.moveTypesCache[move]) {
        moveTypes.push(this.moveTypesCache[move]);
      } else {
        // Si no está en caché, lo obtenemos de la API
        const type = await this.moveService.getMoveType(move);
        const moveType = type || 'normal';  // Valor predeterminado si no se encuentra el tipo
        moveTypes.push(moveType);
        this.moveTypesCache[move] = moveType;  // Guardamos el tipo en caché
      }
    }
    this.moveTypes = moveTypes;
  }

  // Método para manejar el cambio de movimiento
  async updateMove(move: string, index: number) {
    const moveType = await this.moveService.getMoveType(move);  // Obtén el tipo del movimiento
    this.moveTypes[index] = moveType || 'normal';  // Actualiza el tipo de ese movimiento en el arreglo

    // También actualizamos el movimiento en el formulario
    const movesControl = this.pokemonForm.get('moves') as FormArray;
    movesControl.at(index).setValue(move);

    // Actualizamos el Pokémon
    this.pokemon.moves[index] = move;
    this.pokemonUpdated.emit({ ...this.pokemon });  // Emitimos el Pokémon actualizado
  }

  // Obtiene la clase correspondiente al tipo de movimiento para el estilo
  getMoveTypeClass(i: number): string { 
    const moveType = this.moveTypes[i] || 'normal';  // Usa moveTypes en lugar de hacer una nueva solicitud
    return `tipo-${moveType.toLowerCase()}`;  // Convertir el tipo a minúsculas y aplicar la clase
  }

  // Obtiene la URL de la imagen del Pokémon o usa una imagen por defecto
  getImageUrl(): string {
    return this.pokemon?.imageUrl || 'assets/default-pokemon.png';
  }

  // Devuelve el valor de una estadística específica del Pokémon
  getStat(statName: 'hp' | 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'): number {
    return this.pokemon?.stats?.[statName] || 0;
  }

  // Devuelve el total de todas las estadísticas del Pokémon
  getTotalStats(): number {
    return Object.values(this.pokemon?.stats || {}).reduce((total, stat) => total + stat, 0);
  }

  // Inicia el proceso de edición de un recurso (item, ability o moves)
  editResource(field: 'item' | 'ability' | 'moves'): void {
    this.selectedField = field;
    this.selectedMoveIndex = null; // Reseteamos el índice en caso de movimientos
  }

  // Permite editar un movimiento específico
  editMove(index: number): void {
    this.selectedField = 'moves';
    this.selectedMoveIndex = index;
  }

  // Actualiza el valor del Pokémon después de modificar un recurso
  updatePokemonValue(newValue: any): void {
    if (this.selectedField && this.pokemon) {
      if (this.selectedField === 'moves' && this.selectedMoveIndex !== null) {
        const movesControl = this.pokemonForm.get('moves') as FormArray;
        movesControl.at(this.selectedMoveIndex).setValue(newValue);
        this.pokemon.moves[this.selectedMoveIndex] = newValue;
      } else {
        (this.pokemon as any)[this.selectedField] = newValue;
        this.pokemonForm.patchValue({ [this.selectedField]: newValue });
      }
  
      this.selectedField = null;
      this.selectedMoveIndex = null; // Reseteamos el índice
  
      // Emitimos el Pokémon actualizado
      this.pokemonUpdated.emit({ ...this.pokemon }); // Clonamos el objeto para forzar detección de cambio
  
      // Forzamos la detección de cambios
      this.cdr.detectChanges();
    }
  }

  // Lista de estadísticas del Pokémon
  statList: { key: "hp" | "attack" | "defense" | "specialAttack" | "specialDefense" | "speed"; label: string }[] = [
    { key: "hp", label: "HP" },
    { key: "attack", label: "Attack" },
    { key: "defense", label: "Defense" },
    { key: "specialAttack", label: "Especial At." },
    { key: "specialDefense", label: "Especial Def." },
    { key: "speed", label: "Speed" }
  ];

  // Devuelve el color correspondiente a la estadística (rojo para baja, verde para alta)
  getStatColor(value: number): string {
    if (value < 50) return 'red';
    if (value < 80) return 'darkorange';
    if (value < 110) return 'yellow';
    return 'green';
  }

  // Se llama cuando se selecciona un recurso en ListResourcesComponent
  onResourceSelected(selectedResource: any): void {
    console.log("🔄 Actualizando Pokémon con el nuevo recurso:", selectedResource);
    this.updatePokemonValue(selectedResource);
  }
}
