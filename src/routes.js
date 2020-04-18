import { Router } from 'express';

import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

/** Middleware of Entry Validators */
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateRecipientIndex from './app/validators/RecipientIndex';
import validateRecipientStore from './app/validators/RecipientStore';
import validateRecipientUpdate from './app/validators/RecipientUpdate';

/** Middleware of Authorization */
import isPrivate from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.send('Hello World!');
});

/** CRIAÇAO E AUTENTICAÇAO DE USUARIOS */
routes.post('/sessions', validateSessionStore, SessionController.store);
routes.post('/users', isPrivate, validateUserStore, UserController.store);
routes.put('/users', isPrivate, validateUserUpdate, UserController.update);

/** ROTA DE ENVIO DE ARQUIVOS EM GERAL */
routes.post('/files', FileController.store);

/** ROTAS DE DESTINATARIOS */
routes.get(
  '/recipient',
  isPrivate,
  validateRecipientIndex,
  RecipientController.index
);
routes.post(
  '/recipient',
  isPrivate,
  validateRecipientStore,
  RecipientController.store
);
routes.put(
  '/recipient/:index',
  isPrivate,
  validateRecipientUpdate,
  RecipientController.update
);

/** ROTAS DE ENTREGADORES */
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.get('/deliveryman', isPrivate, DeliverymanController.index);
routes.post('/deliveryman', isPrivate, DeliverymanController.store);
routes.put('/deliveryman/:id', isPrivate, DeliverymanController.update);
routes.delete('/deliveryman/:id', isPrivate, DeliverymanController.delete);

/** ROTAS DE ENCOMENDAS */
routes.get('/delivery', isPrivate, DeliveryController.index);
routes.post('/delivery', isPrivate, DeliveryController.store);
routes.put('/delivery/:id', isPrivate, DeliveryController.update);
routes.delete('/delivery/:id', isPrivate, DeliveryController.delete);

/** ROTAS DE ORDENS DE ENTREGA */
routes.get('/deliveryman/:id/orders', OrderController.index);
routes.get('/deliveryman/:id/deliveries', OrderController.show);
routes.post('/deliveryman/:id/orders/:id_delivery', OrderController.store);
routes.put('/deliveryman/:id/orders/:id_delivery', OrderController.update);

/** ROTAS DE PROBLEMAS DE ENTREGA */
routes.get('/delivery/problems', isPrivate, DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.show);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.delete(
  '/problem/:id/cancel-delivery',
  isPrivate,
  DeliveryProblemController.delete
);

export default routes;
