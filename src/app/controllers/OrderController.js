import Delivery from '../models/Delivery';

const { Op } = require('sequelize');

class OrderController {
  async index(req, res) {
    const { id } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
    });

    return res.status(200).json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: { [Op.not]: null },
      },
    });

    return res.status(200).json(deliveries);
  }
}

export default new OrderController();
