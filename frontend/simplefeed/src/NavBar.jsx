import React, {useContext} from 'react';
import AuthContext from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import "./cssModules";
import Header from './header';
import Navigation from './navigation';
import Overview from './pages/overview';
import { Test } from './test';
import ProductList from './pages/productlist';
import ProductDetail from './pages/productdetail';
import VariantDetail from './pages/variantdetail';
import EshopCategories from './pages/eshopCategories';

function NavBar(){
    const {user} = useContext(AuthContext);

    if(user === null || user === undefined){
        return (
            <Test></Test>
        );
    }
    return (
        <div className="container-scroller">
            <Header></Header>
            <div className="container-fluid page-body-wrapper">
                <Navigation></Navigation>
                <div className="main-panel">
                    <div className="content-wrapper">
                        <Routes>
                            <Route path='/' element={<Overview></Overview>}></Route>
                            <Route path='/productlist/:type' element={<ProductList></ProductList>}></Route>
                            <Route path='/test' element={<Test></Test>}></Route>
                            <Route path='/productdetail/:id' element={<ProductDetail></ProductDetail>}></Route>
                            <Route path='/variantdetail/:id' element={<VariantDetail></VariantDetail>}></Route>
                            <Route path='/categories' element={<EshopCategories></EshopCategories>}></Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;