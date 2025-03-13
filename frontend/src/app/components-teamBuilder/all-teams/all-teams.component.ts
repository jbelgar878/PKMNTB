import { Component, Input } from '@angular/core';
import { Team, TeamService } from '../../services/team.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-teams',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.scss']
})
export class AllTeamsComponent {

    @Input() loggedUserName: string = '';

  teams: Team[] = [];
  newTeamName: string = '';

  constructor(private teamService: TeamService) {
    // Suscribirse a la lista de equipos
    this.teamService.teams$.subscribe(teams => {
      this.teams = teams;
    });
  }

  // Crear un nuevo equipo
  addTeam() {
    if (!this.newTeamName.trim()) return; // Evitar nombres vacíos
    this.teamService.addTeam(this.newTeamName);
    this.newTeamName = ''; // Limpiar el input
  }

  // Borrar un equipo
  removeTeam(teamId: number) {
    this.teamService.removeTeam(teamId);
  }

  // Seleccionar un equipo
  selectTeam(team: Team) {
    // Seleccionar el equipo en el servicio y esto automáticamente se reflejará en SingleTeamComponent
    this.teamService.selectTeam(team);
  }
}
