import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../usuarios/enums/rol-usuario.enum';

import { fotografiasStorage } from './config/fotografias-storage.config';
import {
  fotografiaFileFilter,
  MAX_FOTOGRAFIA_SIZE,
} from './config/fotografias-upload.config';
import { FotografiaResponseDto } from './dto/response/fotografia-response.dto';
import { TipoPatrimonio } from './enums/tipo-patrimonio.enum';
import { FotografiasService } from './fotografias.service';

interface AuthenticatedRequest {
  user: {
    id: number | string;
    username: string;
    rol: RolUsuario;
  };
}

@ApiTags('Fotografías')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fotografias')
export class FotografiasController {
  constructor(private readonly fotografiasService: FotografiasService) {}

  @Post(':tipoPatrimonio/:registroId')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fotografiasStorage,
      fileFilter: fotografiaFileFilter,
      limits: {
        fileSize: MAX_FOTOGRAFIA_SIZE,
      },
    }),
  )
  @ApiOperation({
    summary: 'Subir fotografía',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'tipoPatrimonio',
    enum: TipoPatrimonio,
  })
  @ApiParam({
    name: 'registroId',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        descripcion: {
          type: 'string',
          nullable: true,
          example: 'Vista principal del parque.',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    description: 'Fotografía registrada correctamente.',
    type: FotografiaResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Archivo inválido, tipo de patrimonio inválido o imagen no permitida.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el registro patrimonial indicado.',
  })
  subir(
    @Param('tipoPatrimonio')
    tipoPatrimonio: TipoPatrimonio,
    @Param('registroId', ParseIntPipe)
    registroId: number,
    @UploadedFile()
    file: Express.Multer.File,
    @Body('descripcion')
    descripcion: string | undefined,
    @Req()
    request: AuthenticatedRequest,
  ): Promise<FotografiaResponseDto> {
    return this.fotografiasService.registrar(
      tipoPatrimonio,
      registroId,
      file,
      request.user.id,
      descripcion,
    );
  }

  @Get('detalle/:id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Obtener fotografía por id',
  })
  @ApiOkResponse({
    type: FotografiaResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró la fotografía indicada.',
  })
  obtener(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<FotografiaResponseDto> {
    return this.fotografiasService.obtenerPorId(id);
  }
  @Get(':tipoPatrimonio/:registroId')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Listar fotografías de un registro patrimonial',
  })
  @ApiParam({
    name: 'tipoPatrimonio',
    enum: TipoPatrimonio,
  })
  @ApiParam({
    name: 'registroId',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Listado de fotografías del registro.',
    type: FotografiaResponseDto,
    isArray: true,
  })
  listar(
    @Param('tipoPatrimonio')
    tipoPatrimonio: TipoPatrimonio,
    @Param('registroId', ParseIntPipe)
    registroId: number,
  ): Promise<FotografiaResponseDto[]> {
    return this.fotografiasService.listarPorRegistro(
      tipoPatrimonio,
      registroId,
    );
  }
  @Patch(':id/principal')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Establecer fotografía como principal',
  })
  @ApiOkResponse({
    description: 'Fotografía principal actualizada correctamente.',
    type: FotografiaResponseDto,
  })
  establecerPrincipal(
    @Param('id', ParseIntPipe)
    id: number,
    @Req()
    request: AuthenticatedRequest,
  ): Promise<FotografiaResponseDto> {
    return this.fotografiasService.establecerPrincipal(id, request.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Eliminar lógicamente una fotografía',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró la fotografía indicada.',
  })
  async eliminar(
    @Param('id', ParseIntPipe)
    id: number,
    @Req()
    request: AuthenticatedRequest,
  ): Promise<void> {
    await this.fotografiasService.eliminar(id, request.user.id);
  }
}
