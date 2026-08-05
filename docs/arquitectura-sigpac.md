# Arquitectura de Software — SIGPAC

## 1. Información general

**Nombre del sistema:** SIGPAC  
**Nombre funcional:** Sistema de Gestión del Patrimonio Cultural del Cantón Zamora  
**Institución:** Gobierno Autónomo Descentralizado Municipal de Zamora  
**Versión del documento:** 1.0  
**Estado:** En desarrollo

---

## 2. Objetivo del sistema

SIGPAC tiene como objetivo registrar, administrar, conservar y publicar
información histórica, cultural y patrimonial del cantón Zamora mediante
fichas digitales estandarizadas.

El sistema permitirá centralizar información que actualmente puede
encontrarse dispersa en archivos físicos, documentos institucionales,
investigaciones, entrevistas y registros fotográficos.

---

## 3. Alcance de SIGPAC 1.0

La primera versión del sistema contempla los siguientes módulos:

1. Parques
2. Calles
3. Monumentos
4. Ríos
5. Plazas
6. Museos
7. Auditorios

Los módulos Jardines, Avenidas y Personajes no forman parte del alcance
inicial.

---

## 4. Arquitectura tecnológica

### 4.1 Backend

- Framework: NestJS
- Lenguaje: TypeScript
- ORM: TypeORM
- Base de datos: PostgreSQL
- Documentación de API: Swagger
- Arquitectura: modular
- Estilo de comunicación: API REST

### 4.2 Frontend

- Framework: Angular
- Lenguaje: TypeScript
- Estilos: SCSS
- Componentes visuales: Angular Material
- Arquitectura: componentes reutilizables por sección de ficha

### 4.3 Control de versiones

- Sistema: Git
- Rama principal: `master`
- Repositorio remoto: configurado en la nube
- Commits: redactados en español

---

## 5. Arquitectura general

```text
Frontend Angular
       |
       | HTTP / JSON
       v
API REST NestJS
       |
       v
Servicios de dominio
       |
       v
Repositorios TypeORM
       |
       v
PostgreSQL