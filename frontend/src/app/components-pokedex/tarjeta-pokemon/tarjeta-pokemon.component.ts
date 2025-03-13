import { Component, Input, OnChanges, Output, output, SimpleChanges, EventEmitter } from '@angular/core';
import { Resultado } from '../../interfaces/pokeapi';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-tarjeta-pokemon',
  imports: [CommonModule],
  templateUrl: './tarjeta-pokemon.component.html',
  styleUrl: './tarjeta-pokemon.component.scss'
})

export class TarjetaPokemonComponent implements OnChanges {

  @Input() data!: Resultado;
  @Input() seleccionado: boolean = false;
  @Input() fullData?: Pokemon;
  @Output() clickado = new EventEmitter<string>();
  id: string = "0";
  fulldata: any[] = [];

  constructor(private pokemonService: PokemonService) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.extraerInformacion();
  }


  extraerInformacion() {
    if (this.data && this.data.url !== "") {
      this.id = this.data.url.substring(34, this.data.url.length - 1);
      this.pokemonService.getById(this.id);
      return
    };

    if (this.fullData) {
      this.id = this.fullData.species.url.substring(42, this.fullData.species.url.length - 1);
      this.data = {
        name: this.fullData.species.name,
        url: ""
      }
    }
  }


}
