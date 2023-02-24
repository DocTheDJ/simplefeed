import React, { useContext } from 'react';
import LargeLogo from "./static/images/simplefeed_large_logo.svg"
import FaviconLogo from "./static/images/simplefeed_favicon_logo.svg"
import Icon from '@mdi/react';
import { mdiCheckBold, mdiMenuDown } from '@mdi/js';
import AuthContext from './context/AuthContext';
import Dropdown from 'react-bootstrap/Dropdown';


function Header(){
    let {user} = useContext(AuthContext)
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
                <form method="POST" action="/search/?page=1">
                  <div className="input-group">
                    
                      <input name="search_bar" type="text" className="form-control" id="navbar-search-input" placeholder="Vyhledat produkt, variantu..." aria-label="search" aria-describedby="search"/>
                      <div className="input-group-prepend hover-cursor" id="navbar-search-icon">
                        <button style={ {borderRadius: '8px'} } className="btn btn-primary btn-icon" type="submit" value="search"><i className="icon-search"></i></button>
                      </div>
                    </div>
                  </form>
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