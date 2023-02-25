import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ipAddress, getJsonHeader, dataCheck, WarningStyle } from '../constants';
import axios from 'axios';
import {Collapse} from 'react-collapse';
import {Tab, Tabs} from 'react-bootstrap';
import { Tile } from './eshopCategories';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';


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
                <div className="d-flex justify-content-center">
                    {
                        data !== null ? 
                            data.length === 0 ?
                                <p>There are no supplier categories</p>
                            :
                                <SupplierTabs data={data} context={authTokens} setData={setData}></SupplierTabs>
                        :
                            <p>Loading categories</p>
                    }
                    {/* {% for x in suppliers %}
                    <a className="m-2" href="/categories_supplier/{{x.id}}">{{x.name}}</a>
                    {% endfor %} */}
                </div>
                {/* <br/>
                <ul className="list-group" style="box-shadow: 10px 10px 71px 0px rgba(0,0,0,0.09);">
                    {%for node in all_root_elems %}
                    
                        {% include "tree_view_template.html" %}
                        {%empty%}
                        <p className="text-center">Žádné kategorie není k dispozici</p>
                        <br>
                        <p className="lead text-center">Zkuste vybrat dodavatele</p>
                    {% endfor %}

                </ul> */}
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
                                {/* <ul className="list-group" data-target="roots" style={{boxShadow: '10px 10px 71px 0px rgba(0,0,0,0.09)'}}> */}
                                    <Tile data={value} context={props.context} key={value.id} modal={false} setData={props.setData}></Tile>
                                {/* </ul> */}
                            </Tab>);
                })
            }
        </Tabs>
    );
}