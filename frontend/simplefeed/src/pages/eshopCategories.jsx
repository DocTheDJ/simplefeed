import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ipAddress, getJsonHeader, dataCheck, WarningStyle } from '../constants';
import axios from 'axios';
import {Collapse} from 'react-collapse';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronRight, mdiTransfer, mdiLeadPencil } from '@mdi/js';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


function EshopCategories(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + 'categories', getJsonHeader(authTokens)).then((response) => setData(response.data[0]));
    }, [authTokens]);

    return (
        <div className="row justify-content-md-center" >
            <div className="col-lg-6" >
                <h1 className="text-center">Eshopové kategorie</h1>
                <div className="row d-flex justify-content-center mt-3 mb-2 ">
                    <button className="btn btn-success btn-icon mr-1 js-cat-insert-modal"><span className="mdi mdi-plus"></span></button>
                    <a href="/pull_cats/"><button className="btn btn-primary btn-icon-text"><span className="mdi mdi-reload"></span> Aktualizovat</button></a>
                </div>
                <br/>
                <ul className="list-group" data-target="roots" style={{boxShadow: '10px 10px 71px 0px rgba(0,0,0,0.09)'}}>
                    {
                        data !== null ? 
                            <Tile data={data} key={data.id} context={authTokens}></Tile>
                        :
                            <></>
                    }
                </ul>
            </div>
        </div>

    );
}

function Tile(props){
    const [openSubs, setOpenSubs] = useState(false);
    const [name, setName] = useState(props.data.name);
    console.log(openSubs);
    return (
        <>
            <li className="cat-list list-group-item d-flex justify-content-between align-items-center" data-node-id="{{node.id}}">

                <div  className="cat_name d-flex align-items-center">
                    {
                        props.data.children.length > 0 ?
                            <a onClick={() => setOpenSubs(!openSubs)} href>
                                {
                                    openSubs ? 
                                        <Icon path={mdiChevronDown} size={0.9}></Icon>
                                    :
                                        <Icon path={mdiChevronRight} size={0.9}></Icon>
                                }
                            </a>
                        :
                            <></>
                    }                
                    <a className="js-cat-name" style={{color: '#282f3a'}} onClick={() => setOpenSubs(!openSubs)}>{name}</a>
                    <span className="m-0 pl-2" style={{color: 'lightgray'}}><strong>({props.data.children.length})</strong></span>
                </div>
                <div className="cat_functions">
                    {/* <a data-id="{{node.id}}" data-name="{{node.name}}" className="btn btn-secondary btn-xs js-cat-move-modal"><span className="mdi mdi-transfer"></span></a> */}
                    <EditModal data={props.data} context={props.context} setName={setName} name={name}></EditModal>
                    {/* <a data-id="{{node.id}}" data-name="{{node.name}}" className="btn btn-warning btn-xs js-cat-edit-modal"><span className="mdi mdi-lead-pencil"></span></a> */}
                    {/* <a data-id="{{node.id}}" data-name="{{node.name}}" className="btn btn-danger btn-xs js-cat-delete-modal"><span className="mdi mdi-delete"></span></a> */}
                </div>
            </li>
            {
                props.data.children.length > 0 && openSubs ? 
                    <Collapse isOpened={openSubs}>
                        <ul className='list-group ml-5'>
                            {
                                props.data.children.map((value) => {
                                    return (<Tile data={value} key={value.id} context={props.context}></Tile>);
                                })
                            }
                        </ul>
                    </Collapse>
                :
                    <></>
            }
        </>
    );
}

export default EshopCategories;

function EditModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [original] = useState(props.name);
    const [nameMessage, setNameMessage] = useState(null);

    let update = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        let send = true;
        let tmp;
        if(!(tmp = dataCheck(props.name, formData, 'name'))){
            send &= tmp;
            setNameMessage('Missing name');
        }
        if(send){
            try{
                axios.post(ipAddress + `update-category/${props.data.id}`, formData, getJsonHeader(props.context)).then((response) => {
                    if(response.status !== 200 || response.statusText !== 'OK'){
                        alert('Something fucked up');
                    }else{
                        handleClose();
                    }
                })
            }catch(l){
                console.log(l);
            }
        }
    }

    let revert = async() =>{
        props.setName(original);
        handleClose()
    }
    return (
        <>
            <Button onClick={handleShow} className='btn btn-warning btn-xs'><Icon path={mdiLeadPencil} size={0.5}></Icon></Button>
            <Modal show={show} onHide={handleClose} keyboard={true} className='fade'>
                <Modal.Header>
                    <h5 className="modal-title" id="exampleModalLabel">Upravit kategorii: </h5>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Název kategorie:</Form.Label>
                            <Form.Control onChange={(e) => props.setName(e.target.value)} value={props.name}></Form.Control>
                            <Form.Text>{nameMessage ? <p style={WarningStyle}>{nameMessage}</p> : null}</Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={revert} className='btn btn-secondary'>Zrušit</Button>
                    <Button onClick={(e) => update(e)} className='btn btn-primary'>Upravit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}