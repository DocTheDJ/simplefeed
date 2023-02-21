import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader, dataCheck, WarningStyle } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

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
                        <VariantModal id={props.data.id} length={props.data.variants.length} authTokens={props.context}></VariantModal>
                        <p className="card-description">
                            {
                                props.data.total_amount === 0 ? 
                                    <strong style={{color:'red'}}>Vyprodáno</strong>
                                :
                                    <><strong style={{color:'green'}}>Skladem </strong><strong>({props.data.total_amount})</strong></>
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

function VariantModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [data, setData] = useState();

    console.log(data);

    let getData = async(e) => {
        e.preventDefault();
        handleShow();
        axios.get(ipAddress + `get-variants/${props.id}`, getJsonHeader(props.authTokens)).then((response) => {setData(response.data);});
    }

    return (
        <>
            <a onClick={(e) => getData(e)}>
                <p className="card-description">Počet variant: <strong>{props.length}</strong></p>
            </a>
            <Modal show={show} dialogClassName='modal-xl modal-dialog-scrollable'>
                <Modal.Header>
                    <Modal.Title>Seznam variant</Modal.Title>
                    {/* <h5 className="modal-title" id="label_variant_show{{x.id}}">Seznam variant</h5> */}
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Zavřít přehled</button>
                </Modal.Header>
                <Modal.Body>
                    <table className="table">
                        <tbody>
                            {
                                data?.map((value, key) => {
                                    return (<VariantModalItem data={value} key={key} context={props.authTokens}/>)
                                })
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
        </>
    );
}

function useableParam(val){
    return val.var_param;
}

function VariantModalItem(props){
    var params = props.data.params.filter(useableParam);
    if(params.length === 0){
        params = props.data.params;
    }
    return (
        <tr>
            {/* <td><input className="form-check-input form-control-lg" type="checkbox" value="{{v.id}}" name="uncouple_vars" form="uncouple-form"></td> */}
            <td><img src={props.data.image_ref.image} style={{width: '100px', height: '100px'}} alt=""/></td>
            <td>
                {
                    params.map((value, key) => {
                        return(<p key={key}><strong>{value.param.name.name}:</strong> {value.param.value.value}</p>);
                    })
                }
            </td>
            <td><strong>Kód:</strong>
                {props.data.code} V
            </td>
            <td><strong>Skladem</strong><br/>
                {props.data.amount} Ks
            </td>
            <td>
                {props.data.price} {props.data.currency}
            </td>
            <td>
                {/* <button type="button" className="btn btn-warning btn-rounded btn-icon" data-bs-toggle="modal" data-bs-target="#variant_edit{{v.id}}" data-bs-dismiss="modal">
                    <i className="ti-pencil"></i>
                </button> */}
                <ModificationProductModal data={props.data} context={props.context}></ModificationProductModal>
                <a href="/var_detail/{{v.id}}"><button type="button" className="btn btn-info btn-rounded btn-icon">
                <i className="ti-eye"></i></button>
                </a>
                
                {
                    props.data.visible === 1 ? 
                        <a href="approve_var/{{v.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                            <i className="ti-arrow-circle-down"></i>
                        </button></a>
                    : 
                        props.data.visible === 0 ? 
                            <a href="approve_var/{{v.id}}/0"><button type="button" className="btn btn-inverse-danger btn-icon">
                                <i className="ti-na"></i>
                            </button></a>
                        :
                            <a href="approve_var/{{v.id}}/0"><button type="button" className="btn btn-info btn-icon">
                                <i className="ti-na"></i>
                            </button></a>
                }
            </td>
        </tr>
    );
}

function ModificationProductModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [price, setPrice] = useState(props.data.price);
    const [recprice, setRecPrice] = useState(props.data.rec_price);
    const [purPrice, setPurPrice] = useState(props.data.pur_price);
    const [vat, setVat] = useState(props.data.vat);
    const [params, setParams] = useState(props.data.params.map(value => {return value.param}));

    const [priceMessage, setPriceMessage] = useState(null)
    const [recPriceMessage, setRecPriceMessage] = useState(null)
    const [purPriceMessage, setPurPriceMessage] = useState(null)
    const [vatMessage, setVatMessage] = useState(null)

    let saveMods = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        let send = true;
        let tmp;
        if(!(tmp = dataCheck(price, formData, 'price'))){
            send &= tmp;
            setPriceMessage('Missing price');
        }
        if(!(tmp = dataCheck(recprice, formData, 'rec_price'))){
            send &= tmp;
            setRecPriceMessage('Missing rec price');
        }
        if(!(tmp = dataCheck(purPrice, formData, 'pur_price'))){
            send &= tmp;
            setPurPriceMessage('Missing purchase price');
        }
        if(!(tmp = dataCheck(vat, formData, 'vat'))){
            send &= tmp;
            setVatMessage('Missing vat');
        }
        if(send){
            formData.append('image_ref', props.data.image_ref.id)
            formData.append('availability', props.data.availability)
            formData.append('mods', props.data.mods)
            try{
                axios.post(ipAddress + `update-variant/${props.data.id}`, formData, getJsonHeader(props.context)).then((response) => {
                    if(response.status !== 200 || response.data !== 'OK'){
                        console.log(response);
                        alert('Something fucked up');
                    }
                })
            }catch(l){
                console.log(l);
            }
        }
        handleClose();

    }

    return (
        <>
            <Button className="btn-warning btn-rounded btn-icon" onClick={handleShow}>
                <i className="ti-pencil"></i>
            </Button>
            <Modal dialogClassName='modal-xl modal-dialog-scrollable' show={show}>
                <Form>
                    <Modal.Header>
                        <Modal.Title>Upravit variantu:  {props.code}</Modal.Title>
                        <Button className='btn-secondary' onClick={handleClose}>Zrušit</Button>
                        <Button className='btn-primary' onClick={(e) => saveMods(e)}>Upravit variantu</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <h3>Ceník:</h3>
                            <br/>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Group>
                                        <Form.Label>Prodejní cena (s DPH)</Form.Label>
                                        <Form.Control type='number' step='.01' onChange={(e) => setPrice(e.target.value)} value={price}></Form.Control>
                                        <p style={{paddingTop:'10px'}}><strong>Cena bez DPH:</strong> {price} Kč</p>
                                        <Form.Text>{priceMessage ? <p style={WarningStyle}>{priceMessage}</p> : null}</Form.Text>
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group>
                                        <Form.Label>Běžná cena (Doporučená) (s DPH)</Form.Label>
                                        <Form.Control type='number' step='.01' onChange={(e) => setRecPrice(e.target.value)} value={recprice}></Form.Control>
                                        <p style={{paddingTop:'10px'}}><strong>Cena bez DPH:</strong> {recprice} Kč</p>
                                        <Form.Text>{recPriceMessage ? <p style={WarningStyle}>{recPriceMessage}</p> : null}</Form.Text>
                                    </Form.Group>
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Group>
                                        <Form.Label>Nákupní cena (bez DPH)</Form.Label>
                                        <Form.Control type='number' step='.01' onChange={(e) => setPurPrice(e.target.value)} value={purPrice}></Form.Control>
                                        <p style={{paddingTop:'10px'}}><strong>Cena včetně DPH:</strong> {purPrice} Kč</p>
                                        <Form.Text>{purPriceMessage ? <p style={WarningStyle}>{purPriceMessage}</p> : null}</Form.Text>
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group>
                                        <Form.Label>Jednotná sazba DPH (v %)</Form.Label>
                                        <Form.Control type='number' onChange={(e) => setVat(e.target.value)} value={vat}></Form.Control>
                                        <Form.Text>{vatMessage ? <p style={WarningStyle}>{vatMessage}</p> : null}</Form.Text>
                                    </Form.Group>
                                </div>
                            </div>
                            <br/>
                            <h3>Parametry:</h3>
                            <br/>
                                {
                                    params.map((value, key) => {
                                        return(
                                            <div className="row" key={key}>
                                                <div className="col-6">
                                                    <Form.Label>Název</Form.Label>
                                                    <Form.Control type='text' value={value.name.name} onChange={(e) => {}}></Form.Control>
                                                </div>
                                                <div className="col-6">
                                                    <Form.Label>Hodnota</Form.Label>
                                                    <Form.Control type='text' value={value.value.value} onChange={(e) => {}}></Form.Control>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            <br/>
                    </Modal.Body>
                </Form>
            </Modal>
        </>
    );
}

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