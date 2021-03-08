import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../../node_modules/axios/index';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';


export default function ProfileScreen() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [sellerLogo, setSellerLogo] = useState('');
    const [sellerDescription, setSellerDescription] = useState('');




    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    console.log('user info', userInfo);
    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;
    console.log('user details loading: ', loading, ' error: ', error, ' user: ', user);
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const {
        success: successUpdate, error: errorUpdate, loading: loadingUpdate,
    } = userUpdateProfile;


    console.log('user is: ', user, 'user update: ', userUpdateProfile);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('use effect!');
        if (!user) {
            console.log('no user!');
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch(detailsUser(userInfo._id));

        } else {
            setName(user.name);
            setEmail(user.email);
            if (user.seller) {
                console.log('user.seller!');
                setSellerName(user.seller.name);
                setSellerLogo(user.seller.logo);
                setSellerDescription(user.seller.description);
            }
        }
    }, [dispatch, userInfo._id, user,]);


    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');


    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await Axios.post('/api/uploads/s3', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                },
            })
            setSellerLogo(data);
            setLoadingUpload(false);
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    }


    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Password and confirm Password are not Matched');
        } else {
            dispatch(updateUserProfile({
                userId: user._id,
                name,
                email,
                password,
                sellerName,
                sellerLogo,
                sellerDescription,
            }));
        }
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    loading ? (<LoadingBox></LoadingBox>
                    ) :
                        error ? (<MessageBox variant="danger">{error}</MessageBox>)
                            : user ? (
                                <>
                                    {loadingUpdate && <LoadingBox></LoadingBox>}
                                    {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                                    {successUpdate && <MessageBox>Profile Updated Successfully</MessageBox>}
                                    <div>
                                        <label htmlFor="name">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Enter name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        ></input>
                                    </div>
                                    <div>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        ></input>
                                    </div>
                                    <div>
                                        <label htmlFor="password">Password</label>
                                        <input
                                            id="password"
                                            type="text"
                                            placeholder="Enter password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        ></input>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input
                                            id="confirmPassword"
                                            type="text"
                                            placeholder="Enter confirmed password"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        ></input>
                                    </div>
                                    {
                                        user.isSeller && (
                                            <>
                                                <h2>Seller</h2>
                                                <div>
                                                    <label htmlFor="sellerName">Seller Name</label>
                                                    <input
                                                        id="sellerName" type="text" placeholder="Enter Seller Name"
                                                        value={sellerName}
                                                        onChange={(e) => setSellerName(e.target.value)}
                                                    ></input>
                                                </div>
                                                <div>
                                                    <label htmlFor="sellerLogo">Seller Logo</label>
                                                    <input
                                                        id="sellerLogo" type="text" placeholder="Enter Seller Logo"
                                                        value={sellerLogo}
                                                        onChange={(e) => setSellerLogo(e.target.value)}
                                                    ></input>
                                                </div>

                                                <div>
                                                    <label htmlFor="imageFile">Image File</label>
                                                    <input
                                                        id="imageFile"
                                                        type="file"
                                                        label="Choose Image"
                                                        onChange={uploadFileHandler}
                                                    ></input>
                                                    {loadingUpload && <LoadingBox></LoadingBox>}
                                                    {errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}
                                                </div>


                                                <div>
                                                    <label htmlFor="sellerDescription">Seller Description</label>
                                                    <input
                                                        id="sellerDescription" type="text" placeholder="Enter Seller Description"
                                                        value={sellerDescription}
                                                        onChange={(e) => setSellerDescription(e.target.value)}
                                                    ></input>
                                                </div>
                                            </>
                                        )
                                    }

                                    <div>
                                        <label />
                                        <button className="primary block" type="submit">
                                            Update
                                    </button>

                                    </div>

                                </>
                            ) : (
                                    <LoadingBox></LoadingBox>
                                )
                }
            </form>
        </div >
    )
}
