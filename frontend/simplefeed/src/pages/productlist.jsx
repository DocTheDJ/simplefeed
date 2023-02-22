import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Button from 'react-bootstrap/esm/Button';
import Product from '../components/product';

function ProductList(){
    const [data, setData] = useState(null);
    const [pagenumber, setPage] = useState(1);
    const [pages, setPages] = useState([]);

    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + `product-list/${pagenumber}`, getJsonHeader(authTokens)).then((response) => {
            setData(response.data.data);
            setPages(response.data.count);
        });
    }, [authTokens, pagenumber]);
    console.log(data);

    return (
        <>
            <div className="row justify-content-md-center ">
                <div className="col-lg-10">
                    <div className="row d-flex justify-content-between">
                        <div className="col-lg-8 ">
                            <div className="btn-group md-auto mb-3" role="group" aria-label="Basic example">
                        
                            {/* <a href="/products_list/?approved=all&page=1"><button type="button" className="btn mr-1
                            {% if request.GET.approved == "true" %}
                            btn-outline-secondary
                            {% elif request.GET.approved == "false" %}
                            btn-outline-secondary
                            {% else %}
                            btn-primary
                            {% endif %} 

                            btn-icon-text"><i className="ti-layout-grid4-alt btn-icon-prepend"></i> Všechny produkty</button></a>
                            <a href="?approved=true&page=1"><button type="button" className="btn mr-1

                            {% if request.GET.approved == "true" %}
                            btn btn-primary
                            {% else %}
                            btn-outline-secondary
                            {% endif %} 

                            btn-icon-text"><i className="ti-arrow-circle-down btn-icon-prepend"></i>Schválené produkty</button></a>
                            <a href="?approved=false&page=1"><button type="button" className="btn mr-1
                            
                            {% if request.GET.approved == "false" %}
                            btn btn-primary
                            {% else %}
                            btn-outline-secondary
                            {% endif %} 

                            btn-icon-text"><i className="ti-na btn-icon-prepend"></i>Nepovolené produkty</button></a>
                            
                            <form id="checking-form" method="POST">
                            {% csrf_token %}
                            <button type="submit" className="btn btn-inverse-success btn-icon" formaction="multiple_action/approve_pro/1">
                                <i className="ti-arrow-circle-down"></i>
                            </button>
                            <button type="submit" className="btn btn-inverse-danger btn-icon" formaction="multiple_action/approve_pro/0">
                                <i className="ti-na"></i>
                            </button>
                            </form>
                            
                            {% comment %} <button type="button" className="btn btn-outline-secondary btn-icon-text"><i className="ti-eye btn-icon-prepend"></i>Skryté produkty</button> {% endcomment %} */}
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex justify-content-end">
                            <div className="btn-group md-auto mb-3" role="group" aria-label="Basic example">
                                <a href="/products_list/?approved=all&page=1"><button type="button" className="mr-1 btn btn-primary btn-icon-text"><i className="ti-layout-media-left btn-icon-prepend"></i>Produkty</button></a>
                                <a href="/variants_list/?visible=all&page=1"><button type="button" className="btn btn-outline-secondary btn-icon-text"><i className="ti-layout-grid2-thumb btn-icon-prepend"></i>Varianty</button></a>
                            </div>
                        </div>
                            {
                                data?.map((value) => {
                                    return(<Product data={value} key={value.id} context={authTokens}></Product>)
                                })
                            }
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {
                            pages.map((value, key) => {
                                if(value === pagenumber){
                                    return(<Button onClick={() => setPage(value)} className='input-formated input-stronger' style={{color:'red'}} key={key}>{value}</Button>);
                                }
                                return(<Button onClick={() => setPage(value)} key={key} className='input-formated' style={{color:'black'}}>{value}</Button>);
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}


export default ProductList;
