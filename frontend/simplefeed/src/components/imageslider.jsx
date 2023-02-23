import React from 'react';
import SimpleImageSlider from "react-simple-image-slider";

function ProductImages(props){
    return (
        <div className='col-lg-6'>
            <div className='card'>
                <div className='card-body'>
                    <SimpleImageSlider 
                        width={500} 
                        height={500} 
                        images={props.data} 
                        showBullets={true} 
                        showNavs={true}
                        autoPlay={true}
                        autoPlayDelay={10.0}/>
                </div>
            </div>
        </div>
    );
}

export default ProductImages;