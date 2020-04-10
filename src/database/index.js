import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Delivery from '../app/models/Delivery';
import Deliveryman from '../app/models/Deliveryman';
import File from '../app/models/File';
import Recipient from '../app/models/Recipient';
import User from '../app/models/User';

const models = [User, Recipient, File, Delivery, Deliveryman];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
