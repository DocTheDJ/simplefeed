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
import SupplierCategories from './pages/supplierCategories';
import PairingCategory from './pages/pairingCategory';
import Parameters from './pages/parameters';
import Manufacturers from './pages/manufacturers';
import Availabilities from './pages/availabilities';

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
                            {/* <Route path='/productlist/:type/:page/:approvement/:category/:supplier/:manufact/:query' element={<ProductList></ProductList>}></Route> */}
                            <Route path='/productlist' element={<ProductList></ProductList>}></Route>
                            <Route path='/test' element={<Test></Test>}></Route>
                            <Route path='/productdetail/:id' element={<ProductDetail></ProductDetail>}></Route>
                            <Route path='/variantdetail/:id' element={<VariantDetail></VariantDetail>}></Route>
                            <Route path='/categories' element={<EshopCategories></EshopCategories>}></Route>
                            <Route path='/suppliercategories' element={<SupplierCategories></SupplierCategories>}></Route>
                            <Route path='/pairingcategories' element={<PairingCategory></PairingCategory>}></Route>
                            <Route path='/parameters' element={<Parameters></Parameters>}></Route>
                            <Route path='/manufacturers' element={<Manufacturers></Manufacturers>}></Route>
                            <Route path='/availabilities' element={<Availabilities></Availabilities>}></Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;