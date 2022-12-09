import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
      .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
      }

      .inputGroup {
        align-self: start;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
    `,
  ],
})
export class AgregarComponent implements OnInit {
  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  };

  constructor(
    private heroeService: HeroesService,
    private acivatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('editar')) {
      return;
    }

    this.acivatedRoute.params
      .pipe(switchMap(({ id }) => this.heroeService.getHeroePorId(id)))
      .subscribe((heroe) => (this.heroe = heroe));
  }

  guardar() {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }

    if (this.heroe.id) {
      this.heroeService.actualizarHeroe(this.heroe).subscribe({
        next: (heroe) => this.mostrarSnakbar('Registro actualizado'),
      });
    } else {
      this.heroeService.agregarHeroe(this.heroe).subscribe({
        next: (heroe) => {
          this.router.navigate(['/heroes/editar', heroe.id]);
          this.mostrarSnakbar('Registro creado');
        },
      });
    }
  }

  borrarHeroe() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe,
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.heroeService.borrarHeroe(this.heroe.id!).subscribe({
          next: () => {
            this.router.navigate(['/heroes']);
          },
        });
      }
    });
  }

  mostrarSnakbar(mensaje: string): void {
    this._snackBar.open(mensaje, 'OK!', {
      duration: 2500,
    });
  }
}
