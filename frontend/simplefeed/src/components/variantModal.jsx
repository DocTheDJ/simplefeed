import React, {useState} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import ModificationVariantModal from './modificationVariantModal';


function VariantModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [data, setData] = useState();

    let getData = async(e) => {
        e.preventDefault();
        handleShow();
        axios.get(ipAddress + `get-variants/${props.id}`, getJsonHeader(props.authTokens)).then((response) => {setData(response.data);});
    }

    return (
        <>
            <a onClick={(e) => getData(e)} href=''>
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

export default VariantModal;

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
                <ModificationVariantModal data={props.data} context={props.context}></ModificationVariantModal>
                <a href="/var_detail/{{v.id}}"><button type="button" className="btn btn-info btn-rounded btn-icon">
                <i className="ti-eye"></i></button>
                </a>
                
                {
                    props.data.visible === '1' ? 
                        <a href="approve_var/{{v.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                            <i className="ti-arrow-circle-down"></i>
                        </button></a>
                    : 
                        props.data.visible === '0' ? 
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
