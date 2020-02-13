import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // TODO: Identificar duplicatas a partir da uniao de number + zipcode
    /* const recipientExists = await Recipient.findOne({
      where: { email: req.body.email },
    }); */

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
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string().when('zip_code', (street, field) =>
        street ? field.required() : field
      ),
      number: Yup.number().when('zip_code', (number, field) =>
        number ? field.required() : field
      ),
      complement: Yup.string(),
      state: Yup.string().when('zip_code', (state, field) =>
        state ? field.required() : field
      ),
      city: Yup.string().when('zip_code', (city, field) =>
        city ? field.required() : field
      ),
      zip_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { index } = req.params;

    const recipient = await Recipient.findByPk(index);

    // TODO: Identificar duplicatas a partir da uniao de number + zipcode
    /* const { email, oldPassword } = req.body;
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists ' });
      }
    } */

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
