import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';  // Importar ChangeDetectorRef
import { Team, TeamService } from '../../services/team.service';
import { CommonModule } from '@angular/common';
import { Resultado } from '../../interfaces/pokeapi';
import { PokemonService } from '../../services/pokemon.service';
import { FormsModule } from '@angular/forms';
import { PokemonTB } from '../../interfaces/pokemon-tb';
import { PokemonBoxComponent } from '../pokemon-box/pokemon-box.component';
import { ListResourcesComponent } from '../list-resources/list-resources.component';
import { ClickOutsideDirective } from '../../directivas/click-outside.directive';  // Importamos la directiva

@Component({
  selector: 'app-single-team',
  standalone: true,
  imports: [CommonModule, FormsModule, PokemonBoxComponent, ListResourcesComponent, ], // Añadimos la directiva aquí ClickOutsideDirective
  templateUrl: './single-team.component.html',
  styleUrls: ['./single-team.component.scss']
})
export class SingleTeamComponent implements OnDestroy {
  team: Team | null = null;
  pokemonList: Resultado[] = [];
  filteredPokemonList: Resultado[] = [];
  selectedPokemon: string = '';  // Esta es la variable que se limpia al abrir el modal
  selectedPokemonToEdit: PokemonTB | null = null;
  showAddPokemonModal: boolean = false;
  searchQuery: string = '';
  isPokemonBoxVisible: boolean = false;
  private subscription: any;
  isTableSelected = false;

  constructor(
    private teamService: TeamService,
    private pokemonService: PokemonService,
    private cdRef: ChangeDetectorRef  // Inyectamos ChangeDetectorRef
  ) {
    this.subscription = this.teamService.selectedTeam$.subscribe(selected => {
      this.team = selected;
    });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openAddPokemonModal() {
    this.selectedPokemon = '';  // Limpiar la selección de Pokémon antes de abrir el modal
    this.showAddPokemonModal = true;
    this.loadPokemonList();
  }

  async loadPokemonList() {
    let page = 1;

    try {
      while (true) {
        const pokemonData = await this.pokemonService.getByPage(page);
        if (pokemonData.length === 0) break;

        // Cargamos los detalles de cada Pokémon utilizando la URL
        for (let pokemon of pokemonData) {
          const details = await this.pokemonService.getPokemonDetails(pokemon.url);          
          pokemon.details = details;  // Guardamos los detalles en el objeto Pokémon
        }

        this.pokemonList = [...this.pokemonList, ...pokemonData];
        page++;
      }

      this.filteredPokemonList = [...this.pokemonList];
    } catch (error) {
      console.error('Error al cargar los Pokémon:', error);
    }
  }

  filterPokemonList() {
    if (this.searchQuery) {
      this.filteredPokemonList = this.pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredPokemonList = [...this.pokemonList];
    }
  }

   // Verificar si el Pokémon ya está en el equipo
   isPokemonInTeam(pokemonName: string): boolean {
    if (!this.team || !Array.isArray(this.team.pokemons)) return false;
    return this.team.pokemons.some(pokemon => pokemon.name === pokemonName);
  }
  

  async addPokemonToTeam(pokemon: string | null = null) {
    const pokemonToAdd = pokemon || this.selectedPokemon;
  
    if (!this.team || !pokemonToAdd) {
      console.error('No se ha seleccionado un equipo o un Pokémon');
      return;
    }
  
    const result = await this.teamService.addPokemonToTeam(this.team.id, pokemonToAdd);
    if (result.success) {
      this.selectedPokemon = '';  // Limpiar la selección después de añadir el Pokémon
      this.showAddPokemonModal = false;
  
      // Usar setTimeout para forzar la actualización
      setTimeout(() => {
        this.loadPokemonList();
      }, 0);
      
    } else {
      console.error(result.message);
    }
  }
  
  
  

  onPokemonUpdated(updatedPokemon: PokemonTB) {
    if (this.team) {
      const index = this.team.pokemons.findIndex(pokemon => pokemon.name === updatedPokemon.name);
      if (index !== -1) {
        this.team.pokemons[index] = updatedPokemon;
        this.teamService.updateTeam(this.team);
        this.cdRef.detectChanges();  // Forzamos la recarga de la vista
      }
    }
  }

  selectPokemonToEdit(pokemon: PokemonTB) {
    this.selectedPokemonToEdit = pokemon;
    this.isPokemonBoxVisible = true;
    if (this.team) {
      this.teamService.updateTeam(this.team);
    }
  }

  removePokemon(event: Event, pokemonIndex: number) {
    event.stopPropagation();
    if (!this.team) return;
  
    // Usamos el operador spread para crear una nueva referencia al array
    this.team.pokemons = [
      ...this.team.pokemons.slice(0, pokemonIndex),
      ...this.team.pokemons.slice(pokemonIndex + 1)
    ];
  
    this.teamService.updateTeam(this.team);
  
    // Forzar la detección de cambios para actualizar la vista
    this.cdRef.detectChanges();
  }
  
  selectTeam(team: Team) {
    if (this.team && this.team.id === team.id) {
      return;
    }

    this.team = team;
    this.selectedPokemonToEdit = null;
    this.isPokemonBoxVisible = false;
  }

  deselectTeam() {
    this.team = null;
    this.selectedPokemonToEdit = null;
    this.isPokemonBoxVisible = false;
  }

  selectTable() {
    this.isTableSelected = !this.isTableSelected; // Alterna el estado
  }

  onTableClick() {
    this.selectTable(); // Cambia el estado de selección
  }

  exportTeamToShowdown() {
    if (!this.team || !this.team.pokemons || this.team.pokemons.length === 0) {
      console.error('No hay equipo seleccionado o el equipo está vacío');
      return;
    }
  
    const showdownTeam = this.team.pokemons.map(pokemon => {
      // Extraemos los detalles necesarios de cada Pokémon
      const name = pokemon.name;
      const item = pokemon.item || ''; // Si no tiene item, poner Ninguno
      const ability = pokemon.ability || ''; // Si no tiene habilidad, poner Ninguna
      const level = pokemon.level || 50; // Si no tiene nivel, asumir nivel 50
      const moves = pokemon.moves || []; // Asegurarse de que tiene movimientos
  
      // Generamos el formato Showdown para el Pokémon
      return `${name} @ ${item}
  Ability: ${ability}
  Level: ${level}
  - ${moves.join('\n- ')}`;
    });
  
    const showdownFormat = `
  ${showdownTeam.join('\n\n')}`;
  
    // Copiar al portapapeles
    navigator.clipboard.writeText(showdownFormat).then(() => {
      alert('Equipo exportado a Showdown!');
    }, (err) => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  }
  

}
