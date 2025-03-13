import { Routes } from '@angular/router';
import { PokedexComponent } from './pokedex/pokedex.component';
import { TeamBuilderComponent } from './team-builder/team-builder.component';
import { DamageCalculatorComponent } from './damage-calculator/damage-calculator.component';
import { MiniGamesComponent } from './mini-games/mini-games.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'pokedex', component: PokedexComponent },
    { path: 'teambuilder', component: TeamBuilderComponent },  
    { path: 'damage-calculator', component: DamageCalculatorComponent },
    { path: 'minigames', component: MiniGamesComponent },
    { path: '**', redirectTo: '' },

];