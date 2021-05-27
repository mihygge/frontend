import React from "react";
import "./_image-gallery.scss";

const ImageGallery = (props) => {
    return (
        <div className="slider-rooms">
            {    
                props.gallery.map((imgUrl, index) => (
                    <img src={imgUrl} alt="Room" key={index} /> 
                ))
            }
        </div>
    )
}

export default ImageGallery;