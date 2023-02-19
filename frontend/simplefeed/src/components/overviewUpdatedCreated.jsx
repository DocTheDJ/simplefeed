import React from 'react';

function UpdatedProductList(props){
    return (
        <div className="col-md-6 grid-margin stretch-card">
            <div className="card">
                <div className="card-body">
                    <p className="card-title mb-0">{props.name}</p>
                    <div className="table-responsive">
                        <table className="table table-striped table-borderless">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>  
                            </thead>
                            <tbody>
                                {
                                    props.data?.map((value, key) => {
                                        return (<ListItem data={value} key={key}></ListItem>);
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListItem(props){
    return (
        <tr>
            <td>
                {props.data.name}
            </td>
            <td className="font-weight-bold">
                {props.data.price} {props.data.currency}
            </td>
            <td>
                TBD
                {/* {{l.get_last_update|date:"j.n.Y / G:i"}} */}
            </td>
            <td className="font-weight-medium"><div className="badge badge-success">Completed</div></td>
        </tr>
    );
}

export default UpdatedProductList;