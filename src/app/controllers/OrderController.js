import { isBefore, getHours, startOfDay, endOfDay } from 'date-fns';
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
    const { id: deliverymanId } = req.params;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: { [Op.not]: null },
      },
    });

    return res.status(200).json(deliveries);
  }

  async store(req, res) {
    const { id: deliverymanId, id_delivery: deliveryId } = req.params;

    const currentDate = new Date();

    const { count } = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)],
        },
        canceled_at: null,
      },
    });

    /** CHECK WITH IS MORE THAN 5 GET ORDERS FOR DAY */
    if (count >= 5) {
      return res.status(401).json({
        error: 'Its only permitted get 5 orders for day',
      });
    }

    // TODO: Com o 'id', o deliveryman_id se torna redundante
    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: null,
      },
    });

    /** CHECK start_date FOR DATES BEFORE 08:00 */
    if (isBefore(currentDate, new Date().setHours(8, 0, 0, 0))) {
      return res.status(400).json({
        error: 'Its only permitted start_date between 08:00 and 18h:00',
      });
    }

    /** CHECK start_date FOR DATES AFTER 18:00 */
    if (getHours(currentDate) >= 18) {
      return res.status(400).json({
        error: "It's not permitted start_date after 18h:00",
      });
    }

    const dataDelivery = await delivery.update({
      start_date: currentDate,
    });

    // TODO: RETORNAR APENAS DADOS NECESSARIOS
    return res.status(200).json(dataDelivery);
  }

  async update(req, res) {
    const { id, id_delivery } = req.params;

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
