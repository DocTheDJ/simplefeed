import React, { useContext, useState } from 'react';
import LargeLogo from "./static/images/simplefeed_large_logo.svg"
import FaviconLogo from "./static/images/simplefeed_favicon_logo.svg"
import Icon from '@mdi/react';
import { mdiCheckBold, mdiMenuDown } from '@mdi/js';
import AuthContext from './context/AuthContext';
import Dropdown from 'react-bootstrap/Dropdown';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';


function Header(){
    let {user} = useContext(AuthContext);
    const {type, approvement, category, supplier, manufact, query} = useParams();
    const [quer, setQuery] = useState(query === '_' || query === undefined ? '' : query);

    let searchProducts = async(e, val) => {
      let t = type === undefined ? '1' : type;
      let a = approvement === undefined ? '3' : approvement;
      let c = category === undefined ? '_' : category;
      let s = supplier === undefined ? '_' : supplier;
      let m = manufact === undefined ? '_' : manufact;
      let q = val === undefined || val === '' ? '_' : val;
      window.history.replaceState(null, null, `/productlist/${t}/1/${a}/${c}/${s}/${m}/${q}`);
    }
    return (
        <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
          <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
            <img src={LargeLogo} className="navbar-brand brand-logo ml-2" style={{width:'180px'}} alt=''/>
            <img src={FaviconLogo} className="navbar-brand brand-logo-mini" alt=''/>

          </div>
          <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
            <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
              <span className="icon-menu"></span>
            </button>
            <ul className="navbar-nav mr-lg-2">
              <li className="nav-item nav-search d-none d-lg-block">
                <Form onSubmit={(e) => searchProducts(e, quer)}>
                  <div className="input-group">
                    <Form.Control type='text' onChange={(e) => setQuery(e.target.value)} value={quer} placeholder="Vyhledat produkt, variantu..."></Form.Control>
                    <div className="input-group-prepend hover-cursor" id="navbar-search-icon">
                      <Button type='submit' style={ {borderRadius: '8px'} } className="btn btn-primary btn-icon">
                        <i className="icon-search"></i>
                      </Button>
                    </div>
                  </div>
                </Form>
              </li>
            </ul>
            <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item">
                Dodavatelská aktualizace: <strong style={{paddingLeft:'5px',paddingRight:'5px'}}> 25.11.2022 15:45</strong> <Icon path={mdiCheckBold} color='green' size={0.75}></Icon>
              </li>
              <li className="nav-item">
                Eshopová aktualizace: <strong style={{paddingLeft:'5px', paddingRight:'5px'}}> 25.11.2022 15:45</strong> <Icon path={mdiCheckBold} color='green' size={0.75}></Icon>
              </li>
              {/* <li className="nav-item">
                Automaticke odhlaseni v: <strong style={{paddingLeft:'5px', paddingRight:'5px'}}>{{ request.session.get_expiry_date|date:"H:i" }}</strong> 
              </li> */}
              <li className="nav-item dropdown">
                {/* a */}
                <button className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
                  <i className="icon-bell mx-0"></i>
                  <span className="count"></span>
                </button>
                
                <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                  <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
                  <button className="dropdown-item preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-success">
                        <i className="ti-info-alt mx-0"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <h6 className="preview-subject font-weight-normal">Application Error</h6>
                      <p className="font-weight-light small-text mb-0 text-muted">
                        Just now
                      </p>
                    </div>
                  </button>
                  <button className="dropdown-item preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-warning">
                        <i className="ti-settings mx-0"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <h6 className="preview-subject font-weight-normal">Settings</h6>
                      <p className="font-weight-light small-text mb-0 text-muted">
                        Private message
                      </p>
                    </div>
                  </button>
                  <button className="dropdown-item preview-item">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-info">
                        <i className="ti-user mx-0"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <h6 className="preview-subject font-weight-normal">New user registration</h6>
                      <p className="font-weight-light small-text mb-0 text-muted">
                        2 days ago
                      </p>
                    </div>
                  </button>
                </div>
              </li>
              <li className="nav-item nav-profile dropdown">
                <Dropdown>
                  <Dropdown.Toggle>
                    {user.username}<Icon path={mdiMenuDown} size={0.75}></Icon>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item><i className="ti-settings text-primary"></i>Nastaveni uctu</Dropdown.Item>
                    <Dropdown.Item><i className="ti-power-off text-primary"></i>Odhlasit</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            
            </ul>
            <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
              <span className="icon-menu"></span>
            </button>
          </div>
        </nav>
    );
}

export default Header;