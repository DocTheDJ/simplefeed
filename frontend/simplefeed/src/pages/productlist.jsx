import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Button from 'react-bootstrap/esm/Button';

function ProductList(){
    const [data, setData] = useState(null);

    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + "product-list/", getJsonHeader(authTokens)).then((response) => {setData(response.data);});
    }, [authTokens]);
    console.log(data);

    return (
        <>
            <div className="row justify-content-md-center ">
            {/* {% include "side_filters.html" %} */}
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
                            data?.map((value, key) => {
                                return(<Product data={value} key={key} context={authTokens}></Product>)
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

function Product(props){
    const sum = props.data.variants.reduce((a,v) => a += v.amount, 0);

    const [approved, setApprove] = useState(props.data.approved);

    let updateApprovement = async(e) =>{
        e.preventDefault();
        axios.get(ipAddress + `approve_product/${props.data.id}/${+approved}`, getJsonHeader(props.context)).then((response) => {
            if(response.status === 200 && response.data === 'OK'){
                setApprove(!approved);
            }
        });
    }
    return (
        <div className="col-md-3 grid-margin grid-margin-md-0 stretch-card mb-4">
            <div className="card">
                <div className="card-body">

                    <input style={{
                        position: 'absolute',
                        left: '55px',
                        top: '30px',
                        width: '20px', height: '20px'}}
                    className="form-check-input form-control-lg" type="checkbox" value="{{x.id}}" name="product_check" form="checking-form"/>

                    <a href="/product_detail/{{x.id}}/"><img className="img-fluid mb-4 mx-auto d-block" style={{borderRadius: '8px', height: '220px'}} src={props.data.price_common.image_ref.image}></img>
                        <h4 className="card-title text-center">
                            {props.data.name}
                        </h4>
                    </a>
                    <div className="d-flex justify-content-between">
                        <a href="" data-bs-toggle="modal" data-bs-target="#variant_show{{x.id}}">
                            <p className="card-description">Počet variant: <strong>{props.data.variants.length}</strong></p>
                        </a>
                        <p className="card-description">
                            {
                                sum === 0 ? 
                                    <strong style={{color:'red'}}>Vyprodáno</strong>
                                :
                                    <><strong style={{color:'green'}}>Skladem </strong><strong>({sum})</strong></>
                            }

                        </p>
                    </div>
                    <p className="card-description text-center">
                        {props.data.itemgroup_id}
                    </p>
                    <h5 className="text-center" style={{padding: '5px', backgroundColor: 'rgb(211, 211, 211)',margin: '15px', borderRadius: '8px'}}>
                        {props.data.supplier.name}
                    </h5>
                    
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="lead">
                            {props.data.price_common.price} {props.data.price_common.currency}
                        </p>
                        {
                            approved ? 
                                <Button className="btn btn-inverse-success btn-icon" onClick={(e) => updateApprovement(e)}><i className="ti-arrow-circle-down"></i></Button>
                            :
                                <Button className="btn btn-inverse-danger btn-icon" onClick={(e) => updateApprovement(e)}><i className="ti-na"></i></Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;


{/* <div className="modal fade" id="variant_show{{x.id}}" tabindex="-1" aria-labelledby="label_variant_show{{x.id}}" aria-hidden="true">
    <div className="modal-dialog modal-xl modal-dialog-scrollable">
    <div className="modal-content">
        <div className="modal-header">
        <h5 className="modal-title" id="label_variant_show{{x.id}}">Seznam variant</h5>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Zavřít přehled</button>
        {% comment %} <form id="uncouple-form" method="POST">
            {% csrf_token %}
            <button type="submit" className="btn btn-info" formaction="multiple_action/uncouple/">Uncouple</button>
            <input type="hidden" value="{{x.id}}" name="product_id">
        </form> {% endcomment %}
        </div>
        <div className="modal-body">
        <table className="table">
            {% for v in x.get_variants %}
                <tr>
                {% comment %} <td><input className="form-check-input form-control-lg" type="checkbox" value="{{v.id}}" name="uncouple_vars" form="uncouple-form"></td> {% endcomment %}
                <td><img src="{{v.image_ref.image}}" style="width: 100px; height: 100px;"></td>
                <td>
                    {% if v.get_useable_count > 0%}
                    {% for p in v.get_useable %}
                        <p><strong>{{p.name.name}}:</strong> {{p.value.value}}</p>
                    {% endfor %}
                    {% else %}
                    {% for p in v.get_params %}
                    <p><strong>{{p.name.name}}:</strong> {{p.value.value}}</p>
                    {% endfor %}
                    {% endif %}
                </td>
                <td><strong>Kód:</strong>{{v.code}}  V</td>
                <td><strong>Skladem</strong><br>{{v.amount}} Ks</td>
                <td>{{v.price}} {{v.currency}}</td>
                <td>
                    <button type="button" className="btn btn-warning btn-rounded btn-icon" data-bs-toggle="modal" data-bs-target="#variant_edit{{v.id}}" data-bs-dismiss="modal">
                        <i className="ti-pencil"></i>
                    </button>
                    <a href="/var_detail/{{v.id}}"><button type="button" className="btn btn-info btn-rounded btn-icon">
                    <i className="ti-eye"></i>
                    </button>
                    
                    {% if v.visible == "1" %}
                    <a href="approve_var/{{v.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                        <i className="ti-arrow-circle-down"></i>
                    </button></a>
                    {% elif v.visible == "0" %}
                    <a href="approve_var/{{v.id}}/0"><button type="button" className="btn btn-inverse-danger btn-icon">
                        <i className="ti-na"></i>
                    </button></a>
                    {% else %}
                    <a href="approve_var/{{v.id}}/0"><button type="button" className="btn btn-info btn-icon">
                        <i className="ti-na"></i>
                    </button></a>
                    {% endif %}
                </td>
                </tr>
            {% endfor %}
        </table>
        </div>
        <div className="modal-footer">
        </div>
    </div>
    </div>
</div> */}


{/* {% for v in x.get_variants %}
    <div className="modal fade" id="variant_edit{{v.id}}" tabindex="-1" aria-labelledby="variant_edit{{v.id}}Label" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
            <form method="POST" action="update_var/{{v.id}}">
            {% csrf_token %}
            <div className="modal-header">
                <h5 className="modal-title" id="variant_edit{{v.id}}Label">Upravit variantu:  {{v.code}}</h5>
                <div>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#variant_show{{x.id}}">Zrušit</button>
                <input type="submit" className="btn btn-primary" value="Upravit variantu">
                </div>
            </div>
            <div className="modal-body">
                <h3>Ceník:</h3>
                <br>
                <div className="row">
                <div className="col-6">
                    <label className="form-label">Prodejní cena (s DPH)</label>
                    <input type="number" step=".01" className="form-control" value="{{v.price}}" name="price_input">
                    <p style="padding-top:10px"><strong>Cena bez DPH:</strong> 1568 Kč</p>
                </div>
                
                <div className="col-6">
                    <label className="form-label">Běžná cena (Doporučená) (s DPH)</label>
                    <input type="number" step=".01" className="form-control"  value="{{v.rec_price}}" name="rec_price_input">
                    <p style="padding-top:10px"><strong>Cena bez DPH:</strong> 1568 Kč</p>
                </div>
                
                </div>
                <br>
                <div className="row">
                <div className="col-6">
                    <label className="form-label">Nákupní cena (bez DPH)</label>
                    <input type="number" step=".01" className="form-control"  value="{{v.pur_price}}" name="pur_price_input">
                    <p style="padding-top:10px"><strong>Cena včetně DPH:</strong> 1568 Kč</p>
                </div>
        
                <div className="col-6">
                    <label className="form-label">Jednotná sazba DPH (v %)</label>
                    <input type="number" className="form-control" value="{{v.vat}}" name="vat_input">
                </div>
                
                </div>
                <br>
                <h3>Parametry:</h3>
                <br>
                <div className="row">
                {% for p in v.get_params %}
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
    {% endfor %} */}