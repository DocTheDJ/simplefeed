import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import {Tab, Tabs, Dropdown, DropdownButton} from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronRight, mdiAttachment } from '@mdi/js';
import {Collapse} from 'react-collapse';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import PickingTile from '../components/categoryPickingTile';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';


function PairingCategory(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);
    const [rules, setRules] = useState(null);

    useEffect(() => {
        axios.get(ipAddress + 'category-pairing/', getJsonHeader(authTokens)).then((response) => {
            setData(response.data);
        });
        axios.get(ipAddress + 'rules/', getJsonHeader(authTokens)).then((response) => {
            setRules(response.data);
        })
    }, [authTokens]);

    return(
        <div className="row justify-content-md-center" >
            <div className="col-lg-8" >
                <h1 className="text-center">Category pairing</h1>
                <div className="row d-flex justify-content-center mt-3 mb-2 "></div>
                <br/>
                <ul className="list-group" style={{boxShadow: '10px 10px 71px 0px rgba(0,0,0,0.09)'}}>
                {
                    data !== null ? 
                        data.length === 0 ?
                            <p>There are no supplier categories</p>
                        :
                            <PairingTabs data={data} context={authTokens} setData={setData} rules={rules}></PairingTabs>
                    :
                        <p>Loading categories</p>
                }
                </ul>
            </div>
        </div>

    );
}
export default PairingCategory;

function PairingTabs(props){
    const [tabkey, setTabkey] = useState(props.data[0].source.name)
    return (
        <Tabs activeKey={tabkey} onSelect={(e) => setTabkey(e)}>
            {
                props.data.map((value) => {
                    return(<Tab eventKey={value.source.name} title={value.source.name} key={`tab_${value.id}`}>
                                <PairingTile data={value} context={props.context} key={value.id} setData={props.setData} rules={props.rules}></PairingTile>
                            </Tab>);
                })
            }
        </Tabs>
    );
}

function PairingTile(props){
    const [openSubs, setOpenSubs] = useState(false);

    let unpair = async(e, val) => {
        e.preventDefault();
        axios.get(ipAddress + `unpair-categories/${props.data.id}/${val}`, getJsonHeader(props.context)).then((response) => {
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }else{
                axios.get(ipAddress + 'category-pairing/', getJsonHeader(props.context)).then((response) => {
                    props.setData(response.data);
                });
            }
        })
    }
    return (
        <>
            <li className="cat-list list-group-item d-flex justify-content-between align-items-center" data-node-id="{{node.id}}">

                <div className="cat_name d-flex align-items-center">
                    <table>
                        <tbody>
                            <tr>
                                <td>
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
                                    <a className="js-cat-name" style={{color: '#282f3a'}} onClick={() => setOpenSubs(!openSubs)} href>{props.data.name}</a>
                                    <span className="m-0 pl-2" style={{color: 'lightgray'}}><strong>({props.data.children.length})</strong></span>
                                </td>
                            </tr>
                            {
                                props.data.childless?.map((value) => {
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                <a href onClick={(e) => unpair(e, value.id)}>
                                                    <PairedList data={value}></PairedList>
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="cat_functions">
                    <div className='d-flex'>
                        <ActionButton selected={props.data.action} rules={props.rules} data={props.data.pair_onto} id={props.data.id} context={props.context}></ActionButton>
                        <PickPairingCatModal id={props.data.id} context={props.context} setData={props.setData}></PickPairingCatModal>
                    </div>
                </div>
            </li>
            {
                props.data.children.length > 0 && openSubs ? 
                    <Collapse isOpened={openSubs}>
                        <ul className='list-group ml-5'>
                            {
                                props.data.children.map((value) => {
                                    return (<PairingTile data={value} key={value.id} context={props.context} modal={props.modal} setData={props.setData} rules={props.rules}></PairingTile>);
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

function PairedList(props){
    return(<>{props.data.name}{props.data.getParent !== null ? <> =&gt; <PairedList data={props.data.getParent}></PairedList></> : <></>}</>);
}

function PickPairingCatModal(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [target, setTarget] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if(show){
            axios.get(ipAddress + 'categories/', getJsonHeader(props.context)).then((response) => setData(response.data[0]));
        }
    }, [props.context, show]);

    let pair = async(e) =>{
        e.preventDefault();
        if(target !== null && target !== undefined){
            axios.get(ipAddress + `pair-categories/${props.id}/${target}`, getJsonHeader(props.context)).then((response) => {
                if(response.status !== 200 || response.statusText !== 'OK'){
                    alert('Somthing fucked up')
                }else{
                    axios.get(ipAddress + 'category-pairing/', getJsonHeader(props.context)).then((response) => {
                        props.setData(response.data);
                        handleClose();
                    });
                }
            });
        }
    }

    return (
        <>
            <Button onClick={handleShow} className='btn btn-warning btn-xs' style={{marginLeft:'10px'}}>
                <Icon size={0.9} path={mdiAttachment} style={{color: '#000000'}}></Icon>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <h5 className="modal-title">Pair category to:</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        {
                            data !== null ?
                                data !== undefined ?
                                    <PickingTile
                                        data={data} 
                                        setTarget={setTarget} 
                                        target={target}
                                        context={props.context}
                                        setData={props.setData}></PickingTile>
                                :
                                    <p>No categories</p>
                            :
                                <p>Loading categories.</p>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-secondary' onClick={handleClose}>Zrušit</Button>
                    <Button className='btn btn-primary' onClick={(e) => pair(e)}>Pair</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function ActionButton(props){
    const [state, setState] = useState(props.selected);
    var rules;
    if(props.data.length > 0){
        rules = props.rules;
    }else{
        rules = props.rules?.filter(val => val.action.startsWith('com_cat'));
    }
    let run = async(e, val) => {
        e.preventDefault();
        setState(val);
        axios.get(ipAddress + `update-action/${props.id}/${val.id}`, getJsonHeader(props.context)).then((response) =>{
            if(response.status !== 200 || response.statusText !== 'OK'){
                alert('Something fucked up');
            }
        })
    }
    return(
        <Dropdown>
            <Dropdown.Toggle variant={state.css_class}>{state.name}</Dropdown.Toggle>
            <Dropdown.Menu>
                {
                    rules?.map((value) => {
                        return(<Dropdown.Item key={value.id} onClick={(e) => run(e, value)}>{value.name}</Dropdown.Item>)
                    })
                }
            </Dropdown.Menu>
        </Dropdown>
    );
}