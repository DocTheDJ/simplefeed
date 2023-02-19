import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Panels from '../components/overviewPanels';
import { ipAddress, getJsonHeader } from '../constants';
import axios from 'axios';
import FeedList from '../components/overviewfeeds';
import UpdatedProductList from '../components/overviewUpdatedCreated';

function Overview(){
    const [data, setData] = useState(null);

    const {authTokens} = useContext(AuthContext);

    useEffect(() => {
        axios.get(ipAddress + "overview/", getJsonHeader(authTokens)).then((response) => {setData(response.data);});
    }, [authTokens]);
    console.log(data);

    return (
        <>
            <div id="alert-true" className="alert-mess alert-true">
                <div className="alert-header">
                <span className="mdi mdi-close mdi-light "></span>
                </div>
                <div className="alert-content">
                <span className="mdi mdi-check-circle-outline mdi-light mdi-24px"></span>
                <p></p>
                </div>
            </div>

            <div id="alert-false" className="alert-mess alert-false">
                <div className="alert-header">
                <span className="mdi mdi-close mdi-light "></span>
                </div>
                <div className="alert-content">
                <span className="mdi mdi-close mdi-light mdi-24px"></span>
                <p></p>
                </div>
            </div>

            <Panels total_products={data?.total_products}
                    total_variants={data?.total_variants} 
                    active_products={data?.active_products}
                    active_variants={data?.active_variants}
                    inactive_products={data?.inactive_products}
                    inactive_variants={data?.inactive_variants}
                    faulty_variants={data?.faulty_variants}></Panels>
        
            <FeedList suppliers={data?.suppliers}></FeedList>

            <div className="col-lg-12">
                <div className="row">
                    <UpdatedProductList name={'Nové produkty'} data={data?.last_created}></UpdatedProductList>
                    <UpdatedProductList name={'Seznam aktualizací'} data={data?.last_updated}></UpdatedProductList>
                </div>
            </div>
        
        </>
    );
}

export default Overview;