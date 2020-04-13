import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryProblemController {
  /**
   * return all deliverys with problems
   */
  async index(req, res) {
    const dataProblems = await DeliveryProblem.findAll();

    return res.status(200).json(dataProblems);
  }

  /**
   * return problem of a especific delivery
   */
  async show(req, res) {
    /** DESTRUCTURING */
    const { id: deliveryId } = req.params;

    const dataProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: deliveryId,
      },
    });

    return res.status(200).json(dataProblems);
  }

  /**
   * Register a problem of a delivery
   */
  async store(req, res) {
    /** CHECK TYPES OF BODY */
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'You need a description of problem.' });
    }

    /** DESTRUCTURING */
    const { id: deliveryId } = req.params;
    const { description } = req.body;

    /** SAVE DELIVERY IN BD */
    const dataProblem = await DeliveryProblem.create({
      delivery_id: deliveryId,
      description,
    });

    // TODO: Avaliar se o administrador precisa ser avisado por email

    return res.status(201).json(dataProblem);
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
