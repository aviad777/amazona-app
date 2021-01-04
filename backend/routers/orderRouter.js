import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post('/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        if (req.body.orderItems.length === 0) {
            // client error, validation error
            res.status(400).send({ message: 'car is empty' })
        } else {
            const order = new Order({
                orderItems: req.body.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.itemsPrice,
                taxsPrice: req.body.itemsPrice,
                totalPrice: req.body.itemsPrice,
                user: req.user._id
            });
            const createdOrder = await order.save();
            // status of new item
            res.status(201).send({ message: 'New Order Created', order: createdOrder });
        }
    }));
export default orderRouter;