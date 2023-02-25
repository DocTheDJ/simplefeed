import React, { useEffect, useState } from 'react';
import { ipAddress, getJsonHeader, dataCheck, WarningStyle } from '../constants';
import axios from 'axios';
import {Collapse} from 'react-collapse';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronRight, mdiTransfer, mdiLeadPencil, mdiDelete } from '@mdi/js';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


function Tile(props){
    const [openSubs, setOpenSubs] = useState(false);
    const [name, setName] = useState(props.data.name);
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
                    <a className="js-cat-name" style={{color: '#282f3a'}} onClick={() => setOpenSubs(!openSubs)} href>{name}</a>
                    <span className="m-0 pl-2" style={{color: 'lightgray'}}><strong>({props.data.children.length})</strong></span>
                </div>
                {
                    props.modal ? 
                        <></>
                    :
                        <div className="cat_functions">
                            <MoveModal data={props.data} context={props.context} setData={props.setData} key={`move_${props.data.id}`}></MoveModal>
                            <EditModal data={props.data} context={props.context} setName={setName} name={name} key={`edit_${props.data.id}`}></EditModal>
                            <DeleteModal data={props.data} context={props.context} setData={props.setData} key={`delete_${props.data.id}`}></DeleteModal>
                        </div>
                }
            </li>
            {
                props.data.children.length > 0 && openSubs ? 
                    <Collapse isOpened={openSubs}>
                        <ul className='list-group ml-5'>
                            {
                                props.data.children.map((value) => {
                                    return (<Tile data={value} key={value.id} context={props.context} modal={props.modal} setData={props.setData}></Tile>);
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
export default Tile;

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

function DeleteModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let run = async(e) => {
        e.preventDefault();
        axios.get(ipAddress + `delete-category/${props.data.id}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                handleClose();
                axios.get(ipAddress + 'categories', getJsonHeader(props.context)).then((response) => {
                    props.setData(response.data[0]);
                })
            }
        })
    }

    return(
        <>
            <Button onClick={handleShow} className='btn btn-danger btn-xs'><Icon path={mdiDelete} size={0.5}></Icon></Button>
            <Modal show={show} onHide={handleClose} className='fade'>
                <Modal.Header>
                    <h5 className="modal-title" id="exampleModalLabel">Odstranit kategorii: </h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <p>Opravdu si přejete odstranit tyto kategorie ?</p>
                        <Tile data={props.data} key={`modal_${props.data.id}`} context={props.context} modal={true}></Tile>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose} className='btn btn-secondary'>Zrušit</Button>
                    <Button onClick={(e) => run(e)} className='btn btn-primary'>Odstranit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function MoveModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [target, setTarget] = useState(null);
    const [data, setData] = useState(null);

    console.log(props.data);
    useEffect(() => {
        if(show){
            var source = Number.isInteger(props.data.source) ? props.data.source : props.data.source.id;
            axios.get(ipAddress + `cats-from-source/${source}`, getJsonHeader(props.context)).then((response) => setData(response.data[0]));
        }
    },[props.context, show, props.data.source]);

    let move = async(e) => {
        e.preventDefault();
        if(target !== null || target !== undefined){
            axios.get(ipAddress + `move-category/${props.data.id}/${target}`, getJsonHeader(props.context)).then((response) => {
                if(response.status !== 200 || response.statusText !== 'OK'){
                    alert('Somthing fucked up')
                }else{
                    handleClose();
                    axios.get(ipAddress + 'categories', getJsonHeader(props.context)).then((response) => props.setData(response.data[0]));
                }
            })
        }
    }

    return (
        <>
            <Button onClick={handleShow} className='btn btn-secondary btn-xs'><Icon path={mdiTransfer} size={0.5}></Icon></Button>
            <Modal show={show} onHide={handleClose} className='fade'>
                <Modal.Header>
                    <h5 className="modal-title" id="exampleModalLabel">Přesunout kategorii: </h5>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <p>Pick new parent for chosen category:</p>
                        {
                            data !== null ?
                                data.id === props.data.id ? 
                                    <p>You cannot put category inside itself</p>
                                :
                                    <PickingTile data={data} setTarget={setTarget} target={target} context={props.context} setData={props.setData} wanted={props.data.id}></PickingTile>
                            :
                                <p>Loading categories</p>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-secondary' onClick={handleClose}>Zrušit</Button>
                    <Button className='btn btn-primary' onClick={(e) => move(e)}>Přesunout</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function PickingTile(props){
    const [openSubs, setOpenSubs] = useState(false);
    var backGroundStyle = {}
    if(props.target === props.data.id){
        backGroundStyle = {backgroundColor : '#FFD800'};
    }
    var children = props.data.children.filter(child => child.id !== props.wanted)
    return (
            <>
                <li className="cat-list list-group-item d-flex justify-content-between align-items-center" data-node-id="{{node.id}}">
    
                    <div className="cat_name d-flex align-items-center" style={backGroundStyle}>
                        {
                            children.length > 0 ?
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
                        <a className="js-cat-name" style={{color: '#282f3a'}} onClick={() => props.setTarget(props.data.id)} href>{props.data.name}</a>
                        <span className="m-0 pl-2" style={{color: 'lightgray'}}><strong>({children.length})</strong></span>
                    </div>
                </li>
                {
                    children.length > 0 && openSubs ? 
                        <Collapse isOpened={openSubs}>
                            <ul className='list-group ml-5'>
                                {
                                    children.map((value) => {
                                        return (<PickingTile 
                                                    data={value} 
                                                    key={`pickingtile_${value.id}`} 
                                                    context={props.context} 
                                                    setData={props.setData} 
                                                    setTarget={props.setTarget}
                                                    target={props.target}
                                                    wanted={props.wanted}/>);
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