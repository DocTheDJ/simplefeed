import React, {useState} from 'react';
import { ipAddress, getJsonHeader, dataCheck, WarningStyle } from '../constants';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


function ModificationVariantModal(props){
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
            formData.append('availability', parseInt(props.data.availability, 10))
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

export default ModificationVariantModal;