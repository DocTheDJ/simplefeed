import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ipAddress, getJsonHeader } from './constants';
import axios from 'axios';
import AuthContext from './context/AuthContext';

function Test(){
    const {authTokens, user} = useContext(AuthContext);

    let runGet = async(e) => {
        e.preventDefault();
        console.log('boobs');
        axios.get(ipAddress + 'overview/', getJsonHeader(authTokens)).then((response) => {
            console.log(response.data)
        });
    }

    return (
        <div>
            <Button onClick={(e) => runGet(e)}>Test</Button>
        </div>
    );
}

// function userDrop(props){
//   return (
//     <li className="nav-item nav-profile dropdown">
//       <Dropdown>
//         <Dropdown.Toggle className='nav-link'>
//           {props.user.username}
//         </Dropdown.Toggle>
//         <Dropdown.Menu>
//           <Dropdown.Item><i className="ti-settings text-primary"></i>Nastaveni uctu</Dropdown.Item>
//           <Dropdown.Item><i className="ti-power-off text-primary"></i>Odhlasit</Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//       {/* <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
//         {props.user.username}<span className="mdi mdi-menu-down"></span>
//       </a>
//       <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
//         <button className="dropdown-item">
//           <i className="ti-settings text-primary"></i>
//           Nastavení účtu
//         </button>
//         <button href="logout/" className="dropdown-item">
//           <i className="ti-power-off text-primary"></i>
//           Odhlásit
//         </button>
//       </div> */}
//     </li>
//   );
// }


export {Test};