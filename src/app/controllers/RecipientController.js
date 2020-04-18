import Recipient from '../models/Recipient';
import detectAccent from '../../lib/AccentRegex';

const { Op } = require('sequelize');

class RecipientController {
  async index(req, res) {
    /** DESTRUCTURING */
    const { q: name, page = 1 } = req.query;

    const recipientsData = await Recipient.findAll({
      where: {
        name: {
          [Op.or]: {
            [Op.iLike]: name ? `%${name}%` : `%%`,
            [Op.iRegexp]: name ? `${detectAccent(name)}` : `%%`,
          },
        },
      },
      order: [['name', 'ASC']],
      attributes: [
        'id',
        'name',
        'street',
        'number',
        'complement',
        'state',
        'city',
        'zip_code',
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(recipientsData);
  }

  async store(req, res) {
    const recipientExists = await Recipient.findOne({
      where: {
        [Op.and]: {
          number: req.body.number,
          zip_code: req.body.zip_code,
        },
      },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists ' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    const recipientExists = await Recipient.findOne({
      where: {
        [Op.and]: {
          number: req.body.number,
          zip_code: req.body.zip_code,
        },
      },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists ' });
    }

    /** DESTRUCTURING */
    const { index } = req.params;

    const recipient = await Recipient.findByPk(index);

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
