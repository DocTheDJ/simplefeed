import React, {useState} from 'react';
import Button from 'react-bootstrap/esm/Button';
import { ipAddress, getJsonHeader} from '../constants';
import VariantModal from './variantModal';
import axios from 'axios';

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

export default Product;