import { startOfHour, parseISO, isAfter, isBefore, getHours } from 'date-fns';

import Delivery from '../models/Delivery';

import detectAccent from '../../lib/AccentRegex';

const { Op } = require('sequelize');

class DeliveryController {
  async index(req, res) {
    /** DESTRUCTURING */
    const { q: nameProduct, page = 1 } = req.query;

    const deliveryData = await Delivery.findAll({
      where: {
        canceled_at: null,
        product: {
          [Op.or]: {
            [Op.iLike]: nameProduct ? `%${nameProduct}%` : `%%`,
            [Op.iRegexp]: nameProduct ? `${detectAccent(nameProduct)}` : `%%`,
          },
        },
      },
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.status(200).json(deliveryData);
  }

  async store(req, res) {
    /** DESTRUCTURING */
    const { recipient_id, deliveryman_id, product } = req.body;

    const {
      id,
      signature_id,
      canceled_at,
      start_date,
      end_date,
    } = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    // TODO: NOTIFICAR O DELIVERYMAN COM EMAIL E DETALHES DA ENCOMENDA

    return res
      .status(201)
      .json(
        id,
        recipient_id,
        deliveryman_id,
        product,
        signature_id,
        canceled_at,
        start_date,
        end_date
      );
  }

  async update(req, res) {
    /** DESTRUCTURING */
    const {
      recipient_id,
      deliveryman_id,
      product,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    } = req.body;
    const { id: index } = req.params;

    const delivery = await Delivery.findByPk(index);

    if (start_date) {
      /**
       * Check for past dates
       */
      const hourStart = startOfHour(parseISO(start_date));
      if (isBefore(hourStart, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }

      /**
       * Check start_date for dates before 08:00
       */
      if (isBefore(start_date, new Date().setHours(8, 0, 0, 0))) {
        return res.status(400).json({
          error: 'Its only permitted start_date between 08:00 and 18h:00',
        });
      }

      /**
       * Check start_date for dates after 18:00
       */
      if (getHours(start_date) >= 18) {
        return res.status(400).json({
          error: "It's not permitted start_date after 18h:00",
        });
      }
    }

    /**
     * Check if end_date is before start_date
     */
    if (end_date && isAfter(end_date, start_date)) {
      return res.status(400).json({
        error: "It's not permitted end_date before start_date",
      });
    }

    /**
     * Check if its not possible to cancel delivery
     */
    if (canceled_at && delivery.end_date) {
      return res.status(400).json({
        error:
          "It's not permitted cancel delivery because it has already been completed ",
      });
    }

    /**
     * Update Delivery on BD
     */
    const { id } = await delivery.update({
      recipient_id,
      deliveryman_id,
      product,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    });

    // TODO: NOTIFICAR O DELIVERYMAN COM EMAIL E DETALHES DA ENCOMENDA

    // TODO: RETORNAR APENAS DADOS NECESSARIOS
    return res.status(200).json({
      id,
      product,
      canceled_at,
      start_date,
      end_date,
      recipient_id,
      deliveryman_id,
      signature_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryData = await Delivery.findByPk(id);

    if (!deliveryData) {
      res.status(400).json({ error: 'Delivery not found' });
    }

    await deliveryData.destroy();

    return res.status(200).json();
  }
}

export default new DeliveryController();
