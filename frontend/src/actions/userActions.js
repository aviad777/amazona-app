import Axios from "axios";
import { USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCESS, USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCESS, USER_SIGNOUT } from "../constants/userConstants"

export const register = (name, email, password) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } });
    try {
        const { data } = await Axios.post('/api/users/register', { name, email, password });
        dispatch({ type: USER_REGISTER_SUCESS, payload: data });
        dispatch({ type: USER_SIGNIN_SUCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
        dispatch({
            type: USER_REGISTER_FAIL, payload:
                err.response && err.response.data.message
                    ? err.response.data.message : err.message,
        })
    }
}
export const signin = (email, password) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
    try {
        const { data } = await Axios.post('/api/users/signin', { email, password });
        dispatch({ type: USER_SIGNIN_SUCESS, payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (err) {
        dispatch({
            type: USER_SIGNIN_FAIL, payload:
                err.response && err.response.data.message
                    ? err.response.data.message : err.message,
        })
    }
}
export const signout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    dispatch({
        type: USER_SIGNOUT
    });
}