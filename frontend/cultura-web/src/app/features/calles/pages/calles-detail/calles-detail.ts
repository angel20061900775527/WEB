import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { Calle, CallesService, EstadoCalle } from '../../../../core/services/calles.service';

@Component({
  selector: 'app-calles-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './calles-detail.html',
  styleUrl: './calles-detail.scss',
})
export class CallesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly callesService = inject(CallesService);
  private readonly fotografiasService = inject(FotografiasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  calle = signal<Calle | null>(null);
  fotografias = signal<Fotografia[]>([]);

  archivoSeleccionado = signal<File | null>(null);
  descripcionFotografia = signal('');

  loading = signal(false);
  loadingFotografias = signal(false);
  subiendoFotografia = signal(false);
  cambiandoPrincipal = signal(false);
  eliminandoFotografia = signal(false);

  error = signal('');
  errorFotografias = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');
  mensajeFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const calleActual = this.calle();
    const fotos = this.fotografias();

    if (!calleActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      fotos.find((foto) => String(foto.id) === String(calleActual.fotografiaPrincipalId)) ?? null
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
      this.error.set('No se recibió el identificador de la calle.');
      return;
    }

    this.cargarCalle(id);
    this.cargarFotografias(id);
  }

  private cargarCalle(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.callesService.getById(id).subscribe({
      next: (calle) => {
        this.calle.set(calle);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar calle:', error);

        this.error.set('No se pudo cargar la información de la calle.');

        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('CALLE', id).subscribe({
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

  editar(): void {
    const calleActual = this.calle();

    if (!calleActual) {
      return;
    }

    this.router.navigate(['/calles', calleActual.id, 'editar']);
  }

  cambiarEstado(estado: EstadoCalle): void {
    const calleActual = this.calle();

    if (!calleActual || calleActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.callesService.updateEstado(calleActual.id, estado).subscribe({
      next: () => {
        this.calle.update((calle) =>
          calle
            ? {
                ...calle,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');

        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado de la calle:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado de la calle.');

        this.cambiandoEstado.set(false);
      },
    });
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0] ?? null;

    this.archivoSeleccionado.set(file);
    this.mensajeFotografias.set('');
    this.errorFotografias.set('');
  }

  actualizarDescripcion(valor: string): void {
    this.descripcionFotografia.set(valor);
  }

  subirFotografia(): void {
    const calleActual = this.calle();
    const file = this.archivoSeleccionado();

    if (!calleActual) {
      return;
    }

    if (!file) {
      this.errorFotografias.set('Seleccione una imagen antes de continuar.');
      return;
    }

    this.subiendoFotografia.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService
      .upload('CALLE', calleActual.id, file, this.descripcionFotografia())
      .subscribe({
        next: (fotografia) => {
          this.fotografias.update((fotografias) => [fotografia, ...fotografias]);

          this.archivoSeleccionado.set(null);
          this.descripcionFotografia.set('');

          this.mensajeFotografias.set('Fotografía subida correctamente.');

          this.subiendoFotografia.set(false);
        },
        error: (error) => {
          console.error('Error al subir fotografía:', error);

          this.errorFotografias.set(error?.error?.message ?? 'No se pudo subir la fotografía.');

          this.subiendoFotografia.set(false);
        },
      });
  }

  establecerPrincipal(fotografia: Fotografia): void {
    const calleActual = this.calle();

    if (!calleActual) {
      return;
    }

    if (String(calleActual.fotografiaPrincipalId) === String(fotografia.id)) {
      return;
    }

    this.cambiandoPrincipal.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.setPrincipal(fotografia.id).subscribe({
      next: () => {
        this.calle.update((calle) =>
          calle
            ? {
                ...calle,
                fotografiaPrincipalId: fotografia.id,
              }
            : null,
        );

        this.mensajeFotografias.set('Fotografía principal actualizada correctamente.');

        this.cambiandoPrincipal.set(false);
      },
      error: (error) => {
        console.error('Error al establecer fotografía principal:', error);

        this.errorFotografias.set(
          error?.error?.message ?? 'No se pudo establecer la fotografía principal.',
        );

        this.cambiandoPrincipal.set(false);
      },
    });
  }

  eliminarFotografia(fotografia: Fotografia): void {
    const calleActual = this.calle();

    if (!calleActual) {
      return;
    }

    if (String(calleActual.fotografiaPrincipalId) === String(fotografia.id)) {
      this.errorFotografias.set('No puede eliminar la fotografía principal.');
      return;
    }

    const confirmado = window.confirm(
      `¿Está seguro de eliminar la fotografía "${fotografia.nombreOriginal}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.eliminandoFotografia.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.delete(fotografia.id).subscribe({
      next: () => {
        this.fotografias.update((fotografias) =>
          fotografias.filter((item) => String(item.id) !== String(fotografia.id)),
        );

        this.mensajeFotografias.set('Fotografía eliminada correctamente.');

        this.eliminandoFotografia.set(false);
      },
      error: (error) => {
        console.error('Error al eliminar fotografía:', error);

        this.errorFotografias.set(error?.error?.message ?? 'No se pudo eliminar la fotografía.');

        this.eliminandoFotografia.set(false);
      },
    });
  }
}
