import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Button from 'react-bootstrap/esm/Button';
import Product from '../components/product';
import Variant from '../components/variant';
import { useParams } from 'react-router-dom';

import {Collapse} from 'react-collapse';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';


const activeButton = 'mr-1 btn-primary btn-icon-text';
const secondaryButton = 'mr-1 btn-outline-secondary btn-icon-text';

function getData(products, pagenumber, appr, setData, setPages, authTokens, cat, supp, man){
    if(products){
        axios.get(ipAddress + `product-list/${pagenumber}/${appr}/${cat}/${supp}/${man}`, getJsonHeader(authTokens)).then((response) => {
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
    const {type, page, approvement, category, supplier, manufact} = useParams();
    const [pagenumber, setPage] = useState(parseInt(page, 10));
    const [products, setProducts] = useState((type & 1));
    const [appr, setAppr] = useState(parseInt(approvement));
    const [cat, setCat] = useState(category === undefined ? '_' : category);
    const [sup, setSup] = useState(supplier === undefined ? '_' : supplier);
    const [man, setMan] = useState(manufact === undefined ? '_' : manufact);

    const {authTokens} = useContext(AuthContext);

    return (
        <>
            <div className="row justify-content-md-center">
                <SideFilters
                    context={authTokens}
                    page={pagenumber}
                    type={products}
                    appr={appr}
                    cat={cat}
                    setCat={setCat}
                    sup={sup}
                    setSup={setSup}
                    man={man}
                    setMan={setMan}/>
                <Products 
                    context={authTokens}
                    pagenumber={pagenumber}
                    setPage={setPage}
                    products={products}
                    setProducts={setProducts}
                    appr={appr}
                    setAppr={setAppr}
                    category={cat}
                    supplier={sup}
                    manufact={man}/>
            </div>
        </>
    );
}

function SideFilters(props){
    const [categories, setCategories] = useState(null);
    const [suppliers, setSuppliers] = useState(null);
    const [manufacturers, setManufacturers] = useState(null);

    useEffect(() => {
        axios.get(ipAddress + 'get-filters/', getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                setCategories(response.data.categories);
                setSuppliers(response.data.suppliers);
                setManufacturers(response.data.manufacturers);
            }
        })
    }, [props.context]);

    let settingSup = async(e, val) => {
        e.preventDefault();
        // let t = val === 0 ? '_' : val;
        props.setSup(val);
        window.history.replaceState(null, null, `/productlist/${props.type}/${props.page}/${props.appr}/${props.cat}/${val}/${props.man}`);
    }

    let settingMan = async(e, val) => {
        e.preventDefault();
        // let t = val === 0 ? '_' : val;
        props.setMan(val);
        window.history.replaceState(null, null, `/productlist/${props.type}/${props.page}/${props.appr}/${props.cat}/${props.sup}/${val}`);
    }

    let resetFilter = (e) => {
        e.preventDefault();
        props.setSup('_')
        props.setMan('_')
        props.setCat('_')
        window.history.replaceState(null, null, `/productlist/${props.type}/${props.page}/${props.appr}/_/_/_`);
    }

    return(
        <div className="col-lg-2" style={{backgroundColor: 'white', borderRadius: '8px'}}>
            <div className="category-nav">
                <h3>Kategorie</h3>
                <ul>
                    {
                        categories?.map((value) => {
                            return(
                                <CategoryFilter 
                                    data={value} 
                                    key={`category_${value.id}`} 
                                    man={props.man} 
                                    sup={props.sup} 
                                    setCat={props.setCat} 
                                    page={props.page}
                                    type={props.type}
                                    approvement={props.appr}/>
                                    );
                        })
                    }
                </ul>
            </div>
            <hr/>
            <div className="filters">
                <h3>Filtrovat podle</h3>
                <div className="mb-3">
                    <label className="form-label">Dodavatele:</label>
                    
                    <select name="supplier" className="form-control" onChange={e => settingSup(e, e.target.value)}>
                        <option value='_'>Open this select menu</option>
                        {
                            suppliers?.map((value, key) => {
                                return(<option value={value.id} key={`supplier_${key}`}>{value.name}</option>)
                            })
                        }
                    </select>
                    
                </div>

                <div className="mb-3">
                    <label className="form-label">Výrobce:</label>
                    <select name="manufacturer" className="form-control" onChange={e => settingMan(e, e.target.value)}>
                        <option value='_'>Open this select menu</option>
                        {
                            manufacturers?.map((value, key) => {
                                return(<option value={value.id} key={`manufaturer_${key}`}>{value.name}</option>);
                            })
                        }
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Dostupnost:</label>
                    <select name="availability" className="form-control js-filter-select" aria-label="Default select example">
                        <option value="0">Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div className="d-flex justify-content-between">
                    <Button className="btn btn-outline-secondary" onClick={e => resetFilter(e)}>Zrušit filter</Button>
                </div>
            </div>
        </div>
    );
}

function CategoryFilter(props){
    const [openSubs, setOpenSubs] = useState(false);

    let settingCat = async(e, val) => {
        e.preventDefault();
        let t = val === 0 ? '_' : val;
        props.setCat(t);
        window.history.replaceState(null, null, `/productlist/${props.type}/${props.page}/${props.approvement}/${t}/${props.sup}/${props.man}`);
    }
    return(
        <li className="ml-3">
            {
                props.data.children.length > 0 ?
                    <a onClick={() => setOpenSubs(!openSubs)} href>
                        {
                            openSubs ? 
                                <Icon path={mdiChevronDown} size={0.9}></Icon>
                            :
                                <Icon path={mdiChevronRight} size={0.9}></Icon>
                        }
                    </a>
                :
                <Icon path={undefined} size={0.9}></Icon>
            }
            <a className='input-formated' href style={{textDecoration: 'none'}} onClick={e => settingCat(e, props.data.id)}>{props.data.name}</a>
            {
                props.data.children.length > 0 && openSubs ?
                    <Collapse isOpened={openSubs}>
                        <ul>
                            {
                                props.data.children.map((value) => {
                                    return(
                                        <CategoryFilter
                                            data={value} 
                                            key={value.id} 
                                            sup={props.sup} 
                                            man={props.man} 
                                            setCat={props.setCat}
                                            page={props.page}
                                            type={props.type}
                                            approvement={props.approvement}/>
                                        );
                                })
                            }
                        </ul>
                    </Collapse>
                :
                    <></>
            }
        </li>
    );
}

function Products(props){

    const [data, setData] = useState(null);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        getData(props.products, props.pagenumber, props.appr, setData, setPages, props.context, props.category, props.supplier, props.manufact);
        window.scrollTo(0,0)
    }, [props.context, props.products, props.pagenumber, props.appr, props.category, props.supplier, props.manufact]);

    let swap = async(e, val) => {
        e.preventDefault();
        setData(null);
        props.setProducts(val);
        props.setPage(1);
        window.history.replaceState(null, null, `/productlist/${+val}/1/${props.appr}/${props.category}/${props.supplier}/${props.manufact}`);
    }

    let goToPage = async(e, val) =>{
        e.preventDefault();
        setData(null);
        props.setPage(val);
        window.history.replaceState(null, null, `/productlist/${props.products}/${val}/${props.appr}/${props.category}/${props.supplier}/${props.manufact}`)
    }

    let goToDiffApprovement = async(e, val) =>{
        e.preventDefault();
        setData(null);
        props.setAppr(val);
        window.history.replaceState(null, null, `/productlist/${props.products}/${props.pagenumber}/${val}/${props.category}/${props.supplier}/${props.manufact}`)
    }

    let approveAll = async(e, val) => {
        e.preventDefault();
        axios.get(ipAddress + `approve-all/${val}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                setData(null);
                getData(props.products, props.pagenumber, props.appr, setData, setPages, props.context, props.category, props.supplier, props.manufact);
            }
        });
    }

    return(
        <div className="col-lg-10">
            <div className="row d-flex justify-content-between">
                <div className="col-lg-8 ">
                    <div className="btn-group md-auto mb-3" role="group" aria-label="Basic example">
                        <Button onClick={(e) => goToDiffApprovement(e, 3)} className={props.appr === 3 ? activeButton : secondaryButton}><i className="ti-layout-grid4-alt btn-icon-prepend"></i> Všechny produkty</Button>
                        <Button onClick={(e) => goToDiffApprovement(e, 1)} className={props.appr === 1 ? activeButton : secondaryButton}><i className="ti-arrow-circle-down btn-icon-prepend"></i> Schválené produkty</Button>
                        <Button onClick={(e) => goToDiffApprovement(e, 0)} className={props.appr === 0 ? activeButton : secondaryButton}><i className="ti-na btn-icon-prepend"></i> Nepovolené produkty</Button>
                        <Button onClick={(e) => approveAll(e, 1)} className='btn btn-inverse-success btn-icon'><i className="ti-arrow-circle-down"></i></Button>
                        <Button onClick={(e) => approveAll(e, 0)} className='btn btn-inverse-danger btn-icon'><i className="ti-na"></i></Button>
                        {
                            !props.products ? 
                                <Button onClick={(e) => goToDiffApprovement(e, 2)} className='btn btn-outline-secondary btn-icon-text'><i className="ti-eye btn-icon-prepend"></i> Skryté produkty</Button>
                            :
                                null
                        }
                    </div>
                </div>
                <div className="col-lg-4 d-flex justify-content-end">
                    <div className="btn-group md-auto mb-3" role="group" aria-label="Basic example">
                        <Button className={props.products ? activeButton : secondaryButton} onClick={(e) => {swap(e, true);}}><i className="ti-layout-media-left btn-icon-prepend"></i>Produkty</Button>
                        <Button className={props.products ? secondaryButton : activeButton} onClick={(e) => {swap(e, false);}}><i className="ti-layout-grid2-thumb btn-icon-prepend"></i>Varianty</Button>
                    </div>
                </div>
                    {
                        props.products ? 
                            data?.map((value) => {
                                return(<Product data={value} key={value.id} context={props.context}></Product>)
                            })
                        :
                            data?.map((value) => {
                                return(<Variant data={value} key={value.id} context={props.context}></Variant>);
                            })
                    }
            </div>
            <div className="btn-group" role="group" aria-label="Basic example">
                {
                    pages.map((value, key) => {
                        if(value === props.pagenumber){
                            return(<Button onClick={(e) => goToPage(e, value)} className='input-formated input-stronger' style={{color:'red'}} key={key}>{value}</Button>);
                        }
                        if((value >= props.pagenumber - 3 && value <= props.pagenumber + 3) || (value <= 3) || (value >= pages.length - 3)){
                            return(<Button onClick={(e) => goToPage(e, value)} key={key} className='input-formated' style={{color:'black'}}>{value}</Button>);
                        }
                        return(<div key={key}></div>);
                    })
                }
            </div>
        </div>
    );
}


export default ProductList;
