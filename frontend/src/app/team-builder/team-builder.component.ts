import { Component, OnInit } from '@angular/core';
import { AllTeamsComponent } from '../components-teamBuilder/all-teams/all-teams.component';
import { SingleTeamComponent } from '../components-teamBuilder/single-team/single-team.component';
import { CommonModule } from '@angular/common';
import { BackgroundService } from '../services/background.service';
import { TeamService } from '../services/team.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [AllTeamsComponent, SingleTeamComponent, CommonModule, FormsModule],
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss']
})
export class TeamBuilderComponent implements OnInit {
  backgroundImage: string = '';
  showLoginForm: boolean = false;
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  loggedUserName: string = ''; // Para almacenar el nombre del usuario

  constructor(private backgroundService: BackgroundService,
    private teamsInfo: TeamService,
    private authService: AuthService) { }

    ngOnInit(): void {
      this.backgroundImage = this.backgroundService.getRandomBackground();
    
      const savedUser = localStorage.getItem('userSession');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (new Date().getTime() < userData.expiration) { // Verificar si la sesión ha expirado
          this.isLoggedIn = true;
          this.loggedUserName = userData.username;
          // Al recuperar la sesión, también recuperamos el userId
          const userId = userData.userId; // Asegúrate de tener acceso al userId
        } else {
          localStorage.removeItem('userSession'); // Eliminar la sesión si ha expirado
        }
      }
    }
    

  toggleLoginForm(): void {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.showLoginForm = !this.showLoginForm;
    }
  }

  login(): void {
    if (this.username.trim() === '' || this.password.trim() === '') {
      alert('Por favor, completa ambos campos.');
      return;
    }
  
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.valid) {
        this.isLoggedIn = true;
        this.loggedUserName = this.username;
        this.showLoginForm = false;
  
        const userId = response.id;
        if (userId !== undefined) {
          const expiration = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 días de expiración
          this.authService.saveSession(this.username, userId, expiration);
  
          // 🔄 Recargar los equipos para el usuario autenticado
          this.teamsInfo.getTeamsFromBackend(userId);
          this.teamsInfo.deselectTeam();

        } else {
          alert('Error: El userId no está disponible.');
        }
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
  
  
  
  


  register(): void {
    this.authService.register(this.username, this.password).subscribe({
      next: response => {
        alert('Usuario registrado con éxito');
        this.showLoginForm = false;
        this.isLoggedIn = true;
        this.loggedUserName = this.username;

        // Obtener el ID desde la respuesta del backend
        const userId = response.id; // Asegúrate de que la respuesta incluya el ID

        // Guardar sesión
        const expiration = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 días
        this.authService.saveSession(this.username, userId, expiration);

        this.teamsInfo.getTeamsFromBackend(userId);
        this.teamsInfo.deselectTeam();
      },
      error: error => {
        if (error.status === 400) {
          alert('Ese nombre ya pertenece a otro usuario');
        } else {
          alert('Error al registrar usuario');
        }
      }
    });
}




logout(): void {
  this.isLoggedIn = false;
  this.loggedUserName = '';
  this.showLoginForm = false;
  this.username = '';
  this.password = '';
  localStorage.removeItem('userSession');

  // 🔄 Limpiar los equipos al cerrar sesión
  this.teamsInfo.loadTeamsFromLocalStorage(); 
  this.teamsInfo.deselectTeam();
}

}
