import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TarjetaPokemonComponent } from '../tarjeta-pokemon/tarjeta-pokemon.component';
import { Pokemon } from '../../interfaces/pokemon';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-detalle-pokemon',
  imports: [TarjetaPokemonComponent, CommonModule],
  templateUrl: './detalle-pokemon.component.html',
  styleUrl: './detalle-pokemon.component.scss'
})
export class DetallePokemonComponent implements OnChanges{
  
  @Input() pokemon? : Pokemon;
  @Input() abierto: boolean = false;  // esto es para estilos unicamente
  @Output() clicked = new EventEmitter<void>();
  descripcion:string = "";

  
  constructor(private pokemonService: PokemonService){}
  
  ngOnChanges(): void {

    if (this.pokemon) {
      this.pokemonService.getDescription(this.pokemon?.id.toString() || "").then(res => {
      this.descripcion = res
    });
    }
    
  }

  cambiarEstadoDetalle() {
    this.clicked.emit();  // Emitir el evento cuando se llame al método
  }
  get alturaCm(): number {
    return (this.pokemon?.height || 0) * 10; // Convertir decímetros a cm
  }
  
  get pesoKg(): number {
    return (this.pokemon?.weight || 0) / 2.205; // Convertir hectogramos a kg
  }
  
}
