import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';


// this is a wrpapper on route and renders  a component only if he signs in

export default function AdminRoute({ component: Component, ...rest }) {
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    return (
        <Route {...rest} render={(props) =>
            userInfo && userInfo.isAdmin ?
                (<Component {...props}></Component>) :
                (<Redirect to="/signin"></Redirect>)} >
        </Route>

    )
}
