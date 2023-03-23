import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate, NavLink } from "react-router-dom"
import Button from 'react-bootstrap/esm/Button';
import ProductImages from '../components/imageslider';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ProductVariants from '../components/variantListTab';
import Descriptions from '../components/descriptionTab';
import Modal from 'react-bootstrap/Modal';
import PickingTile from '../components/categoryPickingTile';


function ProductDetail(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);
    const {id} = useParams();

    useEffect(() => {
        axios.get(ipAddress + `product-detail/${id}`, getJsonHeader(authTokens)).then((response) => {
            setData(response.data[0]);
        });
    }, [authTokens, id]);


    return (
        <>
            {
                data !== null ? 
                    <>
                        <ProductBar data={data} context={authTokens} setData={setData}></ProductBar>
                        <ProductData data={data} context={authTokens} setData={setData}></ProductData> 
                    </>
                :
                    <></>
            }
        </>
    );
}

function ProductBar(props){
    const navigate = useNavigate();
    const [approved, setApprove] = useState(props.data?.approved)

    let updateApprovement = async(e) =>{
        e.preventDefault();
        axios.get(ipAddress + `approve_product/${props.data.id}/${+approved}`, getJsonHeader(props.context)).then((response) => {
            if(response.status === 200 && response.data === 'OK'){
                setApprove(!approved);
                axios.get(ipAddress + `product-detail/${props.data.id}`, getJsonHeader(props.context)).then((response) => {
                    props.setData(response.data[0]);
                });
            }
        });
    }

    return (
        <div className="row mb-3 ">
            <div className="col-lg-12 d-flex justify-content-between">
                <div>
                    <Button onClick={() => navigate(-1)} className="btn btn-primary btn-icon-text"><i className="ti-arrow-left btn-icon-prepend"></i>Zpět</Button>
                    <NavLink to={'/productlist/1/1/3/_/_/_/_'}>
                        <button type="button" className="btn btn-outline-primary btn-icon-text">
                            Seznam produktů
                        </button>
                    </NavLink>
                </div>
                <div>
                    {
                        approved ? 
                            <Button className="btn btn-inverse-success btn-icon" onClick={(e) => updateApprovement(e)}><i className="ti-arrow-circle-down"></i></Button>
                        :
                            <Button className="btn btn-inverse-danger btn-icon" onClick={(e) => updateApprovement(e)}><i className="ti-na"></i></Button>
                    }
                    <button type="button" className="btn btn-primary btn-icon-text">
                        <i className="ti-pencil btn-icon-prepend"></i>
                        Upravit produkt
                    </button>
                    <div className="btn-group">
                        <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Možnosti</button>
                        <div className="dropdown-menu" >
                            <a className="dropdown-item" href="generate_output_product/{{common.id}}/">Vygenerovat data</a>
                            <a className="dropdown-item" href>Zobrazit u dodavatele</a>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    );
}

export default ProductDetail;

