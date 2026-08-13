# Gestionador de Usuarios

Microservicio REST para gestión de usuarios con autenticación JWT y base de datos PostgreSQL.

## Tecnologías

- FastAPI
- SQLModel
- PostgreSQL
- Docker / Docker Compose
- JWT (python-jose)
- bcrypt

## Requisitos

- Docker
- Docker Compose

## Funcionalidades

- Registro de usuarios
- Login y autenticación JWT
- Activación de cuenta mediante token
- Protección de rutas autenticadas
- CRUD de usuarios
- Persistencia de datos con PostgreSQL
- Contenerización completa con Docker

## Cómo correrlo

1. Cloná el repositorio
2. Creá un archivo `.env` en la raíz con las siguientes variables:

\```
DB_URL=postgresql+psycopg://postgres:tupassword@db:5432/usuarios
POSTGRES_PASSWORD=tupassword
SECRET_KEY_JWT=tu_clave_secreta
ALGORITHM=algoritmo_de_encriptado (HS256, HS384, HS512)
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password_gmail
POSTGRES_USER=tu_usuario_postrgres
POSTGRES_DB=tu_base_de_datos
\```

3. Corré el proyecto:

\`\`\`bash
docker compose up --build
\`\`\`

4. Accedé a la documentación en `http://localhost/docs`

## Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /users | Crear usuario | No |
| GET | /users | Listar usuarios | Sí |
| PATCH | /users/{id} | Actualizar usuario | Sí |
| DELETE | /users/{id} | Eliminar usuario | Sí |
| POST | /login | Login | No |
| GET | /activate_account/{token} | Activar cuenta | No |