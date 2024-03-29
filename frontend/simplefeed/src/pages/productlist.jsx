import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Button from 'react-bootstrap/esm/Button';
import {Product, ProductRow} from '../components/product';
import {Variant, VariantRow} from '../components/variant';

import {Collapse} from 'react-collapse';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';

import { useLocalStorage } from "../components/localstorage";


const activeButton = 'mr-1 btn-primary btn-icon-text';
const secondaryButton = 'mr-1 btn-outline-secondary btn-icon-text';

function getData(products, pagenumber, appr, setData, setPages, authTokens, cat, supp, man, query, setIdsList){
    let link = products ? 'product-list' : 'variant-list';
    axios.get(ipAddress + `${link}/${pagenumber}/${appr}/${cat}/${supp}/${man}/${query}`, getJsonHeader(authTokens)).then((response) => {
        setData(response.data.data);
        setPages(response.data.count);
        setIdsList(response.data.ids);
    });
}

function ProductList(){
    const [pagenumber, setPage] = useLocalStorage('page', 1);
    const [products, setProducts] = useLocalStorage('type', true);
    const [appr, setAppr] = useLocalStorage('approvement', 3);
    const [cat, setCat] = useLocalStorage('category', '_');
    const [sup, setSup] = useLocalStorage('supplier', '_');
    const [man, setMan] = useLocalStorage('manufacturer', '_');
    const [que, setQue] = useLocalStorage('query', '_');

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
                    setMan={setMan}
                    query={que}
                    setQue={setQue}/>
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
                    manufact={man}
                    query={que}/>
            </div>
        </>
    );
}

function Reload(){
    window.history.replaceState(null, null, '/productlist');
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
        props.setSup(val);
        Reload();
    }

    let settingMan = async(e, val) => {
        e.preventDefault();
        props.setMan(val);
        Reload();
    }

    let settingCat = async(e, val) => {
        e.preventDefault();
        let t = val === 0 ? '_' : val;
        props.setCat(t);
        Reload();
    }


    let resetFilter = (e) => {
        e.preventDefault();
        props.setSup('_')
        props.setMan('_')
        props.setCat('_')
        props.setQue('_')
        Reload();
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
                                    settingCat={settingCat} 
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
            <a className='input-formated' href style={{textDecoration: 'none'}} onClick={e => props.settingCat(e, props.data.id)}>{props.data.name}</a>
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
                                            settingCat={props.settingCat}
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
    const [idsList, setIdsList] = useState(null);
    const [checkedList, setCheckedList] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [view, setView] = useState(true);

    useEffect(() => {
        getData(props.products, props.pagenumber, props.appr, setData, setPages, props.context, props.category, props.supplier, props.manufact, props.query, setIdsList);
        window.scrollTo(0,0)
    }, [props.context, props.products, props.pagenumber, props.appr, props.category, props.supplier, props.manufact, props.query]);

    let swap = async(e, val) => {
        e.preventDefault();
        setData(null);
        props.setProducts(val);
        props.setPage(1);
        Reload();
    }

    let goToPage = async(e, val) =>{
        e.preventDefault();
        setData(null);
        props.setPage(val);
        props.setTmp(val)
        Reload();
    }

    let goToDiffApprovement = async(e, val) =>{
        e.preventDefault();
        setData(null);
        props.setAppr(val);
        Reload();
    }

    let handleCheckAll = async(e) => {
        setCheckedAll(!checkedAll);
        if(!checkedAll){
            setCheckedList(idsList);
        }else{
            setCheckedList([]);
        }
    }

    let approveAll = async(e, val) => {
        e.preventDefault();
        let link = props.products === 1 ? 'approve-all' : 'update-mul-vis';
        axios.post(ipAddress + `${link}/${val}`, {'ids': checkedList}, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.data !== 'OK'){
                alert('Something fucked up');
            }else{
                setData(null);
                getData(props.products, props.pagenumber, props.appr, setData, setPages, props.context, props.category, props.supplier, props.manufact, props.query, setIdsList);
                setCheckedAll(false);
                setCheckedList([]);
            }
        });
    }

    return(
        <div className="col-lg-10">
            <div className="row d-flex justify-content-between">
                <div className="col-lg-8 ">
                    <div className="btn-group md-auto mb-3" role="group" aria-label="Basic example">
                        <Button onClick={(e) => setView(!view)}>{view ? <>List</> : <>Table</>}</Button>
                        <Button onClick={(e) => goToDiffApprovement(e, 3)} className={props.appr === 3 ? activeButton : secondaryButton}><i className="ti-layout-grid4-alt btn-icon-prepend"></i> Všechny produkty</Button>
                        <Button onClick={(e) => goToDiffApprovement(e, 1)} className={props.appr === 1 ? activeButton : secondaryButton}><i className="ti-arrow-circle-down btn-icon-prepend"></i> Schválené produkty</Button>
                        <Button onClick={(e) => goToDiffApprovement(e, 0)} className={props.appr === 0 ? activeButton : secondaryButton}><i className="ti-na btn-icon-prepend"></i> Nepovolené produkty</Button>
                        <input className="form-check-input form-control-lg" type="checkbox" checked={checkedAll} onChange={handleCheckAll}></input>
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
                        <Button className={props.products ? activeButton : secondaryButton} onClick={(e) => {swap(e, 1);}}><i className="ti-layout-media-left btn-icon-prepend"></i>Produkty</Button>
                        <Button className={props.products ? secondaryButton : activeButton} onClick={(e) => {swap(e, 0);}}><i className="ti-layout-grid2-thumb btn-icon-prepend"></i>Varianty</Button>
                    </div>
                </div>
                {
                    view ? 
                        props.products ? 
                            data?.map((value) => {
                                return(
                                    <Product 
                                        data={value} 
                                        key={value.id} 
                                        context={props.context}
                                        checkedList={checkedList}
                                        setCheckedList={setCheckedList}></Product>);
                            })
                        :
                            data?.map((value) => {
                                return(
                                    <Variant 
                                        data={value} 
                                        key={value.id} 
                                        context={props.context}
                                        checkedList={checkedList}
                                        setCheckedList={setCheckedList}></Variant>);
                            })
                    :
                        <table>
                            {
                                props.products ? 
                                    <>
                                        <thead>
                                            <th>Id</th>
                                            <th>Group id</th>
                                            <th>Name</th>
                                            <th>Variants</th>
                                        </thead>
                                        <tbody>
                                            {
                                                data?.map((value) => {
                                                    return(<ProductRow data={value}></ProductRow>);
                                                })
                                            }
                                        </tbody>
                                    </>
                                :
                                    <>
                                        <thead>
                                            <th>Id</th>
                                            <th>Code</th>
                                            <th>Name</th>
                                            <th>EAN</th>
                                            <th>Price</th>
                                            <th>Purchase price</th>
                                            <th>Manufacturer</th>
                                        </thead>
                                        <tbody>
                                            {
                                                data?.map((value) => {
                                                    return(<VariantRow data={value}></VariantRow>)
                                                })
                                            }
                                        </tbody>
                                    </>
                            }
                        </table>
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
                        return(<></>);
                    })
                }
            </div>
        </div>
    );
}


export default ProductList;
