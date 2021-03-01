import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createProduct } from './actions/productAction';
import data from './data';
import { cartReducer } from './reducers/cartReducers';
import { orderCreateReducer, orderDeleteReducer, orderDeliverReducer, orderDetailsReducer, orderListReducer, orderMineListReducer, orderPayReducer } from './reducers/orderReducers';
import { productListReducer, productDetailsReducer, productCreateReducer, productUpdateReducer, productDeleteReducer, productCategoryListReducer, productReviewCreateReducer } from './reducers/productReducers';
import { userAddressMapReducer, userDeleteReducer, userDetailsReducer, userListReducer, userRegisterReducer, userSigninReducer, userTopSellerListReducer, userTopSellersListReducer, userUpdateProfileReducer, userUpdateReducer } from './reducers/userReducers';



const initialState = {
    userSignin: {
        userInfo: localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo')) : null,
    },
    cart: {
        cartItems:
            localStorage.getItem('cartItems')
                ? JSON.parse(localStorage.getItem('cartItems'))
                : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
        paymentMethod: 'PayPal'
    }
};
const reducer = combineReducers({
    productList: productListReducer,
    productCategoryList: productCategoryListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdate: userUpdateReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer,
    orderDeliver: orderDeliverReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userTopSellersList: userTopSellersListReducer,
    productReviewCreate: productReviewCreateReducer,
    userAddressMap: userAddressMapReducer

})
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;