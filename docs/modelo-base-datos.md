# SIGPAC - Modelo de Base de Datos

## 1. Módulo Parques

### Tabla: parques

| Campo | Tipo | Obligatorio | Descripción |
|---|---|:---:|---|
| id | BIGSERIAL | Sí | Identificador único |
| nombre | VARCHAR(150) | Sí | Nombre del parque |
| descripcion | TEXT | Sí | Descripción general |
| resena_historica | TEXT | No | Reseña o antecedentes históricos |
| fecha_creacion | DATE | No | Fecha histórica de creación |
| estado | ENUM | Sí | BORRADOR, PUBLICADO o INACTIVO |
| ubicacion | VARCHAR(255) | Sí | Dirección o referencia |
| latitud | NUMERIC(10,7) | No | Coordenada geográfica |
| longitud | NUMERIC(10,7) | No | Coordenada geográfica |
| fotografia_principal_id | BIGINT | No | Referencia a la fotografía principal |
| fecha_registro | TIMESTAMPTZ | Sí | Fecha de creación del registro |
| fecha_modificacion | TIMESTAMPTZ | Sí | Fecha de última modificación |
| usuario_creador_id | BIGINT | Sí | Usuario responsable de la creación |
| usuario_modificador_id | BIGINT | No | Usuario responsable de la modificación |
| usuario_eliminador_id | BIGINT | No | Usuario responsable de la eliminación |
| fecha_eliminacion | TIMESTAMPTZ | No | Fecha de eliminación lógica |
| estado_registro | ENUM | Sí | ACTIVO o ELIMINADO |

### Reglas de negocio

- El nombre, la descripción y la ubicación son obligatorios.
- La reseña histórica y la fecha de creación son opcionales.
- La latitud y la longitud deben registrarse juntas.
- Todo parque nuevo se crea en estado BORRADOR.
- Solo los parques PUBLICADOS y ACTIVOS serán visibles para la ciudadanía.
- La eliminación será lógica, no física.
- La fotografía principal debe pertenecer a la galería del mismo parque.

---

### Tabla: fotografias_parque

| Campo | Tipo | Obligatorio | Descripción |
|---|---|:---:|---|
| id | BIGSERIAL | Sí | Identificador único |
| parque_id | BIGINT | Sí | Parque relacionado |
| nombre_archivo | VARCHAR(255) | Sí | Nombre interno generado |
| nombre_original | VARCHAR(255) | Sí | Nombre original del archivo |
| ruta | VARCHAR(500) | Sí | Ruta relativa del archivo |
| titulo | VARCHAR(150) | No | Título de la fotografía |
| descripcion | TEXT | No | Descripción de la fotografía |
| orden | INTEGER | Sí | Orden dentro de la galería |
| fecha_registro | TIMESTAMPTZ | Sí | Fecha de registro |
| fecha_modificacion | TIMESTAMPTZ | Sí | Fecha de última modificación |
| usuario_creador_id | BIGINT | Sí | Usuario responsable |
| usuario_modificador_id | BIGINT | No | Usuario que modificó |
| usuario_eliminador_id | BIGINT | No | Usuario que eliminó |
| fecha_eliminacion | TIMESTAMPTZ | No | Fecha de eliminación lógica |
| estado_registro | ENUM | Sí | ACTIVO o ELIMINADO |

### Reglas de almacenamiento

- Las imágenes se almacenarán localmente en la máquina virtual institucional.
- La base de datos guardará rutas relativas, no URL completas.
- Los nombres físicos se generarán automáticamente para evitar duplicados.
- Las imágenes se convertirán a formato WEBP.
- La estructura física prevista será:

```text
uploads/
└── parques/
    └── {parqueId}/
        ├── imagen-1.webp
        └── imagen-2.webp