function ProductData(props){
    const images = props.data.variants?.map((value) => {return {url: value.image_ref.image}});
    return (
        <div className="row grid-margin grid-margin-md-0 stretch-card mb-4">
            <ProductImages data={images}></ProductImages>

            <div className="col-lg-6">
                <div className="card mb-4" style={{background:'transparent'}}>
                    <div className="card-body" >
                        <div className="d-flex">
                            <p className="text-center mr-3" style={{display:'block', background:'lightgray', padding: '2px', borderRadius: '8px'}}
                                ref={el => {if(el) {el.style.setProperty('width', '200px', 'important');}}}>
                                {props.data.supplier.name}
                            </p>
                            <p className="text-center" style={{display:'block', border:'1px solid black', padding: '2px', borderRadius: '8px'}} ref={el => {if(el) {el.style.setProperty('width', '200px', 'important');}}}>Produkt</p>
                        </div>
                        <br/>
                        <h2>
                            {props.data.name}
                        </h2>
                        <p className="lead">Výrobce: <strong>
                            {props.data.manufacturer.name}
                            </strong>
                        </p>
                        <hr/>
                        <p>
                            {props.data.short_description}
                            <a href>Zobrazit více...</a>
                        </p>    
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card bg-primary">
                            <div className="card-body">
                                <h2 style={{color:'white'}}>
                                    {props.data.price_common.price} {props.data.price_common.currency}
                                </h2>
                                <p style={{color:'white'}} className="lead">Nákupní cena: 
                                {props.data.price_common.pur_price} {props.data.price_common.currency}
                                </p>
                                <p style={{color:'white'}}>Zisk: 
                                    {props.data.price_common.profit} {props.data.price_common.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Kódové označení</h4>
                                <div className="media">
                                    <i className="mdi mdi-barcode icon-lg  text-info d-flex align-self-start mr-3"></i>
                                    <div className="media-body">
                                        <p className="card-text">Kód produktu: <strong>
                                            {props.data.price_common.code}
                                            </strong>
                                        </p>
                                        <p className="card-text">EAN: <strong>
                                            {props.data.price_common.ean}
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Sklad</h4>
                                <div className="media">
                                    <i className="mdi mdi-package-variant-closed icon-lg text-info d-flex align-self-start mr-3"></i>
                                    <div className="media-body">
                                        <p className="card-text">Skladová dostupnost: <strong>Skladem</strong></p>
                                        <p className="card-text">Počet kusů: <strong>
                                            {props.data.price_common.amount}
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card" style={{boxShadow: '10px 10px 71px 0px rgba(0,0,0,0.09)'}}>
                            <div className="card-body">
                                <h4 className="card-title">Aktualizační informace</h4>
                                <div className="media">
                                    <i className="mdi mdi-cloud-sync-outline icon-lg  text-info d-flex align-self-start mr-3"></i>
                                    <div className="media-body">
                                        <p className="card-text">Součást feedu: <strong>
                                            {props.data.approved ? <>Ano</> : <>Ne</>}
                                        </strong></p>
                                        <p className="card-text">Aktualizováno: <strong>
                                            {/* {{common.supplier.updated_on|date:"j.n.Y / G:i"}} */}
                                            </strong>
                                        </p>
                                        <button type="button" data-toggle="modal" data-target="#aktualizace" className="btn btn-warning btn-icon" style={{position: 'absolute',right:'-20px',top: '46px'}}>
                                            <i className="ti-reload"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-12 mt-4">
                <ProductDetailTabs data={props.data} context={props.context} setData={props.setData}></ProductDetailTabs>
            </div>
        </div>

    );
}

function ProductDetailTabs(props){
    const [tabKey, setTabKey] = useState('variants');
    return (
        <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e)}>
            <Tab eventKey={'variants'} title={`Varianty ${props.data.variants.length}`}>
                <ProductVariants data={props.data.variants} context={props.context} id={props.data.id} setData={props.setData} product={true}></ProductVariants>
            </Tab>
            <Tab eventKey={'desc'} title={'Detailní a krátký popis'}>
                <Descriptions data={props.data}></Descriptions>
            </Tab>
            <Tab eventKey={'params'} title={'Parametry'}>
                <div className="card-body">
                    <h3>Parametry</h3>
                        <br/>
                    <table className="table">
                        <tbody>
                            {
                                props.data.price_common.params.map((value, key) => {
                                    return (<tr key={key}><td><strong>{value.param.name.name}</strong></td><td>{value.param.value.value}</td></tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </Tab>
            <Tab eventKey={'category'} title={'Kategorie'}>
                <Categories 
                    data={props.data.childless_cat} 
                    source={props.data.supplier.id} 
                    id={props.data.id} 
                    context={props.context}
                    setData={props.setData}></Categories>
            </Tab>
        </Tabs>
    );
}

function Categories(props){

    let removeCat = async(e, cat) => {
        e.preventDefault();
        axios.get(ipAddress + `remove-cat/${props.id}/${cat}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                axios.get(ipAddress + `product-detail/${props.id}`, getJsonHeader(props.context)).then((response) => {
                    props.setData(response.data[0]);
                });
            }
        });
    }

    return (
        <div className="row">
            <div className="col-lg-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <h3>Eshopové kategorie</h3>
                        <br/>
                        <AddToCat context={props.context} target={props.id} setData={props.setData}></AddToCat>
                        <table className="table">
                            <tbody>
                                {
                                    props.data.length === 0 ? 
                                        <tr><td><p>No cats</p></td></tr>
                                    :
                                    props.data?.map((value) => {
                                        if(value.source !== props.source){
                                            return(
                                                <tr key={`ecats_${value.id}`}>
                                                    <td><Button onClick={(e) => removeCat(e, value.id)} className='btn btn-danger'>Remove</Button></td>
                                                    <td><CategoryPath data={value}></CategoryPath></td>
                                                </tr>
                                            );
                                        }
                                        return(null);
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="col-lg-12">
                <div className="card" >
                    <div className="card-body">
                        <h3>Dodavatelské kategorie</h3>
                        <br/>
                        <table className="table">
                            <tbody>
                            {
                                props.data.length === 0 ? 
                                    <tr><td><p>No cats</p></td></tr>
                                :
                                props.data?.map((value) => {
                                    if(value.source === props.source){
                                        return(<tr key={`scats_${value.id}`}><td><p><CategoryPath data={value}></CategoryPath></p></td></tr>);
                                    }
                                    return(null);
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CategoryPath(props){
    return(
        <>
            {props.data.name}
            {
                props.data.getParent !== null ? 
                    <> =&gt; <CategoryPath data={props.data.getParent}></CategoryPath></>
                :
                    null
            }
        </>
    );
}

function AddToCat(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [target, setTarget] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if(show){
            axios.get(ipAddress + `categories/`, getJsonHeader(props.context)).then((response) => {
                setData(response.data[0]);
            });
        }
    },[props.context, show]);

    let addCatTo = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + `add-cat/${props.target}/${target}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                handleClose();
                axios.get(ipAddress + `product-detail/${props.target}`, getJsonHeader(props.context)).then((response) => {
                    props.setData(response.data[0]);
                });
            }
        })
    }

    return(
        <>
            <Button onClick={handleShow} className='btn btn-success'>Přidat kategorii</Button>
            <Modal show={show} onHide={handleClose} className='fade'>
                <Modal.Header>
                    <h5 className="modal-title" id="exampleModalLabel">Pridat do kategorie: </h5>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        {
                            data !== null ?
                                <PickingTile 
                                    data={data} 
                                    setTarget={setTarget} 
                                    target={target} 
                                    context={props.context}></PickingTile>
                            :
                                <p>Loading categories</p>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-secondary' onClick={handleClose}>Zrušit</Button>
                    <Button className='btn btn-primary' onClick={(e) => addCatTo(e)}>Pridat</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}