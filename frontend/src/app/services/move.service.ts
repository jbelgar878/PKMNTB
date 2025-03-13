import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoveService {

  private movesUrl = 'https://play.pokemonshowdown.com/data/moves.json';  // URL de los movimientos

  constructor() { }

  // Función para obtener los detalles de todos los movimientos
  async getMoves(): Promise<any> {
    try {
      const response = await fetch(this.movesUrl);  // Hacemos la solicitud HTTP
      const movesData = await response.json();  // Obtenemos el JSON de la respuesta
      return movesData;  // Devolvemos los detalles de los movimientos
    } catch (error) {
      console.error("Error al obtener los movimientos:", error);
      return {};  // Retornamos un objeto vacío en caso de error
    }
  }

  // Obtener el tipo de un movimiento específico
  async getMoveType(moveName: string): Promise<string | null> {
    try {
      const moves = await this.getMoves();
      const formattedMoveName = moveName.replace(/-/g, '').toLowerCase();
      const moveData = moves[formattedMoveName];
  
      console.log(`🔍 Buscando movimiento: ${formattedMoveName}, Encontrado: ${moveData ? moveData.type : 'No encontrado'}`);
   
      if (moveData && moveData.type) {
        return moveData.type;
      } else {
/*         console.warn(`⚠️ Movimiento no encontrado: ${moveName}`);
 */        return null;
      }
    } catch (error) {
/*       console.error("❌ Error al obtener el tipo del movimiento:", error);
 */      return null;
    }
  }
  
}
