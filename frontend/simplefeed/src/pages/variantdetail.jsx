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
                    <button type="button" className="btn btn-primary btn-icon-text">
                        <i className="ti-pencil btn-icon-prepend"></i>
                        Upravit variantu
                    </button>
                    <NavLink to={`/productdetail/${props.data.productID}`}>
                        <button type="button" className="btn btn-info btn-icon-text">
                            <i className="ti-zoom-out btn-icon-prepend"></i>
                            Přejít na produkt
                        </button>
                    </NavLink>
                    <div className="btn-group">
                        <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Možnosti</button>
                        <div className="dropdown-menu" >
                            <a className="dropdown-item">Vygenerovat data</a>
                            <a className="dropdown-item">Zobrazit u dodavatele</a>
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
                        <img style={{maxWidth: '400px', height: '500px'}} className="mx-auto" src={props.data.image_ref.image}/>
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
                            {/* {{other.supplier.name}} */}
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
                            {/* {{variant.name}} */}
                        </h2>
                        <p className="lead">Výrobce: <strong>
                            {props.data.manufacturer}
                            {/* {{other.get_manufacturer}} */}
                            </strong></p>
                        <hr/>
                        <p>
                            {props.data.product[0].short_description}
                            {/* {{other.short_description}} */}
                            <a  href="">Zobrazit více...</a>
                        </p>    
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card bg-primary">
                        <div className="card-body">
                            <h2 style={{color:'white'}}>
                                {props.data.price} {props.data.currency}
                                {/* {{variant.price}} {{variant.currency}} */}
                            </h2>
                            <p style={{color:'white'}} className="lead">Nákupní cena: 
                                {props.data.pur_price} {props.data.currency}
                                {/* {{variant.pur_price}} {{variant.currency}} */}
                                </p>
                            <p style={{color:'white'}}>Zisk: 
                                {props.data.profit} {props.data.currency}
                                {/* {{variant.profit}} {{variant.currency}} */}
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
                                    {/* {{variant.code}} */}
                                    </strong></p>
                                <p className="card-text">EAN: <strong>
                                    {props.data.ean}
                                    {/* {{variant.ean}} */}
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
                                    {/* {{variant.amount}} */}
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
                                {/* {% if variant.visible %}Ano{% else%}Ne{% endif%} */}
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


