import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { DeleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELTE_RESET } from '../constants/orderConstants';

export default function OrderListScreen(props) {

    const {
        pageNumber = 1
    } = useParams();



    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const orderList = useSelector(state => state.orderList);
    const { loading, error, orders, page, pages } = orderList;
    // const orders2 = orders.map(order => { return order.isDelivered });
    // console.log('orders2', orders2);
    const orderDelete = useSelector(state => state.orderDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = orderDelete;
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();
    useEffect(() => {

        dispatch({ type: ORDER_DELTE_RESET })
        dispatch(listOrders({ seller: sellerMode ? userInfo._id : '', pageNumber }));
    }, [dispatch, successDelete, pageNumber]);

    const deleteHandler = (order) => {
        if (window.confirm('Are you sure to delete')) {
            dispatch(DeleteOrder(order._id));
        }

    }

    return (
        <div>
            <h1>Orders</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger" >{errorDelete}</MessageBox>}
            {

                loading ? <LoadingBox></LoadingBox> :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
                        :
                        (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>USER</th>
                                            <th>TOTAL</th>
                                            <th>PAID</th>
                                            <th>DELIVERED</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            orders.map((order) =>
                                            (

                                                <tr key={order._id}>
                                                    <td>{order._id}</td>
                                                    <td>{order.user.name}</td>
                                                    <td>{order.createdAt.substring(0, 10)}</td>
                                                    <td>{order.totalPrice.toFixed(2)}</td>
                                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                                    <td>{order.isDelivered && order.deliverdAt ? order.deliverdAt.substring(0, 10) : 'No'}</td>
                                                    <td><button type="button" className="small"
                                                        onClick={() => { props.history.push(`/order/${order._id}`) }}>Details
                                                    </button>
                                                        <button type="button" className="small" onClick={() => deleteHandler(order)}>Delete
                                                    </button>

                                                    </td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <div className="row center pagination">
                                    {
                                        [...Array(pages).keys()].map(x => (
                                            <Link className={(x + 1) === pageNumber ? 'active' : ''} key={x + 1} to={`/orderlist/pageNumber/${x + 1}`}>
                                                {x + 1}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </>
                        )}
        </div>
    )
}
