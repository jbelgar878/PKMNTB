import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PokemonTB, transformToPokemonTB, transformToPokemonTBfrombackend } from '../interfaces/pokemon-tb';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { PokemonService } from './pokemon.service';

export interface Team {
  id: number;
  name: string;
  pokemons: PokemonTB[];
}

export interface TeamFromBackend {
  id: number;
  name: string;
  user_id: number;
  idPokemon1: number | null;
  idPokemon2: number | null;
  idPokemon3: number | null;
  idPokemon4: number | null;
  idPokemon5: number | null;
  idPokemon6: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private teams: Team[] = []; // Almacena todos los equipos
  private teamsSubject = new BehaviorSubject<Team[]>([]); // Control de cambios en los equipos
  teams$ = this.teamsSubject.asObservable();  // Observable para mostrar equipos
  private selectedTeam = new BehaviorSubject<Team | null>(null); // Equipo seleccionado
  selectedTeam$ = this.selectedTeam.asObservable();  // Observable para mostrar el equipo seleccionado

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private pokemonService: PokemonService  // Inyección de pokemonService
  ) {
    this.loadTeams(); // Cargamos los equipos al inicio
  }

  private async loadTeams() {
    const session = this.authService.getSession();
  
    if (session.userId) {
      // Usuario logueado → Cargar equipos desde la API
      this.getTeamsFromBackend(session.userId);
    } else {
      // Usuario no logueado → Cargar equipos desde localStorage
      this.loadTeamsFromLocalStorage();
    }
  
    // Si hay equipos, seleccionar el primer equipo automáticamente
    if (this.teams.length > 0) {
      this.selectedTeam.next(this.teams[0]);
    } else {
      // Si no hay equipos, vaciar la selección
      this.selectedTeam.next(null);
    }
  }
  

  getTeamsFromBackend(userId: number) {
    this.http.get<TeamFromBackend[]>(`http://localhost:8080/api/teams/user/${userId}`)
      .subscribe({
        next: async (teams) => {
          // Si la respuesta está vacía, asignamos un array vacío a teams
          if (!teams || teams.length === 0) {
            this.teams = [];  // Establecer equipos como un array vacío
          } else {
            const teamsWithPokemons = [];  // Este array contendrá los equipos con los pokémons cargados
  
            for (let team of teams) {
              // Aquí obtenemos los Pokémon por sus IDs
              const pokemons = await this.fetchPokemonsForTeam(team);
  
              // Creamos un nuevo objeto Team con la propiedad 'pokemons' correctamente asignada
              const teamWithPokemons: Team = {
                id: team.id,
                name: team.name,
                pokemons: pokemons,  // Asignamos los pokémons obtenidos
              };
  
              teamsWithPokemons.push(teamWithPokemons);
            }
  
            this.teams = teamsWithPokemons; // Asignamos los equipos con los pokémons al array
          }
          
          // Emitimos el estado actualizado de los equipos
          this.teamsSubject.next(this.teams);
        },
        error: (error) => {
          // Si hay un error en la llamada, asignamos un array vacío
          console.error('Error al obtener los equipos:', error);
          this.teams = []; // Si ocurre un error, aseguramos que los equipos sean vacíos
          this.teamsSubject.next(this.teams);
        }
      });
  }
  

  private async fetchPokemonsForTeam(teamFromBackend: TeamFromBackend): Promise<PokemonTB[]> {
console.log('✌️teamFromBackend --->', teamFromBackend);
    console.log('✌️teamFromBackend.id_pokemon_1 --->', teamFromBackend.idPokemon1);
  
    const pokemonIds = [
      teamFromBackend.idPokemon1,
      teamFromBackend.idPokemon2,
      teamFromBackend.idPokemon3,
      teamFromBackend.idPokemon4,
      teamFromBackend.idPokemon5,
      teamFromBackend.idPokemon6
    ].filter(id => id !== null);  // Filtrar los IDs nulos
  
    console.log('✌️pokemonIds --->', pokemonIds);
  
    const pokemonArray: PokemonTB[] = [];
  
    for (const id of pokemonIds) {
      try {
        // Solicitar los datos del Pokémon desde el backend
        const pokemonData = await this.http.get<any>(`http://localhost:8080/api/pokemon/${id}`).toPromise();
        console.log('✌️pokemonData --->', pokemonData);
        if (pokemonData) {
          // Transformar los datos recibidos al formato PokemonTB
          const transformedPokemon = transformToPokemonTBfrombackend(pokemonData);  // Aquí se realiza la transformación
          pokemonArray.push(await transformedPokemon);  // Se agrega al array de Pokémon transformados
        }
      } catch (error) {
        console.error('Error al obtener el Pokémon:', error);
      }
    }

    
    console.log('✌️pokemonArray --->', pokemonArray);

  
    return pokemonArray;
  }
  
  addTeamToBackend(userId: number, team: Team) {
    return this.http.post(`http://localhost:8080/api/teams/${userId}`, team, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Equipo creado en el backend', response);
          this.getTeamsFromBackend(userId); // Recargar equipos después de agregar
        },
        error: (error) => {
          console.error('Error al crear el equipo', error);
          let errorMessage = 'Error desconocido';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          alert('Error al crear el equipo: ' + errorMessage);
        }
      });
  }

  updateTeamInBackend(team: Team) {
console.log('✌️team --->', team);
    
    return this.http.put(`http://localhost:8080/api/teams/${team.id}`, team)
      .subscribe(response => {
        console.log('Equipo actualizado en el backend', response);
        this.getTeamsFromBackend(this.authService.getSession().userId!);
      });
  }

  deleteTeamFromBackend(teamId: number) {
    return this.http.delete(`http://localhost:8080/api/teams/${teamId}`)
      .subscribe(() => {
        console.log('Equipo eliminado en el backend');
        this.getTeamsFromBackend(this.authService.getSession().userId!);
      });
  }

  

   loadTeamsFromLocalStorage() {
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      this.teams = JSON.parse(storedTeams);
    } else {
      this.teams = []; // Si no hay equipos, inicializamos el array vacío
    }
    this.teamsSubject.next(this.teams); // Emitir el estado actual de los equipos
  }

  private saveTeamsToLocalStorage() {
    localStorage.setItem('teams', JSON.stringify(this.teams));
    this.teamsSubject.next(this.teams); // Emitir el estado actualizado de los equipos
  }

  async addPokemonToTeam(
    teamId: number,  
    pokemonName: string
  ): Promise<{ success: boolean; message?: string }> {
    const team = this.teams.find(t => t.id === teamId);
    console.log("Equipo encontrado:", team);
  
    // Verifica si se encontró el equipo y si 'pokemons' existe
    if (!team) {
      return { success: false, message: 'Equipo no encontrado' };
    }
  
    if (!team.pokemons) {
      team.pokemons = [];  // Inicializa el array de Pokémon si no existe
    }
  
    if (team.pokemons.length >= 6) {
      return { success: false, message: 'El equipo ya tiene 6 Pokémon' };
    }
  
    try {
      // Verificar si el Pokémon ya está en el equipo
      const existingPokemon = team.pokemons.find(pokemon => pokemon.name === pokemonName);
      if (existingPokemon) {
        const pokemonData = await this.pokemonService.getById(pokemonName); // Obtén los datos actualizados
        const updatedPokemon = transformToPokemonTB(pokemonData, 'quirky'); // Trasformar
        this.updatePokemonInTeam(teamId, await updatedPokemon); // Actualizar el Pokémon en el equipo
        return { success: true, message: 'Pokémon actualizado en el equipo' };
      }
  
      // Si el Pokémon no está en el equipo, lo agregamos
      const pokemonData = await this.pokemonService.getById(pokemonName);
      team.pokemons.push(transformToPokemonTB(pokemonData, 'quirky'));
  
      // Verificamos si el usuario está logueado
      const session = this.authService.getSession();
      if (session.userId) {
        this.updateTeamInBackend(team); // Actualizar equipo en el backend
      } else {
        // Si no está logueado, actualizamos el equipo en localStorage
        const teamIndex = this.teams.findIndex(t => t.id === team.id);
        if (teamIndex !== -1) {
          this.teams[teamIndex] = team; // Actualizamos el equipo en la lista local
          this.saveTeamsToLocalStorage(); // Guardamos en localStorage
        }
      }
  
      this.teamsSubject.next(this.teams); // Actualizar estado de equipos
  
      return { success: true, message: 'Pokémon agregado al equipo' };
    } catch (error) {
      console.error('Error al obtener el Pokémon:', error);
      return { success: false, message: 'Error al obtener el Pokémon' };
    }
  }
  
  

  updatePokemonInTeam(teamId: number, updatedPokemon: PokemonTB): void {
    const team = this.teams.find(t => t.id === teamId);

    if (team) {
      const pokemonIndex = team.pokemons.findIndex(p => p.name === updatedPokemon.name);
      if (pokemonIndex !== -1) {
        team.pokemons[pokemonIndex] = updatedPokemon;
        this.saveTeamsToLocalStorage();
      }
    }
  }

  addTeam(name: string) {
    const newTeam: Team = { id: 0, name, pokemons: [] };

    const session = this.authService.getSession();
    if (session.userId) {
      this.addTeamToBackend(session.userId, newTeam);
    } else {
    // Buscar el último equipo y asignar un ID +1
    const lastTeamId = this.teams.length > 0 ? Math.max(...this.teams.map(team => team.id)) : 0;
    newTeam.id = lastTeamId + 1;  // Asignar el ID incrementado
    this.teams.push(newTeam);      // Agregar el nuevo equipo a la lista
    this.saveTeamsToLocalStorage(); // Guardar los equipos en localStorage
    }
  }

  selectTeam(team: Team) {
    console.log("Equipo seleccionado:", team); // 🔍 Verificar qué equipo se está enviando
    this.selectedTeam.next(team);
    this.teamsSubject.next(this.teams);
  }

  updateTeam(updatedTeam: Team) {
    const session = this.authService.getSession();
    if (session.userId) {
      this.updateTeamInBackend(updatedTeam);
    } else {
      const index = this.teams.findIndex(team => team.id === updatedTeam.id);
      if (index !== -1) {
        this.teams[index] = updatedTeam;
        this.saveTeamsToLocalStorage();
      }
    }
  }

  removeTeam(id: number) {
    const session = this.authService.getSession();
    if (session.userId) {
      this.deleteTeamFromBackend(id);
      this.deselectTeam();

    } else {
      this.teams = this.teams.filter(team => team.id !== id);
      this.saveTeamsToLocalStorage();
      this.deselectTeam();

    }

  }

  // Método para restablecer el equipo seleccionado a null
  deselectTeam() {
    this.selectedTeam.next(null); // Restablecer el valor a null
  }
}
