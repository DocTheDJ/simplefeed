import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Descriptions from '../components/descriptionTab';
import ProductVariants from '../components/variantListTab';
import ModificationVariantModal from '../components/modificationVariantModal';


function VariantDetail(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);
    const {id} = useParams();

    useEffect(() => {
        axios.get(ipAddress + `variant-detail/${id}`, getJsonHeader(authTokens)).then((response) => {
            setData(response.data[0]);
        });
    }, [authTokens, id]);

    return (
        <>
            {
                data !== null ?
                    <>
                        <VariantBar data={data} context={authTokens} key={data.id}></VariantBar>
                        <VariantData data={data} context={authTokens} setData={setData}></VariantData>
                    </>
                :
                    <></>
            }
        </>
    );
}
export default VariantDetail;

function VariantBar(props){
    const navigate = useNavigate();
    const [approved, setApprove] = useState(props.data?.visible);

    let updateVisibility = async(e) => {
        e.preventDefault();
        const future = ((approved + 1) % 3);
        axios.get(ipAddress + `set-visibility/${props.data.id}/${future}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                setApprove(`${future}`);
            }
        })
    }

    return (
        <div className="row mb-3 ">
            <div className="col-lg-12 d-flex justify-content-between">
                <div>
                    <Button onClick={() => navigate(-1)} className='btn btn-primary btn-icon-text'>
                        <i className="ti-arrow-left btn-icon-prepend"></i>
                        Zpět
                    </Button>
                    <NavLink to={'/productlist'}>
                        <button type="button" className="btn btn-outline-primary btn-icon-text">
                            Seznam produktů
                        </button>
                    </NavLink>
                </div>
                <div>
                        {
                            approved === '1' ? 
                                <Button className='btn btn-inverse-success btn-icon' onClick={(e)=>updateVisibility(e)}><i className="ti-arrow-circle-down"></i></Button>
                            : approved === '0' ?
                                    <Button className='btn btn-inverse-danger btn-icon' onClick={(e)=>updateVisibility(e)}><i className="ti-na"></i></Button>
                                :
                                    <Button className='btn btn-info btn-icon' onClick={(e)=>updateVisibility(e)}><i className="ti-na"></i></Button>
                        }
                    <ModificationVariantModal 
                        data={props.data} 
                        context={props.context} 
                        Child={() => <><i className="ti-pencil btn-icon-prepend"></i>Upravit variantu</>}
                        buttonStyle={'btn btn-primary btn-icon-text'}>
                    </ModificationVariantModal>
                    <NavLink to={`/productdetail/${props.data.productID}`}>
                        <button type="button" className="btn btn-info btn-icon-text">
                            <i className="ti-zoom-out btn-icon-prepend"></i>
                            Přejít na produkt
                        </button>
                    </NavLink>
                    <div className="btn-group">
                        <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Možnosti</button>
                        <div className="dropdown-menu" >
                            <a className="dropdown-item" href>Vygenerovat data</a>
                            <a className="dropdown-item" href>Zobrazit u dodavatele</a>
                        </div>                          
                    </div>
                </div>
            </div>
        </div>
    );
}

function VariantData(props){
    return (
        <div className="row grid-margin grid-margin-md-0 stretch-card mb-4">
            <div className="col-lg-6">
                <div className="card">
                    <div className="card-body">
                    <div className="slider-for">
                        <figure className="figure">
                        <img style={{maxWidth: '400px', height: '500px'}} className="mx-auto" src={props.data.image_ref.image} alt=''/>
                        </figure>
                    </div>
                    </div>
                </div>  
            </div>

            <div className="col-lg-6">
                <div className="card mb-4" style={{background:'transparent'}}>
                    <div className="card-body" >
                        <div className="d-flex">
                        <p className="text-center mr-3" style={{display:'block', background:'lightgray', padding: '2px', borderRadius: '8px'}}
                            ref={el => {if(el) {el.style.setProperty('width', '200px', 'important');}}}>
                            {props.data.get_supplier}
                        </p>
                        {
                            props.data.decide_main ? 
                                <p className="text-center" style={{display:'block', border:'1px solid black', padding: '2px', borderRadius: '8px'}} ref={el => {if(el) {el.style.setProperty('width', '200px', 'important');}}}>Hlavní varianta</p>
                            :
                                <p className="text-center" style={{display:'block', border:'1px solid black', padding: '2px', borderRadius: '8px'}} ref={el => {if(el) {el.style.setProperty('width', '200px', 'important');}}}>Varianta</p>
                        }
                        </div>
                        <br/>
                        <h2>
                            {props.data.name}
                        </h2>
                        <p className="lead">Výrobce: <strong>
                            {props.data.manufacturer}
                            </strong></p>
                        <hr/>
                        <p>
                            {props.data.product[0].short_description}
                            <a href>Zobrazit více...</a>
                        </p>    
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card bg-primary">
                            <div className="card-body">
                                <h2 style={{color:'white'}}>
                                    {props.data.price} {props.data.currency}
                                </h2>
                                <p style={{color:'white'}} className="lead">Nákupní cena: 
                                    {props.data.pur_price} {props.data.currency}
                                    </p>
                                <p style={{color:'white'}}>Zisk: 
                                    {props.data.profit} {props.data.currency}
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
                                    {props.data.code}
                                    </strong></p>
                                <p className="card-text">EAN: <strong>
                                    {props.data.ean}
                                    </strong></p>
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
                                            {props.data.amount}
                                            </strong></p>
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
                                            {props.data.visible ? <>Ano</> : <>Ne</>}
                                        </strong></p>
                                        <p className="card-text">Aktualizováno: <strong>
                                            {/* {{updated_on|date:"j.n.Y / G:i"}} */}
                                            </strong></p>
                                        <button type="button" data-toggle="modal" data-target="#aktualizace" className="btn btn-warning btn-icon" style={{
                                            position: 'absolute',
                                            right:'-20px',
                                            top: '46px'
                                        }}>
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
                <VariantDetailTabs data={props.data} setData={props.setData} context={props.context}></VariantDetailTabs>
            </div>
        </div>

    );
}

function VariantDetailTabs(props){
    const [tabKey, setTabKey] = useState('variants');
    return (
        <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e)}>
            <Tab eventKey={'variants'} title={`Varianty ${props.data.variants.length}`}>
                <ProductVariants data={props.data.variants} context={props.context} id={props.data.product[0].id} setData={props.setData} product={false}></ProductVariants>
            </Tab>
            <Tab eventKey={'desc'} title={'Detailní a krátký popis'}>
                <Descriptions data={props.data.product[0]}></Descriptions>
            </Tab>
            <Tab eventKey={'params'} title={'Parametry'}>
                <div className="card-body">
                    <h3>Parametry</h3>
                        <br/>
                    <table className="table">
                        <tbody>
                            {
                                props.data.params.map((value, key) => {
                                    return (<tr key={key}><td><strong>{value.param.name.name}</strong></td><td>{value.param.value.value}</td></tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </Tab>
        </Tabs>
    );
}