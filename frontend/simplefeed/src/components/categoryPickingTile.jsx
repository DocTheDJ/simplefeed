import React, { useState } from 'react';
import {Collapse} from 'react-collapse';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';


function PickingTile(props){
    const [openSubs, setOpenSubs] = useState(false);
    var backGroundStyle = {}
    if(props.target === props.data.id){
        backGroundStyle = {backgroundColor : '#FFD800'};
    }
    var children;
    if(props.wanted !== null && props.wanted !== undefined){
        children = props.data.children.filter(child => child.id !== props.wanted);
    }else{
        children = props.data.children;
    }
    return (
            <>
                <li className="cat-list list-group-item d-flex justify-content-between align-items-center">
    
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

export default PickingTile;