import React, { useContext, useState } from 'react';
import Icon from '@mdi/react';
import { mdiSitemapOutline } from '@mdi/js';

function Navigation(){
    return (
        <nav class="sidebar sidebar-offcanvas" id="sidebar">
            <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link" href="/products/">
                        <i class="ti-dashboard menu-icon"></i>
                        <span class="menu-title">Přehled</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/products_list/?approved=all&page=1">
                        <i class="ti-package menu-icon"></i>
                        <span class="menu-title">Produkty</span>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" data-toggle="collapse" href="#nav_categories" aria-expanded="false" aria-controls="nav_categories">
                        {/* <i class="mdi mdi-sitemap-outline menu-icon"></i> */}
                        <Icon path={mdiSitemapOutline} size={0.666667} style={{marginRight: '1rem'}}></Icon>
                        <span class="menu-title">Kategorie</span>
                    <i class="menu-arrow"></i>
                    </a>
                    <div class="collapse" id="nav_categories">
                        <ul class="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li class="nav-item"> <a class="nav-link" href="/categories/">Eshopové</a></li>
                            <li class="nav-item"> <a class="nav-link" href="/categories_supplier/">Dodavatelské</a></li>
                            <li class="nav-item"> <a class="nav-link" href="/categories_paring/">Párování</a></li>
                        </ul>
                    </div>
                </li>

                <li class="nav-item">
                    <a class="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                        <i class="ti-harddrives menu-icon"></i>
                        <span class="menu-title">Dodavatelé</span>
                        <i class="menu-arrow"></i>
                    </a>
                    <div class="collapse" id="ui-basic">
                        <ul class="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li class="nav-item pb-2"> <a class="nav-link" href="pages/ui-features/buttons.html">Přehled dodavatelů</a></li>
                            <li class="nav-item"> <a class="nav-link" href="/supplier_detail/">Dodavatel</a></li>
                        </ul>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">
                        <i class="ti-ruler-pencil menu-icon"></i>
                        <span class="menu-title">Pravidla</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="collapse" href="#nastaveni" aria-expanded="false" aria-controls="ui-basic">
                        <i class="ti-settings menu-icon"></i>
                        <span class="menu-title">Nastavení</span>
                        <i class="menu-arrow"></i>
                    </a>
                    <div class="collapse" id="nastaveni">
                        <ul class="nav flex-column sub-menu" style={{paddingLeft:'20px'}}>
                            <li class="nav-item"> <a class="nav-link" href="pages/ui-features/buttons.html">Základní nastavení</a></li>
                            <li class="nav-item"> <a class="nav-link" href="/avalibility/">Skladová dostupnost</a></li>
                            <li class="nav-item"> <a class="nav-link" href="/parameters/">Parametry</a></li>
                            <li class="nav-item"> <a class="nav-link" href="/manufacturers/">Výrobci</a></li>
                        </ul>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">
                        <i class="ti-export menu-icon"></i>
                        <span class="menu-title">Export feedu</span>
                    </a>
                </li>
                <li class="nav-item" style={{backgroundColor: '#FFC100', borderRadius: '8px'}}>
                    <a class="nav-link" href="/addfeed/">
                        <i class="ti-pencil-alt menu-icon"></i>
                        <span class="menu-title">Nové napojení</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;