{/* <div className="col-lg-12 mt-4">
    <div className="nav nav-tabs d-flex justify-content-center" id="myTab" role="tablist" style="border-bottom:0px;">
    <button className="nav-link active" id="variant-tab" data-bs-toggle="tab" data-bs-target="#variant-tab-pane" type="button" role="tab" aria-controls="variant-tab-pane" aria-selected="true">Varianty <strong>{{other.count}}</strong></button>
        <button className="nav-link " id="text-tab" data-bs-toggle="tab" data-bs-target="#text-tab-pane" type="button" role="tab" aria-controls="text-tab-pane" aria-selected="false" style="border-radius: 8px 0px 0px 8px;">Detailní a krátký popis</button>
        <button className="nav-link" id="parametrs-tab" data-bs-toggle="tab" data-bs-target="#parametrs-tab-pane" type="button" role="tab" aria-controls="parametrs-tab-pane" aria-selected="false">Parametry</button>

    </div>

    <div className="tab-content" style="border: 0px !important;" id="myTabContent">
            <div className="card tab-pane fade  show active" id="variant-tab-pane" role="tabpanel" aria-labelledby="variant-tab" tabindex="0">
                <div className="card-body">
                    <h3>Varianty produktu</h3>
                    <br>
                    <table className="table">
                    {% for x in other.get_variants %} 
                        <tr>
                            <td><img src="{{x.image_ref.image}}" style="width: 100px; height: 100px;"></td>
                            <td>
                            {% if x.get_useable_count > 0%}
                                {% for p in x.get_useable %}
                                <p><strong>{{p.name.name}}:</strong> {{p.value.value}}</p>
                                {% endfor %}
                            {% else %}
                                {% for p in x.get_params %}
                                <p><strong>{{p.name.name}}:</strong> {{p.value.value}}</p>
                                {% endfor %}
                            {% endif %}
                            </td>
                            <td>
                            {% if x.decide_main %} 
                            <p className="text-center" style="display:block; width:200px !important; border:1px solid black; padding: 2px; border-radius: 8px;">Hlavní varianta</p>
                            {% endif %} 
                            <strong>Kód:</strong>{{x.code}}
                            </td>
                            <td><strong>Skladem</strong><br>{{x.amount}} Ks</td>
                            <td>{{x.price}} {{x.currency}}</td>
                            <td>
                                <button type="button" className="btn btn-warning btn-rounded btn-icon" data-bs-toggle="modal" data-bs-target="#variant_edit{{x.id}}">
                                    <i className="ti-pencil"></i>
                                </button>
                                <a href="/var_detail/{{x.id}}"><button type="button" className="btn btn-info btn-rounded btn-icon">
                                <i className="ti-eye"></i>
                                </button></a>
                                <a href="/set_main/{{x.id}}"><button type="button" className="btn btn-primary btn-rounded btn-icon">
                                <i className="ti-star"></i>
                                </button></a>
                                {% if x.visible == "1" %}
                                <a href="approve_var/{{x.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                                    <i className="ti-arrow-circle-down"></i>
                                </button></a>
                                {% elif x.visible == "0" %}
                                <a href="approve_var/{{x.id}}/0"><button type="button" className="btn btn-inverse-danger btn-icon">
                                    <i className="ti-na"></i>
                                </button></a>
                                {% else %}
                                <a href="approve_var/{{x.id}}/0"><button type="button" className="btn btn-info btn-icon">
                                    <i className="ti-na"></i>
                                </button></a>
                                {% endif %}
                            </td>
                        </tr>

                        <div className="modal fade" id="variant_edit{{x.id}}" tabindex="-1" aria-labelledby="variant_edit{{x.id}}Label" aria-hidden="true">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                            <form method="POST" action="update_var/{{x.id}}">
                            {% csrf_token %}
                                <div className="modal-header">
                                <h5 className="modal-title" id="variant_edit{{x.id}}Label">Upravit variantu:  {{x.code}}</h5>
                                <div>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zrušit</button>
                                    <input type="submit" className="btn btn-primary" value="Upravit variantu">
                                </div>
                                </div>
                                <div className="modal-body">
                                <h3>Ceník:</h3>
                                <br>
                                <div className="row">
                                    <div className="col-6">
                                    <label className="form-label">Prodejní cena (s DPH)</label>
                                    <input type="number" step=".01" className="form-control" value="{{x.price}}" name="price_input">
                                    <p style="padding-top:10px"><strong>Cena bez DPH:</strong> 1568 Kč</p>
                                    </div>
                                
                                    <div className="col-6">
                                    <label className="form-label">Běžná cena (Doporučená) (s DPH)</label>
                                    <input type="number" step=".01" className="form-control"  value="{{x.rec_price}}" name="rec_price_input">
                                    <p style="padding-top:10px"><strong>Cena bez DPH:</strong> 1568 Kč</p>
                                    </div>
                                
                                </div>
                                <br>
                                <div className="row">
                                    <div className="col-6">
                                    <label className="form-label">Nákupní cena (bez DPH)</label>
                                    <input type="number" step=".01" className="form-control"  value="{{x.pur_price}}" name="pur_price_input">
                                    <p style="padding-top:10px"><strong>Cena včetně DPH:</strong> 1568 Kč</p>
                                    </div>
                        
                                    <div className="col-6">
                                    <label className="form-label">Jednotná sazba DPH (v %)</label>
                                    <input type="number" className="form-control" value="{{x.vat}}" name="vat_input">
                                    </div>
                                
                                </div>
                                <br>
                                <h3>Parametry:</h3>
                                <br>
                                <div className="row">
                                    {% for p in x.get_params %}
                                    <div className="col-6">
                                    <label className="form-label">Název</label>
                                    <input type="text" className="form-control" value="{{p.name.name}}" name="param_name_{{p.name.id}}">
                                    </div>    
                                    <div className="col-6">
                                    <label className="form-label">Hodnota</label>
                                    <input type="text" className="form-control" value="{{p.value.value}}" name="param_value_{{p.value.id}}">
                                    </div>
                                    <br>
                                    {% endfor %}
                                </div>
                                <br>
                                </div>
                                <div className="modal-footer">
                                </div>
                            </form>
                            </div>
                        </div>
                        </div>
                        
                    {% endfor %}
                    </table>
                </div>
            </div>  
    
        <div className="tab-pane fade" id="text-tab-pane" role="tabpanel" aria-labelledby="text-tab" >
            <div className="row">
                <div className="col-lg-4">
                    <div className="card" >
                        <div className="card-body">
                            <h3>Krátký popis</h3>
                            <br>
                            <p className="lead">{{other.short_description}}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <h3>Dlouhý popis</h3>
                            <br>
                            {{other.description}}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div className="card tab-pane fade" id="parametrs-tab-pane" role="tabpanel" aria-labelledby="parametrs-tab" tabindex="0">
            <div className="card-body">
                <h3>Parametry</h3>
                    <br>
                <table className="table">
                {% for p in variant.get_params %}
                    <tr><td><strong>{{p.name.name}}</strong></td><td>{{p.value.value}}</td></tr>
                {% endfor %}
                </table>
            </div>
        </div>
        <div className="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">..wqqwqw.</div>
    </div>
</div>


<div className="modal fade" id="aktualizace" tabindex="-1" role="dialog" aria-labelledby="aktualizace" aria-hidden="true">
    <div className="modal-dialog" role="document">
    <div className="modal-content">
        <div className="modal-body">
        Opravdu si přejete aktualizovat produkt?
        </div>
        <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Zrušit</button>
        <button type="button" className="btn btn-primary">Aktualizovat</button>
        </div>
    </div>
    </div>
</div> */}