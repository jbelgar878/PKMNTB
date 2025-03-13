import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DamageCalculatorService {


  constructor() { }

  calcularDanio(
    nivel: number,
    poderMovimiento: number,
    ataque: number,
    defensa: number,
    tipoAtacante: string,
    tipoDefensor: string,
    esCritico: boolean = false,
    esStab: boolean = false
  ): number {
    const factorTipo = this.calcularFactorTipo(tipoAtacante, tipoDefensor);

    // Cálculo base del daño
    let dano = ((2 * nivel + 10) / 250) * poderMovimiento * ataque / defensa * factorTipo + 2;

    // Si es crítico, multiplicamos por 1.5
    if (esCritico) {
      dano *= 1.5;
    }

    // Si es STAB, multiplicamos por 1.5
    if (esStab) {
      dano *= 1.5;
    }

    // Variación aleatoria entre 0.85 y 1.00
    const variacion = (Math.random() * (1 - 0.85)) + 0.85;
    dano *= variacion;

    return Math.round(dano); // Redondeamos el resultado
  }

  // Función para calcular el factor de tipo según las interacciones entre tipos
  private calcularFactorTipo(tipoAtacante: string, tipoDefensor: string): number {
    // Aquí definimos las interacciones de los tipos (simplificado)
    const tiposEficaces: any = {
      'agua': ['fuego', 'roca', 'tierra'],
      'fuego': ['planta', 'hielo', 'bicho', 'acero'],
      'planta': ['agua', 'roca', 'tierra'],
      'eléctrico': ['agua', 'volador'],
      'hielo': ['dragón', 'planta', 'tierra', 'volador'],
      'bicho': ['psíquico', 'oscuro', 'planta'],
      'volador': ['lucha', 'bicho', 'planta'],
      'lucha': ['hielo', 'roca', 'normal', 'acero', 'oscuro'],
      'veneno': ['hada', 'planta'],
      'tierra': ['fuego', 'electrico', 'acero', 'roca', 'veneno'],
      'psíquico': ['lucha', 'veneno'],
      'roca': ['volador', 'fuego', 'hielo', 'bicho'],
      'fantasma': ['psíquico', 'fantasma'],
      'dragón': ['dragón'],
      'acero': ['hada', 'hielo', 'roca'],
      'hada': ['lucha', 'dragón', 'siniestro'],
      'normal': [],
      'siniestro': ['psíquico', 'fantasma'],
    };
    

    // Si el tipo atacante es eficaz contra el defensor
    if (tiposEficaces[tipoAtacante] && tiposEficaces[tipoAtacante].includes(tipoDefensor)) {
      return 2; // Doble daño
    }
    
    // Si el tipo defensor es eficaz contra el atacante
    if (tiposEficaces[tipoDefensor] && tiposEficaces[tipoDefensor].includes(tipoAtacante)) {
      return 0.5; // Mitad de daño
    }

    // Caso neutral
    return 1; // Daño normal
  }}
