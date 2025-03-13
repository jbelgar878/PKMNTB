import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FotoPokemonComponent } from '../components-pokedex/foto-pokemon/foto-pokemon.component';
import { DetallePokemonComponent } from '../components-pokedex/detalle-pokemon/detalle-pokemon.component';
import { TarjetaPokemonComponent } from '../components-pokedex/tarjeta-pokemon/tarjeta-pokemon.component';
import { PokemonService } from '../services/pokemon.service';
import { Resultado } from '../interfaces/pokeapi';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../interfaces/pokemon';

@Component({
  selector: 'app-pokedex',
  imports: [FotoPokemonComponent, DetallePokemonComponent, TarjetaPokemonComponent, CommonModule],
  templateUrl: './pokedex.component.html',
  styleUrl: './pokedex.component.scss'
})
export class PokedexComponent implements OnInit {

  listaPokemon: Resultado[] = [];  //lista de todos los pokemon cogidos de la api

  pagina: number = 1;
  pokemonSeleccionado?: Pokemon;
  detalle: boolean = false;

  constructor(private pokemonService: PokemonService) { }
  @ViewChild('tarjetas') tarjetasElement!: ElementRef;  //esto hace que el div que contenga terjetas este referenciado aqui a tarjetaselement


  //carga todos los pkmn en lista pokemon
  async cargarLista() {
    try {
      const data = await this.pokemonService.getByPage(this.pagina);
      if (data?.length) {
        this.listaPokemon = [...this.listaPokemon, ...data];
        this.pagina++;
      } else {
        console.warn('⚠️ No hay más Pokémon para cargar.');
      }
    } catch (error) {
      console.error('❌ Error al cargar la lista:', error);
    }
  }



  ngOnInit(): void {
    this.cargarLista();
  }

  isLoading = false; // Evita llamadas repetidas

  onScroll(event: any) {
    const target = event.target as HTMLElement; // Asegurar el tipo correcto
    const container = this.tarjetasElement.nativeElement;

    if (!this.isLoading && target.scrollTop + container.clientHeight >= target.scrollHeight - 10) {
      this.isLoading = true; // Bloquear más llamadas
      this.cargarLista().finally(() => this.isLoading = false); // Cargar datos y desbloquear
    }
  }

  async tarjetaClickada(e: string) {

    this.pokemonSeleccionado = await this.pokemonService.getById(e);

    if (this.pokemonSeleccionado && e == this.pokemonSeleccionado.id.toString()) {
      return this.cambiarEstadoDetalle()
    }

  }

  //esto es para que se muestre o no el componente detalle
  cambiarEstadoDetalle() {
    // Cambiar el estado de detalle cuando se recibe el evento
    this.detalle = !this.detalle;
  }

}
