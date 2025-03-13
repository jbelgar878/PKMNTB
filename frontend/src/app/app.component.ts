import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundService } from './services/background.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('✅ AppComponent inicializado correctamente'); // ⚡ Solo imprime en consola
  }
 
}