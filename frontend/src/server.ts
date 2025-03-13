import express from 'express';
import cors from 'cors'; // Importa el paquete cors
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Habilitar CORS para solicitudes desde http://localhost:4200
const corsOptions = {
  origin: 'http://localhost:4200', // Permitir solicitudes desde Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: true // Asegura que las credenciales se envíen
};
app.use(cors(corsOptions)); // Habilitar CORS


// Servir archivos estáticos desde /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Manejar todas las demás solicitudes renderizando la aplicación Angular
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Iniciar el servidor si este módulo es el principal
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// El manejador de solicitudes utilizado por Angular CLI
export const reqHandler = createNodeRequestHandler(app);
