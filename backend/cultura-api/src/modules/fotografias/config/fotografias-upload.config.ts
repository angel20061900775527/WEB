import { BadRequestException } from '@nestjs/common';

export const MAX_FOTOGRAFIA_SIZE = 5 * 1024 * 1024;

export function fotografiaFileFilter(
  req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
): void {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP.'),
      false,
    );
  }

  callback(null, true);
}
