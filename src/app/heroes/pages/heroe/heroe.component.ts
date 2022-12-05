import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { Heroe } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styles: [
    `
      .heroe {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }

      img {
        width: 50%;
      }

      figure {
        display: flex;
        justify-content: center;
        gap: 0;
      }
    `,
  ],
})
export class HeroeComponent implements OnInit {
  heroe!: Heroe;

  constructor(
    private activatedRoute: ActivatedRoute,
    private heroeService: HeroesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroeService.getHeroePorId(id)))
      .subscribe({
        next: (heroe) => (this.heroe = heroe),
      });
  }

  regresar() {
    this.router.navigate(['/heroes/listado']);
  }
}
