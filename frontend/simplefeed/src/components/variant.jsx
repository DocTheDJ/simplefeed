import React from 'react';
// import Button from 'react-bootstrap/esm/Button';
// import { ipAddress, getJsonHeader} from '../constants';
// import VariantModal from './variantModal';
// import axios from 'axios';
import ModificationVariantModal from './modificationVariantModal';
import Button from 'react-bootstrap/esm/Button';

function Variant(props){
    return (
        <div className="col-md-3 grid-margin grid-margin-md-0 stretch-card mb-4">
            <div className="card">
                <div className="card-body">
                    <input style={{
                        position: 'absolute',
                        left: '55px',
                        top: '30px',
                        width: '20px', height: '20px'}}
                    className="form-check-input form-control-lg" type="checkbox" value="{{x.id}}" name="variant_check" form="checking-form"/>

                    <a href="/var_detail/{{x.id}}/">
                        <img className="img-fluid mb-4 mx-auto d-block" style={{borderRadius: '8px', height: '220px'}} src={props.data.image_ref.image}/>
                        <h4 className="card-title text-center">
                            {props.data.name}
                        </h4>
                    </a>
                    <div className="d-flex justify-content-between">
                        <div>
                            {
                                props.data.params.map((value, key) => {
                                    return (
                                        <p className="card-description mb-0" key={key}><strong>{value.param.name.name}: </strong> {value.param.value.value}</p>
                                    );
                                })
                            }
                        </div>
                        <div>
                            {
                                props.data.decide_main ? 
                                    <p className="text-center" style={{background:'#4b49ac',borderRadius:'8px',padding:'4px',color: 'white'}}>Výchozí</p>
                                :
                                    <a style={{textDecoration: 'none', color: '#010101'}} href="">
                                        <p className="text-center" style={{background:'#d4d4da',borderRadius:'8px',padding:'4px'}}>
                                            Varianta
                                        </p>
                                    </a>
                            }
                            <p className="card-description">
                            
                            {
                                props.data.amount === 0 ? 
                                    <strong style={{color:'red'}}>Vyprodáno</strong>
                                :
                                    <><strong style={{color:'green'}}>Skladem </strong><strong>({props.data.amount})</strong></>
                            }
                            </p>
                        </div>
                    </div>
                </div>
                <p className="card-description text-center">
                    {props.data.code}
                </p>
                <h5 className="text-center" style={{padding: '5px',backgroundColor: 'rgb(211, 211, 211)',margin: '15px', borderRadius: '8px'}}>
                    {props.data.get_supplier}
                </h5>
                        
                <div className="d-flex align-items-center justify-content-between">
                    <p className="lead">
                        {props.data.price} {props.data.currency}
                    </p>
                    <div>
                        <ModificationVariantModal
                            data={props.data} 
                            context={props.context} 
                            Child={() => <i className="ti-pencil"></i>}
                            buttonStyle={'btn-inverse-warning btn-icon'}>
                        </ModificationVariantModal>
                        {
                            props.data.visible === '1' ? 
                                <a href="approve_var/{{x.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                                    <i className="ti-arrow-circle-down"></i>
                                </button></a>
                            : props.data.visible === '0' ? 
                                    <a href="approve_var/{{x.id}}/0">
                                        <button type="button" className="btn btn-inverse-danger btn-icon">
                                            <i className="ti-na"></i>
                                        </button>
                                    </a>
                                :
                                    <a href="approve_var/{{x.id}}/0">
                                        <button type="button" className="btn btn-info btn-icon">
                                            <i className="ti-na"></i>
                                        </button>
                                    </a>
                        }
                    </div>            
                </div>
            </div>
        </div>
    );
}

export default Variant;