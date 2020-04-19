import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class DeliveryProblemController {
  /**
   * return all deliverys with problems
   */
  async index(req, res) {
    /** DESTRUCTURING */
    const { page = 1 } = req.query;

    const dataProblems = await DeliveryProblem.findAll({
      order: [['created_at', 'ASC']],
      attributes: ['id', 'description'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'start_date'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
            },
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
        },
      ],
    });

    return res.status(200).json(dataProblems);
  }

  /**
   * return problem of a especific delivery
   */
  async show(req, res) {
    /** DESTRUCTURING */
    const { id: deliveryId } = req.params;
    const { page = 1 } = req.query;

    const dataProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: deliveryId,
      },
      order: [['created_at', 'ASC']],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'description', 'created_at'],
    });

    return res.status(200).json(dataProblems);
  }

  /**
   * Register a problem of a delivery
   */
  async store(req, res) {
    /** DESTRUCTURING */
    const { id: deliveryId } = req.params;
    const { description } = req.body;

    const { id, delivery_id, createdAt } = await DeliveryProblem.create({
      delivery_id: deliveryId,
      description,
    });

    // TODO: Administrador precisa ser avisado por email

    return res.status(201).json({ id, delivery_id, description, createdAt });
  }

  /**
   * Cancel a especific delivery
   */
  async delete(req, res) {
    /** DESTRUCTURING */
    const { id: problemId } = req.params;

    const problem = await DeliveryProblem.findByPk(problemId);

    await problem.destroy();

    // TODO: ENVIAR EMAIL AO ENTREGADOR SOBRE O CANCELAMENTO

    return res.status(200).json();
  }
}

export default new DeliveryProblemController();
