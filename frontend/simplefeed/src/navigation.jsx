import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiSitemapOutline } from '@mdi/js';
import { NavLink } from 'react-router-dom';
import {Collapse} from 'react-collapse';

function Navigation(){
    const [categoryCollapse, setCategoryCollapse] = useState(false);
    const [settingsCollapse, setSettingsCollapse] = useState(false);
    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to={'/'}>
                        <i className="ti-dashboard menu-icon"></i>
                        <span className="menu-title">Přehled</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className='nav-link' to={'/productlist/1/1/3/_/_/_'}>
                        <i className="ti-package menu-icon"></i>
                        <span className="menu-title">Produkty</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <a className='nav-link' onClick={(e) => {setCategoryCollapse(!categoryCollapse)}} href>
                        <Icon path={mdiSitemapOutline} size={0.666667} style={{marginRight: '1rem'}}></Icon>
                        <span className="menu-title">Kategorie</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <Collapse isOpened={categoryCollapse}>
                        <ul className="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li className="nav-item"> <NavLink to={'/categories'} className='nav-link'>Eshopové</NavLink></li>
                            <li className="nav-item"> <NavLink to={'/suppliercategories'} className='nav-link'>Dodavatelské</NavLink></li>
                            <li className="nav-item"> <NavLink to={'/pairingcategories'} className="nav-link">Párování</NavLink></li>
                        </ul>
                    </Collapse>
                    {/* <a className="nav-link" data-toggle="collapse" href="#nav_categories" aria-expanded="false" aria-controls="nav_categories">
                        <Icon path={mdiSitemapOutline} size={0.666667} style={{marginRight: '1rem'}}></Icon>
                        <span className="menu-title">Kategorie</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="nav_categories">
                        <ul className="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li className="nav-item"> <a className="nav-link" href="/categories/">Eshopové</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/categories_supplier/">Dodavatelské</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/categories_paring/">Párování</a></li>
                        </ul>
                    </div> */}
                </li>

                <li className="nav-item">
                    <a className="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                        <i className="ti-harddrives menu-icon"></i>
                        <span className="menu-title">Dodavatelé</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="ui-basic">
                        <ul className="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li className="nav-item pb-2"> <a className="nav-link" href="pages/ui-features/buttons.html">Přehled dodavatelů</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/supplier_detail/">Dodavatel</a></li>
                        </ul>
                    </div>
                </li>
                <li className="nav-item">
                    <NavLink className='nav-link' to={'/test'}>
                        <i className="ti-ruler-pencil menu-icon"></i>
                        <span className="menu-title">Pravidla</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <a className='nav-link' onClick={(e) => setSettingsCollapse(!settingsCollapse)} href>
                        {/* <Icon path={mdiSettingsHelper} size={0.666667} style={{marginRight: '1rem'}}></Icon> */}
                        <i className="ti-settings menu-icon"></i>
                        <span className="menu-title">Nastavení</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <Collapse isOpened={settingsCollapse}>
                        <ul className="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li className="nav-item"> <a className="nav-link" href="pages/ui-features/buttons.html">Základní nastavení</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/avalibility/">Skladová dostupnost</a></li>
                            <li className="nav-item"> <NavLink to={'/parameters'} className="nav-link">Parametry</NavLink></li>
                            <li className="nav-item"> <NavLink to={'/manufacturers'} className="nav-link">Výrobci</NavLink></li>
                        </ul>
                    </Collapse>
                    {/* <a className="nav-link" data-toggle="collapse" href="#nastaveni" aria-expanded="false" aria-controls="ui-basic">
                        <i className="ti-settings menu-icon"></i>
                        <span className="menu-title">Nastavení</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="nastaveni">
                        <ul className="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li className="nav-item"> <a className="nav-link" href="pages/ui-features/buttons.html">Základní nastavení</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/avalibility/">Skladová dostupnost</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/parameters/">Parametry</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/manufacturers/">Výrobci</a></li>
                        </ul>
                    </div> */}
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="tmp/">
                        <i className="ti-export menu-icon"></i>
                        <span className="menu-title">Export feedu</span>
                    </a>
                </li>
                <li className="nav-item" style={{backgroundColor: '#FFC100', borderRadius: '8px'}}>
                    <a className="nav-link" href="/addfeed/">
                        <i className="ti-pencil-alt menu-icon"></i>
                        <span className="menu-title">Nové napojení</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;