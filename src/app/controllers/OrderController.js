import { isBefore, getHours, startOfDay, endOfDay } from 'date-fns';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

const { Op } = require('sequelize');

class OrderController {
  /**
   * Lista todas as ordens de entrega pendentes para um determinado entregador
   */
  async index(req, res) {
    /** DESTRUCTURING */
    const { id } = req.params;
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'product', 'start_date', 'createdAt'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
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
        },
      ],
    });

    return res.status(200).json(deliveries);
  }

  /**
   * Lista as entregas já realizadas por um determinado entregador
   */
  async show(req, res) {
    /** DESTRUCTURING */
    const { id: deliverymanId } = req.params;
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: { [Op.not]: null },
      },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'product', 'start_date', 'end_date', 'createdAt'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
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
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.status(200).json(deliveries);
  }

  /**
   * Inicia uma ordem de entrega (Quando há retirada do produto pelo entregador)
   */
  async store(req, res) {
    /** DESTRUCTURING */
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

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_date: null,
      },
    });

    const { id, recipient_id, start_date } = await delivery.update({
      start_date: currentDate,
    });

    return res.status(200).json({ id, recipient_id, start_date });
  }

  /**
   * Determina a entrega de um produto ao destino final
   * Necessita de um id de arquivo da assinatura do destinário
   */
  async update(req, res) {
    /** DESTRUCTURING */
    const { id: deliverymanId, id_delivery: deliveryId } = req.params;
    const { signature_id: signatureId } = req.body;

    const currentDate = new Date();

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliverymanId,
        start_date: { [Op.not]: null },
        canceled_at: null,
        end_date: null,
      },
    });

    const { id, signature_id, start_date, end_date } = await delivery.update({
      end_date: currentDate,
      signature_id: signatureId,
    });

    return res.status(200).json({ id, signature_id, start_date, end_date });
  }
}

export default new OrderController();
