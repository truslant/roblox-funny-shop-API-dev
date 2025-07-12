const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');

const { Order } = require('../../db/database').models;

const { isAdmin, routeErrorsScript } = require('../utilities/utilities');

router.delete('/cancel', isAdmin, async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const delOrder = await Order.destroy({ where: { id: orderId } });

        if (!delOrder) {
            logger.info(`No order with # ${orderId} found in the system at "${req.path}"`);
            res.status(404).json({ msg: `No order with # ${orderId} found in the system` });
            return
        }
        logger.info(`Order # ${orderId} was deleted successfully by user ID ${req.user.id} at ${req.path}`)
        res.status(204).json({ msg: `Order # ${orderId} was deleted successfully` });
    } catch (error) {
        const errMsg = 'Error while deleting order.';
        routeErrorsScript(next, error, 500, errMsg);
        return;
    }
})

module.exports = router;