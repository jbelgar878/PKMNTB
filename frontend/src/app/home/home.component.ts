import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackgroundService } from '../services/background.service';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

@Injectable({
  providedIn: 'root'
})

export class HomeComponent implements OnInit{
  
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  backgroundImage: string = '';

  constructor(
    private router: Router,
    private backgroundService: BackgroundService
  ) { }

  ngOnInit(): void {
    this.backgroundImage = this.backgroundService.getRandomBackground();
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
