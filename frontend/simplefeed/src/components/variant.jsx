import React, { useState, useEffect } from 'react';
import ModificationVariantModal from './modificationVariantModal';
import { NavLink } from 'react-router-dom';
import { ipAddress, getJsonHeader} from '../constants';
import axios from 'axios';

function Variant(props){
    const [visibility, setVisibility] = useState(props.data.visible)
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(props.checkedList.includes(props.data.id));
    }, [props.checkedList, props.data.id]);

    let updateVisibility = async(e, val) =>{
        e.preventDefault();
        axios.get(ipAddress + `set-visibility/${props.data.id}/${val}`, getJsonHeader(props.context)).then((response) => {
            if(response.status === 200 && response.data === 'OK'){
                setVisibility(val);
            }
        });
    }

    let handleCheck = async() => {
        setChecked(!checked);
        if(!checked){
            props.setCheckedList([...props.checkedList, props.data.id]);
        }else{
            let newList = props.checkedList.filter((item) => item !== props.data.id);
            props.setCheckedList(newList);
        }
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
                    className="form-check-input form-control-lg" type="checkbox" checked={checked} onChange={handleCheck}/>

                    <NavLink to={`/variantdetail/${props.data.id}`}>
                        <img className="img-fluid mb-4 mx-auto d-block" style={{borderRadius: '8px', height: '220px'}} src={props.data.image_ref.image} alt=''/>
                        <h4 className="card-title text-center">
                            {props.data.name}
                        </h4>
                    </NavLink>
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
                                    <p className="text-center" style={{background:'#d4d4da',borderRadius:'8px',padding:'4px'}}>
                                        Varianta
                                    </p>
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
                            visibility === '1' ? 
                                <button type="button" className="btn btn-inverse-success btn-icon" onClick={(e) => updateVisibility(e, '0')}>
                                    <i className="ti-arrow-circle-down"></i>
                                </button>
                            : visibility === '0' ? 
                                    <button type="button" className="btn btn-inverse-danger btn-icon" onClick={(e) => updateVisibility(e, '2')}>
                                        <i className="ti-na"></i>
                                    </button>
                                :
                                    <button type="button" className="btn btn-info btn-icon" onClick={(e) => updateVisibility(e, '1')}>
                                        <i className="ti-na"></i>
                                    </button>
                        }
                    </div>            
                </div>
            </div>
        </div>
    );
}

function VariantRow(props){
    return(
        <tr>
            <td>{props.data.id}</td>
            <td>{props.data.code}</td>
            <td>{props.data.name}</td>
            <td>{props.data.ean}</td>
            <td>{props.data.price}</td>
            <td>{props.data.pur_price}</td>
            <td>{props.data.get_supplier}</td>
        </tr>
    );
}

export {Variant, VariantRow};