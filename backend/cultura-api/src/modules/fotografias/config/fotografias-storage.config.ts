import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';

import { TipoPatrimonio } from '../enums/tipo-patrimonio.enum';

const carpetasPorTipo: Record<TipoPatrimonio, string> = {
  [TipoPatrimonio.PARQUE]: 'parques',
  [TipoPatrimonio.CALLE]: 'calles',
  [TipoPatrimonio.MONUMENTO]: 'monumentos',
  [TipoPatrimonio.RIO]: 'rios',
  [TipoPatrimonio.PLAZA]: 'plazas',
  [TipoPatrimonio.MUSEO]: 'museos',
  [TipoPatrimonio.AUDITORIO]: 'auditorios',
};

function asegurarDirectorio(ruta: string): void {
  if (!existsSync(ruta)) {
    mkdirSync(ruta, {
      recursive: true,
    });
  }
}

export const fotografiasStorage = diskStorage({
  destination: (
    req: Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ): void => {
    const tipoPatrimonio = req.params['tipoPatrimonio'] as TipoPatrimonio;

    if (!Object.values(TipoPatrimonio).includes(tipoPatrimonio)) {
      callback(
        new BadRequestException('El tipo de patrimonio indicado no es válido.'),
        '',
      );

      return;
    }

    const carpeta = carpetasPorTipo[tipoPatrimonio];

    const ruta = join(process.cwd(), 'uploads', 'patrimonio', carpeta);

    asegurarDirectorio(ruta);

    callback(null, ruta);
  },

  filename: (
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ): void => {
    const extension = extname(file.originalname).toLowerCase();

    const nombreUnico = `${Date.now()}-${Math.round(
      Math.random() * 1_000_000_000,
    )}${extension}`;

    callback(null, nombreUnico);
  },
});
