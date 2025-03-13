import { Component } from '@angular/core';
import { DamageCalculatorService } from '../services/damage-calculator.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-damage-calculator',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './damage-calculator.component.html',
  styleUrl: './damage-calculator.component.scss'
})
export class DamageCalculatorComponent {

  
}
