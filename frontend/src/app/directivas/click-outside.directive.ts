import { Directive, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Verificar si event.target no es null y es un HTMLElement
    const target = event.target as HTMLElement | null;
    if (target && !this.el.nativeElement.contains(target) && !this.isInsideExcludedElement(target)) {
      this.clickOutside.emit(); // Emitir el evento si el clic fue fuera del elemento
    }
  }

  // Función que verifica si el clic ocurrió dentro de un área específica que quieres excluir
  private isInsideExcludedElement(target: HTMLElement): boolean {
    // Aquí puedes agregar la lógica para identificar elementos específicos
    // que deben ser excluidos de la directiva clickOutside
    const excludedElements = [
      '.pokemon',                // Para los elementos de Pokémon
      '.add-pokemon',            // Para el botón de añadir Pokémon
      '.modal',                  // Para el contenedor del modal
      '.modal-content',          // Para el contenido del modal
      '.pokemon-box',            // Para el componente del Pokémon que se edita
      '.list-resources',         // Excluir el contenedor de ListResources
      '#cuadroresources',        // Excluir el contenedor específico del recurso
      '.single-team',            // Para todo el contenedor de single-team
      '.team-container',         // Para los contenedores de los equipos
      '.modal-buttons'           // Para los botones del modal
    ];
    return excludedElements.some(selector => target.closest(selector) !== null);
  }
  
}
