import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate, NavLink } from "react-router-dom"
import Button from 'react-bootstrap/esm/Button';
import ProductImages from '../components/imageslider';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function ProductDetail(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(ipAddress + `product-detail/${id}`, getJsonHeader(authTokens)).then((response) => {setData(response.data[0]);});
    }, [authTokens, id]);

    return (
        <>
            <div className="row mb-3 ">
                <div className="col-lg-12 d-flex justify-content-between">
                    <div>
                        <Button onClick={() => navigate(-1)} className="btn btn-primary btn-icon-text"><i className="ti-arrow-left btn-icon-prepend"></i>Zpět</Button>
                        <NavLink to={'/productlist'}>
                            <button type="button" className="btn btn-outline-primary btn-icon-text">
                                Seznam produktů
                            </button>
                        </NavLink>
                    </div>
                    <div>
                        {
                            data?.approved ? 
                                <a href="approve_product/{{common.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                                    <i className="ti-arrow-circle-down"></i>
                                </button></a>
                            :
                                <a href="approve_product/{{common.id}}/0"><button type="button" className="btn btn-inverse-danger btn-icon">
                                    <i className="ti-na"></i>
                                </button></a>
                        }
                        <button type="button" className="btn btn-primary btn-icon-text">
                            <i className="ti-pencil btn-icon-prepend"></i>
                            Upravit produkt
                        </button>
                        <div className="btn-group">
                            <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Možnosti</button>
                            <div className="dropdown-menu" >
                                <a className="dropdown-item" href="generate_output_product/{{common.id}}/">Vygenerovat data</a>
                                <a className="dropdown-item">Zobrazit u dodavatele</a>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
            {
                data !== null ? <ProductData data={data}></ProductData> : <></>
            }
        </>
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
                            <p className="text-center mr-3" style={{display:'block', width:'200px !important', background:'lightgray', padding: '2px', borderRadius: '8px'}}>
                                {props.data.supplier.name}
                            </p>
                            <p className="text-center" style={{display:'block', width:'200px !important', border:'1px solid black', padding: '2px', borderRadius: '8px'}}>Produkt</p>
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
                            <a  href="">Zobrazit více...</a>
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
                <ProductDetailTabs data={props.data}></ProductDetailTabs>
            </div>
        </div>

    );
}

function ProductDetailTabs(props){
    const [tabKey, setTabKey] = useState('variants');
    return (
        <Tabs activeKey={tabKey} onSelect={(e) => setTabKey(e)}>
            <Tab eventKey={'variants'} title={`Varianty ${props.data.variants.length}`}>
                <ProductVariants data={props.data.variants}></ProductVariants>
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
                <p>Hello from category</p>
            </Tab>
        </Tabs>
    );
}

function ProductVariants(props){
    return (
        <div className="card tab-pane fade  show active" id="variant-tab-pane" role="tabpanel" aria-labelledby="variant-tab" tabIndex="0">
            <div className="card-body">
                <h3>Varianty produktu</h3>
                <br/>
                <table className="table">
                    <tbody>
                        {
                            props.data.map((value, key) =>{
                                return <VariantListItem data={value} key={key}/>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>  
    );
}

function useableParam(val){
    return val.var_param;
}
function VariantListItem(props){
    var params = props.data.params.filter(useableParam);
    if(params.length === 0){
        params = props.data.params;
    }
    return (
        <tr>
            <td><input className="form-check-input form-control-lg" type="checkbox" value="{{x.id}}" name="uncouple_vars" form="uncouple-form"/></td>
            <td><img src={props.data.image_ref.image} style={{width: '100px', height: '100px'}}/></td>
            <td>
                {
                    params.map((value, key) => {
                        return (<p key={key}><strong>{value.param.name.name}:</strong> {value.param.value.value}</p>);
                    })
                }
            </td>
            <td>
                {
                    props.data.decide_main ? 
                        <p className="text-center" style={{display:'block', width:'200px !important', border:'1px solid black', padding: '2px', borderRadius: '8px'}}>Hlavní varianta</p>
                    :
                        <></>
                }
                <strong>Kód:</strong>
                    {props.data.code}
            </td>
            <td><strong>Skladem</strong><br/>
                {props.data.amount} Ks
            </td>
            <td>
                {props.data.price} {props.data.currency}
            </td>
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
                {
                    props.data.visible === '1' ? 
                        <a href="approve_var/{{x.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                            <i className="ti-arrow-circle-down"></i>
                        </button></a>
                    : props.data.visible === '0' ?
                            <a href="approve_var/{{x.id}}/0"><button type="button" className="btn btn-inverse-danger btn-icon">
                                <i className="ti-na"></i>
                            </button></a>
                        :
                            <a href="approve_var/{{x.id}}/0"><button type="button" className="btn btn-info btn-icon">
                                <i className="ti-na"></i>
                            </button></a>
                }
            </td>
        </tr>
    );
}

function Descriptions(props){
    return (
        <div className="row">
            <div className="col-lg-4">
                <div className="card" >
                    <div className="card-body">
                        <h3>Krátký popis</h3>
                        <br/>
                        <p className="lead">
                            {props.data.short_description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card">
                    <div className="card-body">
                        <h3>Dlouhý popis</h3>
                        <br/>
                        {props.data.description}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Categories(props){
    return (
        <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
            <div className="row">
                <div className="col-lg-12 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h3>Eshopové kategorie</h3>
                            <br/>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        {/* <form method="POST" action="add_cat_to_com/{{common.id}}"> */}
                                            {/* {% csrf_token %} */}
                                            <td>
                                            <select className="form-control" name="category">
                                                {/* {% for node in pick_categories %}
                                                    {% include "print_tree_view.html" %}
                                                {% endfor %} */}
                                            </select>
                                            </td>
                                            <td><input className="btn btn-success"type="submit" value="Přidat kategorii"/></td>
                                            
                                        {/* </form> */}
                                    </tr>
                                    {/* {% for node in category_list %}
                                        {% if node.id in common.get_cats and node.supplier == eshop_id %}
                                        <tr id="cat_row_{{node.id}}">
                                            <td>{{ node.path }}</td>
                                            {% if node.buttonTrue %}
                                            <td>
                                                <form>
                                                {% csrf_token %}
                                                <input type="submit" className="btn btn-danger js-remove-cat-from-comm" data-remove-cat-id="{{node.id}}" data-comm-victim="{{common.id}}" value="Remove from">
                                                </form>
                                            </td>
                                            {% endif %}
                                        </tr>
                                        {% endif %}
                                    {% endfor %} */}
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
                            {/* {% for node in category_list %}
                                {% if node.id in common.get_cats and node.supplier == common.supplier_id %}
                                <tr>
                                    <td>{{ node.path }}</td>
                                </tr>
                                {% endif %}
                            {% endfor %} */}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


{/* <div className="modal fade" id="aktualizace" tabIndex="-1" role="dialog" aria-labelledby="aktualizace" aria-hidden="true">
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


{/* <div className="modal fade" id="variant_edit{{x.id}}" tabIndex="-1" aria-labelledby="variant_edit{{x.id}}Label" aria-hidden="true">
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
     */}