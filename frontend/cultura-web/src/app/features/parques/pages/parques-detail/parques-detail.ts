import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { Parque, ParquesService } from '../../../../core/services/parques.service';

@Component({
  selector: 'app-parques-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './parques-detail.html',
  styleUrl: './parques-detail.scss',
})
export class ParquesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly parquesService = inject(ParquesService);
  private readonly fotografiasService = inject(FotografiasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  parque = signal<Parque | null>(null);
  fotografias = signal<Fotografia[]>([]);

  loading = signal(false);
  loadingFotografias = signal(false);

  error = signal('');
  errorFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const parqueActual = this.parque();
    const fotos = this.fotografias();

    if (!parqueActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      fotos.find((foto) => String(foto.id) === String(parqueActual.fotografiaPrincipalId)) ?? null
    );
  });

  readonly fotografiasSecundarias = computed(() => {
    const principal = this.fotografiaPrincipal();

    if (!principal) {
      return this.fotografias();
    }

    return this.fotografias().filter((foto) => String(foto.id) !== String(principal.id));
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del parque.');
      return;
    }

    this.cargarParque(id);
    this.cargarFotografias(id);
  }

  private cargarParque(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.parquesService.getById(id).subscribe({
      next: (parque) => {
        this.parque.set(parque);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar parque:', error);

        this.error.set('No se pudo cargar la información del parque.');

        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('PARQUE', id).subscribe({
      next: (fotografias) => {
        this.fotografias.set(fotografias);
        this.loadingFotografias.set(false);
      },
      error: (error) => {
        console.error('Error al cargar fotografías:', error);

        this.errorFotografias.set(
          error?.error?.message ?? 'No se pudieron cargar las fotografías.',
        );

        this.loadingFotografias.set(false);
      },
    });
  }
}
