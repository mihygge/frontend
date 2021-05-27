import React, {useState} from "react";
import "./_image-gallery.scss";
import BigImagePop from "../bigImagePop";

const ImageGallery = (props) => {
    
    const [modalImages, setModalImages] = useState(false);
    const [currentSelectedImage, setCurrentSelectedImage] = useState(0);

    const toggleImages = (selectedImageIndex) => {
        setModalImages(!modalImages);
        setCurrentSelectedImage(selectedImageIndex);
    }

    return (
        <div className="slider-rooms">
            {    
                props.gallery.map((imgUrl, index) => (
                    <img src={imgUrl} alt="Room" key={index} onClick={() => toggleImages(index)} /> 
                ))
            }
            <BigImagePop 
                isOpen={modalImages}
                toggle={toggleImages}
                gallery={props.gallery}
                currentSelectedImage={currentSelectedImage}
            />
        </div>
    )
}

export default ImageGallery;