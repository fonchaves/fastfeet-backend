import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
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

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.inner });
  }
};
