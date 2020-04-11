import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    // TODO: Avaliar necessidade de retornar o avatar_id
    const deliverymans = await Deliveryman.findAll();
    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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

    const deliveryman = await Deliveryman.create(req.body);
    return res.json(deliveryman);
  }

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

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      avatar_id: Yup.number(),
      email: Yup.string().email(),
      confirmEmail: Yup.string().when('email', (email, field) =>
        email ? field.required().oneOf([Yup.ref('email')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

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
