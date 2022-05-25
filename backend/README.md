# Simple Twitter API

Este ejercicio consiste en crear una API que simule el funcionamiento de una aplicación similar a Twitter.

## Instalar

- Crear una base de datos vacía en una instancia de MySQL local.
- Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.
- Ejecutar `node db/initDB` para crear las tablas necesarias en la base de datos anteriormente creada.
- Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

## Entidades

- User:
  - id
  - email
  - password
  - created_at
- Tweet:
  - id
  - user
  - text
  - image (opcional)
  - created_at

## Endpoints

La colección de endpoints funcionando para postman [está aquí](./postman_collection.json).

Usuarios:

- **POST /user** Registro de usuario
- **GET /user/:id** Devuelve información de usuario
- **GET /user/** Devuelve información del usuario del token (necesita cabecera con token)
- **POST /login** Login de usuario (devuelve token)

Tweets:

- **POST /** Permite crear un tweet (necesita cabecera con token)
- **GET /** Lista todos los tweets
- **GET /tweet/:id** Devuelve un tweet
- **DELETE /tweet/:id** Borra un tweet solo si eres quien lo creó (necesita cabecera con token)
