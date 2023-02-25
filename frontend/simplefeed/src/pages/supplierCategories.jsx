import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import {Tab, Tabs} from 'react-bootstrap';
import Tile from '../components/categoryTile';

function SupplierCategories(){
    const [data, setData] = useState(null);
    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + 'supplier-cats/', getJsonHeader(authTokens)).then((response) => {
            setData(response.data);
        })
    }, [authTokens]);
    console.log(data);

    return(
        <div className="row justify-content-md-center" id="categories">
            <div className="col-lg-6" >
                <h1 className="text-center">Dodavatelské kategorie</h1>
                <br/>
                {
                    data !== null ? 
                        data.length === 0 ?
                            <p>There are no supplier categories</p>
                        :
                            <SupplierTabs data={data} context={authTokens} setData={setData}></SupplierTabs>
                    :
                        <p>Loading categories</p>
                }
            </div>
        </div>

    );
}

export default SupplierCategories;

function SupplierTabs(props){
    const [tabkey, setTabkey] = useState(props.data[0].source.name)
    return (
        <Tabs activeKey={tabkey} onSelect={(e) => setTabkey(e)}>
            {
                props.data.map((value) => {
                    return(<Tab eventKey={value.source.name} title={value.source.name} key={`tab_${value.id}`}>
                                <Tile data={value} context={props.context} key={value.id} modal={false} setData={props.setData}></Tile>
                            </Tab>);
                })
            }
        </Tabs>
    );
}