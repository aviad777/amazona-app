import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
    const pageSize = 10;

    const page = Number(req.query.pageNumber) || 1;

    const seller = req.query.seller || '';

    //we make the filter of seller or empty object and we can find it on mongo
    const sellerFilter = seller ? { seller } : {};
    // populate go to user ref in data model and gets only the name.

    const count = await Order.countDocuments({
        ...sellerFilter,
    })

    const orders = await Order.find({ ...sellerFilter })
        .populate('user', 'name')
        .skip(pageSize * (page - 1))
        .limit(pageSize);;



    res.send({ orders, page, pages: Math.ceil(count / pageSize) });

}))

orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
}))

orderRouter.post('/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        if (req.body.orderItems.length === 0) {
            // client error, validation error
            res.status(400).send({ message: 'cart is empty' })
        } else {
            const order = new Order({
                seller: req.body.orderItems[0].seller,
                orderItems: req.body.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.shippingPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.user._id
            });
            const createdOrder = await order.save();
            // status of new item
            res.status(201).send({ message: 'New Order Created', order: createdOrder });
        }
    }));


//only authenticated users can route here.
orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));

orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        const deleteOrder = await order.remove();
        res.send({ message: 'Order deleted' });
    } else {
        res.status.send(404).send({ message: 'order Not found' });
    }
}))



orderRouter.put('/:id/deliver', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}));

export default orderRouter;