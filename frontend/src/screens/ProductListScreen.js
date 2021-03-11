import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';
import { createProduct, deleteProduct, listProducts, saveProduct } from '../actions/productAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_RESET } from '../constants/productConstants';

export default function ProductListScreen(props) {
    const {
        pageNumber = 1
    } = useParams();

    const [modalVisible, setModalVisible] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);


    const sellerMode = props.match.path.indexOf('/seller') >= 0;


    const productSave = useSelector((state) => state.productSave);
    const { loading: loadingSave, success: successSave, error: errorSave } = productSave;

    const productDelete = useSelector(state => state.productDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);

    const { loading, error, products, page, pages } = productList;


    useEffect(() => {
        if (successSave) {
            setModalVisible(false);
        }
        dispatch(listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber }));
        return () => {

        };
    }, [successSave, successDelete, pageNumber]);


    const openModal = (product) => {
        setModalVisible(true);
        setId(product._id);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveProduct({
            _id: id,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
    }
    const deleteHandler = (product) => {
        dispatch(deleteProduct(product._id));
    }


    const uploadFileHandler = (e) => {
        const file = e.target.file[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setUploading(true);
        Axios.post('/api/uploads', bodyFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
            .then((response) => {
                setImage(response.data);
                setUploading(false);
            })
            .catch((err) => {
                console.log(err);
                setUploading(false);
            });
    }

    return (
        <div className="content content-margined">
            <div className="product-header">
                <h3>Products</h3>
                <button className="button primary" onClick={() => openModal({})}>
                    Create Product
                </button>
            </div>
            {modalVisible && (
                <div className="form">
                    <form onSubmit={submitHandler}>
                        <ul className="form-container">
                            <li>
                                <h2>Create Product</h2>
                            </li>
                            <li>
                                {loadingSave && <div>Loading...</div>}
                                {errorSave && <div>{errorSave}</div>}
                            </li>
                            <li>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    id="name"
                                    onChange={(e) => setName(e.target.value)}
                                ></input>
                            </li>
                            <li>
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={price}
                                    id="price"
                                    onChange={(e) => setPrice(e.target.value)}
                                ></input>
                            </li>
                            <li>
                                <label htmlFor="image">Image</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={image}
                                    id="image"
                                    onChange={(e) => setImage(e.target.value)}
                                ></input>
                                <label htmlFor="file">File</label>
                                <input type="file" onChange={uploadFileHandler}></input>
                                {uploading && <div>Uploading...</div>}
                            </li>
                            <li>
                                <label htmlFor="brand">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={brand}
                                    id="brand"
                                    onChange={(e) => setBrand(e.target.value)}
                                ></input>
                            </li>
                            <li>
                                <label htmlFor="countInStock">Count In Stock</label>
                                <input
                                    type="text"
                                    name="countInStock"
                                    value={countInStock}
                                    id="countInStock"
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </input>
                            </li>
                            <li>
                                <label htmlFor="name">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={category}
                                    id="category"
                                    onChange={(e) => setCategory(e.target.value)}
                                ></input>
                            </li>
                            <li>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    name="description"
                                    value={description}
                                    id="description"
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setModalVisible(false)}
                                    className="button secondary"
                                >
                                    Back
                                </button>
                            </li>
                        </ul>
                    </form>
                </div>
            )}

            {products && (
                <div className="product-list">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <button className="button" onClick={() => openModal(product)}>
                                            Edit
                                    </button> {' '}
                                        <button class="button"
                                            onClick={() => deleteHandler(product)}
                                        >
                                            Delete
                                </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row center pagination">
                        {
                            [...Array(pages).keys()].map(x => (
                                <Link className={(x + 1) === page ? 'active' : ''} key={x + 1} to={sellerMode ? `/productlist/seller/pageNumber/${x + 1}` : `/productlist/pageNumber/${x + 1}`}>
                                    {x + 1}
                                </Link>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    )




















    // useEffect(() => {
    //     if (successCreate) {
    //         dispatch({ type: PRODUCT_CREATE_RESET });
    //         props.history.push(`/product/${createdProduct._id}/edit`);
    //     }
    //     if (successDelete) {
    //         dispatch({ type: PRODUCT_DELETE_RESET });
    //     }
    //     dispatch(listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber }));
    // }, [dispatch, createdProduct, props.history, successCreate, successDelete, userInfo._id, pageNumber]);


    // return (
    //     <div>
    //         <div className="row">
    //             <h1>Products</h1>
    //             <button type="button" className="primary" onClick={createHandler}>
    //                 Create Product
    //             </button>

    //         </div>
    //         {loadingDelete && <LoadingBox></LoadingBox>}
    //         {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

    //         {loadingCreate && <LoadingBox></LoadingBox>}
    //         {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
    //         {
    //             loading ? <LoadingBox></LoadingBox>
    //                 :
    //                 error ? <MessageBox variant="danger">{error}</MessageBox>
    //                     :
    //                     <>
    //                         <table className="table">
    //                             <thead>
    //                                 <tr>
    //                                     <th>ID</th>
    //                                     <th>NAME</th>
    //                                     <th>PRICE</th>
    //                                     <th>CATEGORY</th>
    //                                     <th>BRAND</th>
    //                                     <th>ACTIONS</th>
    //                                 </tr>
    //                             </thead>
    //                             <tbody>
    //                                 {products.map(product => (
    //                                     <tr key={product._id}>
    //                                         <td>{product._id}</td>
    //                                         <td>{product.name}</td>
    //                                         <td>{product.price}</td>
    //                                         <td>{product.category}</td>
    //                                         <td>{product.brand}</td>
    //                                         <td>
    //                                             <button type="button" className="small"
    //                                                 onClick={() => props.history.push(`/product/${product._id}/edit`)}>Edit
    //                                         </button>
    //                                             <button type="button" className="small" onClick={() => deleteHandler(product)}>
    //                                                 Delete
    //                                         </button>
    //                                         </td>
    //                                     </tr>
    //                                 ))}
    //                             </tbody>
    //                         </table>
    //                         <div className="row center pagination">
    //                             {
    //                                 [...Array(pages).keys()].map(x => (
    //                                     <Link className={(x + 1) === page ? 'active' : ''} key={x + 1} to={sellerMode ? `/productlist/seller/pageNumber/${x + 1}` : `/productlist/pageNumber/${x + 1}`}>
    //                                         {x + 1}
    //                                     </Link>
    //                                 ))
    //                             }
    //                         </div>
    //                     </>

    //         }
    //     </div>
    // )
}
