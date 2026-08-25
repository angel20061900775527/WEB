import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Auditorio } from '../../../../core/services/auditorios.service';
import { AuditoriosPublicService } from '../../../../core/services/auditorios-public.service';
import { Fotografia } from '../../../../core/services/fotografias.service';
import { FotografiasPublicService } from '../../../../core/services/fotografias-public.service';

@Component({
  selector: 'app-public-auditorios-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './auditorios-detail.html',
  styleUrl: './auditorios-detail.scss',
})
export class AuditoriosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auditoriosService = inject(AuditoriosPublicService);
  private readonly fotografiasService = inject(FotografiasPublicService);

  readonly auditorio = signal<Auditorio | null>(null);
  readonly fotografias = signal<Fotografia[]>([]);

  readonly cargando = signal(false);
  readonly cargandoFotografias = signal(false);

  readonly error = signal<string | null>(null);
  readonly errorFotografias = signal<string | null>(null);

  readonly fotografiaPrincipal = computed(() => {
    const auditorio = this.auditorio();
    const fotografias = this.fotografias();

    if (!auditorio || fotografias.length === 0) {
      return null;
    }

    if (auditorio.fotografiaPrincipalId) {
      const principal = fotografias.find(
        (fotografia) => String(fotografia.id) === String(auditorio.fotografiaPrincipalId),
      );

      if (principal) {
        return principal;
      }
    }

    return fotografias[0] ?? null;
  });

  readonly fotografiasSecundarias = computed(() => {
    const principal = this.fotografiaPrincipal();

    if (!principal) {
      return this.fotografias();
    }

    return this.fotografias().filter(
      (fotografia) => String(fotografia.id) !== String(principal.id),
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se encontró el auditorio solicitado.');
      return;
    }

    this.cargarAuditorio(id);
  }

  private cargarAuditorio(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.auditoriosService.getById(id).subscribe({
      next: (auditorio) => {
        this.auditorio.set(auditorio);
        this.cargando.set(false);

        this.cargarFotografias(auditorio.id);
      },
      error: () => {
        this.error.set('No se encontró el auditorio solicitado.');
        this.cargando.set(false);
      },
    });
  }

  private cargarFotografias(id: number): void {
    this.cargandoFotografias.set(true);
    this.errorFotografias.set(null);

    this.fotografiasService.getAll('AUDITORIO', String(id)).subscribe({
      next: (fotografias) => {
        this.fotografias.set(fotografias);
        this.cargandoFotografias.set(false);
      },
      error: () => {
        this.fotografias.set([]);
        this.errorFotografias.set('No se pudieron cargar las fotografías.');
        this.cargandoFotografias.set(false);
      },
    });
  }
}
