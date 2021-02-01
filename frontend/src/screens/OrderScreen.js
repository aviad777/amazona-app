import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELIVER_RESET, ORDER_PAYMENT_RESET } from '../constants/orderConstants';

export default function OrderScreen(props) {


    const orderId = props.match.params.id;
    //hook for getting paypal SDK
    const [sdkReady, setSdkReady] = useState(false);
    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const orderPay = useSelector(state => state.orderPay);
    const {
        loading: loadingPay,
        error: errorPay,
        success: successPay
    } = orderPay;
    const orderDeliver = useSelector(state => state.orderDeliver);
    const {
        loading: loadingDeliver,
        error: errorDeliver,
        success: successDeliver
    } = orderDeliver;


    const dispatch = useDispatch();
    useEffect(() => {
        const addPayPalScript = async () => {
            const { data } = await Axios.get('/api/config/paypal');
            //data contains client ID which is in env
            const script = document.createElement('script');
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            // onload happens after script is downloaded and ready to use.
            script.onload = () => {
                setSdkReady(true);
            }

            document.body.appendChild(script);
        }
        console.log('order: ', order, ' successPay: ', successPay, ' SDK: ', sdkReady);
        // if order is not loaded
        if (!order || successPay || successDeliver || (order && order._id !== orderId)) {
            console.log('checking order....');
            dispatch({ type: ORDER_PAYMENT_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });

            dispatch(detailsOrder(orderId));
        }
        else {
            //now we have the order
            if (!order.isPaid) {
                // if it isnt paid, load paypal, if windows.paypal contains value, paypal is already loaded
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
        //In the brackets are the dependecies of the function for refreshing after state is changed
    }, [dispatch, orderId, order, sdkReady, successPay, successDeliver]);

    // payment result is the result we get from PAYPAL!!!!!
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order._id));
    }

    return loading ? (<LoadingBox></LoadingBox>) : error ? (<MessageBox variant="danger">{error}</MessageBox>)
        : (
            <div>
                <h1>Order {order._id}</h1>
                <div className="row top">
                    <div className="col-2">
                        <ul>
                            <li>
                                <div className="card card-body">
                                    <h2>
                                        Shipping
                                </h2>
                                    <p>
                                        <strong>Name:</strong>{order.shippingAddress.fullName} <br />
                                        <strong>Address:</strong>{order.shippingAddress.address},
                                    {order.shippingAddress.city},
                                    {order.shippingAddress.postalCode},
                                    {order.shippingAddress.country}
                                    </p>
                                    {order.isDelivered ? (
                                        <MessageBox variant="success">
                                            Delivered at {order.deliveredAt}
                                        </MessageBox>
                                    ) : (
                                            <MessageBox variant="danger">Not Paid</MessageBox>
                                        )}
                                </div>
                            </li>
                            <li>
                                <div className="card card-body">
                                    <h2>
                                        Payment
                                    </h2>
                                    <p>
                                        <strong>Name:</strong>{order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <MessageBox variant="success">
                                            Paid at {order.paidAt}
                                        </MessageBox>
                                    ) : (
                                            <MessageBox variant="danger">Not Paid</MessageBox>
                                        )}
                                </div>
                            </li>
                            <li>
                                <div className="card card-body">
                                    <h2>
                                        Order Items
                                </h2>
                                    <ul>
                                        {
                                            order.orderItems.map(item =>
                                            (
                                                <li key={item.product}>
                                                    <div className="row">
                                                        <div>
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="small"
                                                            ></img>
                                                        </div>
                                                        <div className="min-30">
                                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                        </div>
                                                        <div>${item.qty} x ${item.price} = ${item.qty * item.price}</div>
                                                    </div>
                                                </li>
                                            )
                                            )
                                        }
                                    </ul>

                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="col-1">
                        <div className="card card-body">
                            <ul>
                                <li>
                                    <h2>Order Summary</h2>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>items</div>
                                        <div><strong>${order.itemsPrice.toFixed(2)}</strong></div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Shipping</div>
                                        <div>${order.shippingPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Tax</div>
                                        <div>${order.taxPrice.toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="row">
                                        <div>Total</div>
                                        <div><strong>${order.totalPrice.toFixed(2)}</strong></div>
                                    </div>
                                </li>
                                {
                                    // is sdk ready is false paypal isnt loaded yey
                                    // if it is ready show the paypal button with the amount of order.totalPrice
                                    !order.isPaid && (
                                        <li>
                                            {!sdkReady ? (<LoadingBox></LoadingBox>) :
                                                (
                                                    <>
                                                        {errorPay && (<MessageBox variant="danger">{errorPay}</MessageBox>)}
                                                        {loadingPay && <LoadingBox></LoadingBox>}
                                                        <PayPalButton
                                                            amount={order.totalPrice}
                                                            onSuccess={successPaymentHandler}
                                                        ></PayPalButton>
                                                    </>
                                                )
                                            }
                                        </li>
                                    )
                                }
                                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <li>
                                        <button type="button" className="primary block" onClick={deliverHandler}>Deliver Order</button>
                                    </li>
                                )}

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
}
