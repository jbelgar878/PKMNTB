export interface Data{
    count: number,
    next: string,
    previous: string,
    results: Resultado
}

export interface Resultado {
    name: string;
    url: string;
    details?: any;  // Almacenaremos los detalles del Pokémon aquí
  }
  