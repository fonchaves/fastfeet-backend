import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import detectAccent from '../../lib/AccentRegex';

const { Op } = require('sequelize');

class DeliverymanController {
  async show(req, res) {
    const { id: index } = req.params;

    const { id, name, email, avatar } = await Deliveryman.findByPk(index, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.status(200).json({
      id,
      name,
      email,
      avatar,
    });
  }

  async index(req, res) {
    /** DESTRUCTURING */
    const { q: name, page = 1 } = req.query;

    const deliverymansData = await Deliveryman.findAll({
      where: {
        name: {
          [Op.or]: {
            [Op.iLike]: name ? `%${name}%` : `%%`,
            [Op.iRegexp]: name ? `${detectAccent(name)}` : `%%`,
          },
        },
      },
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'email'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymansData);
  }

  async store(req, res) {
    // TODO: Avaliar estratégia de inserção junto ao Frontend
    if (!req.body.avatar_id) {
      const rand = Math.floor(Math.random() * 1000);

      const file = await File.create({
        name: 'Avatar Adorable',
        path: `https://api.adorable.io/avatars/100/avatar${rand}.png`,
      });
      req.body.avatar_id = file.id;
    }

    const userExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const { id, name, email, avatar_id } = await Deliveryman.create(req.body);

    return res.status(201).json({ id, name, email, avatar_id });
  }

  async update(req, res) {
    /** DESTRUCTURING */
    const { id: index } = req.params;
    const { name, email } = req.body;

    const deliveryman = await Deliveryman.findByPk(index);

    if (email && email !== deliveryman.email) {
      const emailExists = await Deliveryman.findOne({
        where: { email },
      });
      if (emailExists) {
        return res.status(400).json({ error: 'E-mail already exists.' });
      }
    }

    const { id } = await deliveryman.update(req.body);

    return res.status(200).json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    /** DESTRUCTURING */
    const { id: index } = req.params;

    const deliveryman = await Deliveryman.findByPk(index);

    if (!deliveryman) {
      res.status(400).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();

    return res.status(200).json();
  }
}

export default new DeliverymanController();
