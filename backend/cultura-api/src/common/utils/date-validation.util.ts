import { BadRequestException } from '@nestjs/common';

export function validateHistoricalDate(
  fecha?: string,
  nombreCampo = 'La fecha',
): void {
  if (!fecha) {
    return;
  }

  const fechaValidada = new Date(`${fecha}T00:00:00.000Z`);

  if (Number.isNaN(fechaValidada.getTime())) {
    throw new BadRequestException(`${nombreCampo} no tiene un formato válido.`);
  }

  const hoy = new Date();
  hoy.setUTCHours(23, 59, 59, 999);

  if (fechaValidada > hoy) {
    throw new BadRequestException(
      `${nombreCampo} no puede ser posterior a la fecha actual.`,
    );
  }
}
