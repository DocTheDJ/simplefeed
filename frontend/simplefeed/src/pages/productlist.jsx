import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Button from 'react-bootstrap/esm/Button';
import Product from '../components/product';
import Variant from '../components/variant';
import { useParams } from 'react-router-dom';

const activeButton = 'mr-1 btn-primary btn-icon-text';
const secondaryButton = 'mr-1 btn-outline-secondary btn-icon-text';

function getData(products, pagenumber, appr, setData, setPages, authTokens){
    if(products){
        axios.get(ipAddress + `product-list/${pagenumber}/${appr}`, getJsonHeader(authTokens)).then((response) => {
            setData(response.data.data);
            setPages(response.data.count);
        });
    }else{
        axios.get(ipAddress + `variant-list/${pagenumber}/${appr}`, getJsonHeader(authTokens)).then((response) => {
            setData(response.data.data);
            setPages(response.data.count);
        });
    }
}

function ProductList(){
    const {type, page, approvement} = useParams()
    const [data, setData] = useState(null);
    const [pagenumber, setPage] = useState(parseInt(page, 10));
    const [pages, setPages] = useState([]);
    const [products, setProducts] = useState((type & 1));
    const [appr, setAppr] = useState(parseInt(approvement))

    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        getData(products, pagenumber, appr, setData, setPages, authTokens);
        window.scrollTo(0,0)
    }, [authTokens, products, pagenumber, appr]);

    let swap = async(e, val) => {
        e.preventDefault();
        setData(null);
        setProducts(val);
        setPage(1);
        window.history.replaceState(null, null, `/productlist/${+val}/1/${appr}`);
    }

    let goToPage = async(e, val) =>{
        e.preventDefault();
        setData(null);
        setPage(val);
        window.history.replaceState(null, null, `/productlist/${type}/${val}/${appr}`)
    }

    let goToDiffApprovement = async(e, val) =>{
        e.preventDefault();
        setData(null);
        setAppr(val);
        window.history.replaceState(null, null, `/productlist/${type}/${pagenumber}/${val}`)
    }

    let approveAll = async(e, val) => {
        e.preventDefault();
        axios.get(ipAddress + `approve-all/${val}`, getJsonHeader(authTokens)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                setData(null);
                getData(products, pagenumber, appr, setData, setPages, authTokens);
            }
        });
    }

    return (
        <>
            <div className="row justify-content-md-center ">
                <div className="col-lg-10">
                    <div className="row d-flex justify-content-between">
                        <div className="col-lg-8 ">
                            <div className="btn-group md-auto mb-3" role="group" aria-label="Basic example">
                                <Button onClick={(e) => goToDiffApprovement(e, 3)} className={appr === 3 ? activeButton : secondaryButton}><i className="ti-layout-grid4-alt btn-icon-prepend"></i> Všechny produkty</Button>
                                <Button onClick={(e) => goToDiffApprovement(e, 1)} className={appr === 1 ? activeButton : secondaryButton}><i className="ti-arrow-circle-down btn-icon-prepend"></i> Schválené produkty</Button>
                                <Button onClick={(e) => goToDiffApprovement(e, 0)} className={appr === 0 ? activeButton : secondaryButton}><i className="ti-na btn-icon-prepend"></i> Nepovolené produkty</Button>
                                <Button onClick={(e) => approveAll(e, 1)} className='btn btn-inverse-success btn-icon'><i className="ti-arrow-circle-down"></i></Button>
                                <Button onClick={(e) => approveAll(e, 0)} className='btn btn-inverse-danger btn-icon'><i className="ti-na"></i></Button>
                                {
                                    !products ? 
                                        <Button onClick={(e) => goToDiffApprovement(e, 2)} className='btn btn-outline-secondary btn-icon-text'><i className="ti-eye btn-icon-prepend"></i> Skryté produkty</Button>
                                    :
                                        null
                                }
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex justify-content-end">
                            <div className="btn-group md-auto mb-3" role="group" aria-label="Basic example">
                                <Button className={products ? activeButton : secondaryButton} onClick={(e) => {swap(e, true);}}><i className="ti-layout-media-left btn-icon-prepend"></i>Produkty</Button>
                                <Button className={products ? secondaryButton : activeButton} onClick={(e) => {swap(e, false);}}><i className="ti-layout-grid2-thumb btn-icon-prepend"></i>Varianty</Button>
                            </div>
                        </div>
                            {
                                products ? 
                                    data?.map((value) => {
                                        return(<Product data={value} key={value.id} context={authTokens}></Product>)
                                    })
                                :
                                    data?.map((value) => {
                                        return(<Variant data={value} key={value.id} context={authTokens}></Variant>);
                                    })
                            }
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {
                            pages.map((value, key) => {
                                if(value === pagenumber){
                                    return(<Button onClick={(e) => goToPage(e, value)} className='input-formated input-stronger' style={{color:'red'}} key={key}>{value}</Button>);
                                }
                                if((value >= pagenumber - 3 && value <= pagenumber + 3) || (value <= 3) || (value >= pages.length - 3)){
                                    return(<Button onClick={(e) => goToPage(e, value)} key={key} className='input-formated' style={{color:'black'}}>{value}</Button>);
                                }
                                return(<div key={key}></div>);
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}


export default ProductList;
