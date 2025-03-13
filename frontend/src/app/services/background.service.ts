import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  private backgrounds: string[] = [
    'background1.jpg',
    'background2.jpg',
    'background3.jpg',
    'background4.jpg',
    'background5.jpg'
  ];

  constructor() { }

  getRandomBackground(): string {
    const randomIndex = Math.floor(Math.random() * this.backgrounds.length);
    return `/backgrounds/${this.backgrounds[randomIndex]}`; // Asegúrate de que la ruta sea correcta
  }
  
}