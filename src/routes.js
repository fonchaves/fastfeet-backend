import { Router } from 'express';

import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
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

/** ROTAS DE ENTREGADORES */
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

/** ROTAS DE ENCOMENDAS */
routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

/** ROTAS DE ORDENS DE ENTREGA */
routes.get('/deliveryman/:id/orders', OrderController.index);
routes.get('/deliveryman/:id/deliveries', OrderController.show);
routes.post('/deliveryman/:id/orders/:id_delivery', OrderController.store);
routes.put('/deliveryman/:id/orders/:id_delivery', OrderController.update);

/** ROTAS DE PROBLEMAS DE ENTREGA */
routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.show);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);

export default routes;
