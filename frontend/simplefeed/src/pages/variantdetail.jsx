import React, {useState, useContext, useEffect} from 'react';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';

function VariantDetail(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);
    const {id} = useParams() 

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
                        <VariantBar data={data} context={authTokens}></VariantBar>
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
        axios.get(ipAddress + `set-visibiliy/${props.data.id}/${future}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                setApprove(future);
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
                                // <a href="approve_var/{{variant.id}}/1"><button type="button" className="btn btn-inverse-success btn-icon">
                                //     <i className="ti-arrow-circle-down"></i>
                                // </button></a>
                            : approved === '0' ?
                                    <Button className='btn btn-inverse-danger btn-icon' onClick={(e)=>updateVisibility(e)}><i className="ti-na"></i></Button>
                                    // <a href="approve_var/{{variant.id}}/0"><button type="button" className="btn btn-inverse-danger btn-icon">
                                    //     <i className="ti-na"></i>
                                    // </button></a>
                                :
                                    <Button className='btn btn-info btn-icon' onClick={(e)=>updateVisibility(e)}><i className="ti-na"></i></Button>
                                    // <a href="approve_var/{{variant.id}}/0"><button type="button" className="btn btn-info btn-icon">
                                    //     <i className="ti-na"></i>
                                    // </button></a>    
                        }
                    <button type="button" className="btn btn-primary btn-icon-text">
                        <i className="ti-pencil btn-icon-prepend"></i>
                        Upravit variantu
                    </button>
                    <a href="/product_detail/{{variant.get_productID}}/"><button type="button" className="btn btn-info btn-icon-text">
                        <i className="ti-zoom-out btn-icon-prepend"></i>
                        Přejít na produkt
                    </button></a>
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