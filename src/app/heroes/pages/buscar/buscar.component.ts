import { Component } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Heroe } from '../../interfaces/heroes.interface';

import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: [
    `
      .matFormField {
        width: 100%;
      }
    `,
  ],
})
export class BuscarComponent {
  termino: string = '';
  heroes: Array<Heroe> = [];
  heroeSeleccionado: Heroe | undefined;

  constructor(private heroesService: HeroesService) {}

  buscando(): void {
    this.heroesService.getSugerencias(this.termino.trim()).subscribe({
      next: (heroes) => (this.heroes = heroes),
    });
  }

  opcionSeleccionada(event: MatAutocompleteSelectedEvent) {
    if (!event.option.value) {
      this.heroeSeleccionado = undefined;
      return;
    }

    const heroe: Heroe = event.option.value;

    this.termino = heroe.superhero;

    this.heroesService.getHeroePorId(heroe.id!).subscribe({
      next: (heroe) => (this.heroeSeleccionado = heroe),
    });
  }
}
