import { Router } from 'express';

import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.send('Hello World!');
});

/** CRIAÇAO E AUTENTICAÇAO DE USUARIOS */
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// AUTENTICAÇAO DE ADMINISTRADORES OBRIGATORIA DESTA LINHA PRA BAIXO
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', FileController.store);

/** CRIACAO E ATUALIZACAO DE DESTINATARIOS */
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:index', RecipientController.update);

/** CRUD DE ENTREGADORES */
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:index', DeliverymanController.update); // TODO: Trocar para id
routes.delete('/deliveryman/:index', DeliverymanController.delete); // TODO: Trocar para id

/** CRUD DE ENCOMENDAS */
routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

export default routes;
