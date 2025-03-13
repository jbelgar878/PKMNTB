import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-foto-pokemon',
  imports: [CommonModule],
  templateUrl: './foto-pokemon.component.html',
  styleUrl: './foto-pokemon.component.scss'
})
export class FotoPokemonComponent {
  @Input() pokemon?: Pokemon;
}
