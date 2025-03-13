import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoveService } from '../../services/move.service';  // Importamos el servicio de movimientos
import { PokemonTB } from '../../interfaces/pokemon-tb';

@Component({
  selector: 'app-list-resources',
  imports: [CommonModule, FormsModule],
  templateUrl: './list-resources.component.html',
  styleUrls: ['./list-resources.component.scss']
})
export class ListResourcesComponent implements OnChanges {

  @Input() pokemonMoves: string[] = [];  // Recibe los movimientos del Pokémon
    @Input() pokemon!: PokemonTB;  // Recibe un Pokémon de tipo PokemonTB
  

  @Input() resourceType: string = '';  // Tipo de recurso (item, habilidad, movimiento)
  @Input() pokemonName: string = '';    // ID del Pokémon para obtener habilidades y movimientos
  @Output() resourceSelected: EventEmitter<any> = new EventEmitter();
  resources: any[] = [];  // Lista de recursos (puede ser objetos, habilidades, movimientos)
  filteredResources: any[] = [];  // Lista filtrada de recursos
  searchQuery: string = '';  // Cadena de búsqueda
  moveData: any = {};  // Almacenaremos los movimientos cargados desde la API

  constructor(
    private pokemonService: PokemonService,
    private moveService: MoveService  // Inyectamos el servicio de movimientos
  ) { }

  ngOnChanges() {
    console.log('🐱‍👤 Pokémon recibido en ListResources:', this.pokemon);
    this.loadResources();
  }
  

  // Cargar los recursos dependiendo del tipo de recurso
  async loadResources() {
    try {
      // Validamos si el tipo de recurso no está definido, pero sin lanzar error
      if (!this.resourceType) {
        return;  // Salimos sin hacer nada
      }

      if (this.resourceType === 'item') {
        this.resources = this.pokemonService.getAllItems();
      } else if (this.resourceType === 'ability' && this.pokemonName) {
        const abilities = await this.pokemonService.getPokemonAbilities(this.pokemonName);
        this.resources = await Promise.all(abilities.map(async (ability: any) => {
          const description = await this.pokemonService.getAbilityDescription(ability.name);
          return { ...ability, description };
        }));
      } else if (this.resourceType === 'moves' && this.pokemonName) {
        const movesDetails = await this.moveService.getMoves();
        const moves = await this.pokemonService.getPokemonMoves(this.pokemonName);
        this.resources = moves.map((move: any) => {
          const formattedMoveName = move.move.name.replace(/-/g, '');
          const moveDetails = movesDetails[formattedMoveName];

          return {
            name: move.move.name, // Mantener el nombre original
            formattedName: formattedMoveName, // Nombre sin guiones para la búsqueda
            type: moveDetails?.type,
            category: moveDetails?.category || 'Desconocida',
            basePower: moveDetails?.basePower || 'N/A',
            pp: moveDetails?.pp || 'N/A',
            description: moveDetails?.desc || 'Sin descripción',
            displayName: this.capitalizeWords(move.move.name.replace(/-/g, ' '))
          };
        });
      }

      this.filterResources();
    } catch (error) {
      console.error('❌ Error al cargar los recursos:', error);
    }
  }

  // Función para capitalizar la primera letra de cada palabra
  capitalizeWords(text: string): string {
    return text
      .split(' ')  // Dividir por espacios
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalizar cada palabra
      .join(' ');  // Unir de nuevo las palabras con espacio
  }

  // Función para filtrar los recursos basados en la búsqueda
  filterResources() {
    if (this.resourceType === 'item') {
      this.filteredResources = this.resources.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else if (this.resourceType === 'moves') {
      // Filtrar los movimientos por nombre o una porción de la descripción
      this.filteredResources = this.resources.filter(move =>
        move.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (move.description && move.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    } else {
      this.filteredResources = this.resources;  // No se filtra por ahora en habilidades
    }
  }

  // Emitir el recurso seleccionado
  selectResource(resource: any) {
    this.resourceSelected.emit(resource.name);  // Emitir el recurso seleccionado
    this.searchQuery = '';
  }

  getItemSprite(item: any): string | null {
    return item.name
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name.toLowerCase().replace(' ', '-')}.png`
      : null;
  }

  getItemEffect(item: any): string {
    return item.shortDesc || item.desc || 'Sin descripción';
  }

  getMoveClass(moveType: string | undefined): string {
    return moveType ? `tipo-${moveType.toLowerCase()}` : 'tipo-normal';
  }

  // Verificar si el movimiento ya está en la lista del Pokémon
  hasMove(moveName: string): boolean {
    return this.pokemonMoves.includes(moveName);
  }
  // Verificar si el movimiento ya está en la lista del Pokémon
 // Verificar si el Pokémon ya tiene el ítem asignado
 hasitem(item: any): boolean {
  return this.pokemon?.item === item.name;
}


}

