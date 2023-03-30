import ModificationVariantModal from '../components/modificationVariantModal';
import React from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import { NavLink } from 'react-router-dom';

function ProductVariants(props){
    return (
        <div className="card tab-pane fade show active" id="variant-tab-pane" role="tabpanel" aria-labelledby="variant-tab" tabIndex="0">
            <div className="card-body">
                <h3>Varianty produktu</h3>
                <br/>
                <table className="table">
                    <tbody>
                        {
                            props.data.map((value, key) =>{
                                return <VariantListItem 
                                            data={value} 
                                            key={key} 
                                            context={props.context} 
                                            id={props.id} 
                                            setData={props.setData} 
                                            product={props.product}/>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>  
    );
}

export default ProductVariants;

function useableParam(val){
    return val.var_param;
}
function VariantListItem(props){
    var params = props.data.params.filter(useableParam);
    if(params.length === 0){
        params = props.data.params;
    }
    let setMain = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + `set-main/${props.id}/${props.data.id}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.data !== 'OK'){
                alert('Something fucked up');
            }else{
                if(props.product){
                    axios.get(ipAddress + `product-detail/${props.id}`, getJsonHeader(props.context)).then((response) => {
                        props.setData(response.data[0]);
                    });
                }else{
                    axios.get(ipAddress + `variant-detail/${props.data.id}`, getJsonHeader(props.context)).then((response) => {
                        props.setData(response.data[0]);
                    });
                }
            }
        })
    }
    return (
        <tr>
            <td><input className="form-check-input form-control-lg" type="checkbox" value="{{x.id}}" name="uncouple_vars" form="uncouple-form"/></td>
            <td><img src={props.data.image_ref.image} style={{width: '100px', height: '100px'}} alt=''/></td>
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
                <ModificationVariantModal 
                    data={props.data}
                    context={props.context}
                    Child={() => <i className="ti-pencil"></i>}
                    buttonStyle={'btn btn-warning btn-rounded btn-icon'}>
                </ModificationVariantModal>
                <NavLink to={`/variantdetail/${props.data.id}`} onClick={(e) => {window.scrollTo(0,0)}}>
                    <button type="button" className="btn btn-info btn-rounded btn-icon">
                        <i className="ti-eye"></i>
                    </button>
                </NavLink>
                <Button className='btn btn-primary btn-rounded btn-icon' onClick={setMain}><i className="ti-star"></i></Button>
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