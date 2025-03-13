// pokemon-natures.ts

export const NATURE_EFFECTS = {
    adamant: { increase: 'attack', decrease: 'specialAttack' },
    bold: { increase: 'defense', decrease: 'attack' },
    modest: { increase: 'specialAttack', decrease: 'attack' },
    jolly: { increase: 'speed', decrease: 'specialAttack' },
    calm: { increase: 'specialDefense', decrease: 'attack' },
    impish: { increase: 'defense', decrease: 'specialAttack' },
    rash: { increase: 'specialAttack', decrease: 'specialDefense' },
    careful: { increase: 'specialDefense', decrease: 'specialAttack' },
    naive: { increase: 'speed', decrease: 'specialDefense' },
    hardy: { increase: 'attack', decrease: 'defense' },
    quirky: { increase: 'specialDefense', decrease: 'defense' },
    lonely: { increase: 'attack', decrease: 'defense' },
    docile: { increase: 'specialDefense', decrease: 'defense' },
    bashful: { increase: 'speed', decrease: 'defense' },
    relaxed: { increase: 'defense', decrease: 'speed' },
    timid: { increase: 'speed', decrease: 'attack' },
    gentle: { increase: 'specialDefense', decrease: 'attack' },
    hasty: { increase: 'speed', decrease: 'defense' },
    serene: { increase: 'specialAttack', decrease: 'defense' },
    brave: { increase: 'attack', decrease: 'speed' },
    mild: { increase: 'specialAttack', decrease: 'defense' },
    quiet: { increase: 'specialAttack', decrease: 'speed' },
    sassy: { increase: 'specialDefense', decrease: 'speed' },
} as const;

// Definimos el tipo "Nature" como las claves del objeto NATURE_EFFECTS
export type Nature = keyof typeof NATURE_EFFECTS;
