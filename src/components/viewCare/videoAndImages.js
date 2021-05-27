import React, { useState } from 'react';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import video_img from '../../assets/images/video-play.svg';
import MoreImagesPop from './moreImagesPop';
import cx from 'classnames';

const VideoAndImages = ({ media }) => {
    let serviceVideo = '';
    let serviceImages = [];
    let serviceFirstThreeImages = [];
    let serviceMoreImages = [];

    if(media){
        serviceVideo = media.first_asset_url;
        serviceImages = media.rest_assets_url;
    }

    const serviceImagesNumber = serviceImages.length;
    if(serviceImagesNumber > 3){
        serviceFirstThreeImages = serviceImages.slice(0,3);
        serviceMoreImages = serviceImages.slice(2);
    }
    else{
        serviceFirstThreeImages=serviceImages;
    }

    const [modalImages, setModalImages] = useState(false);
    const [currentSelectedImage, setCurrentSelectedImage] = useState(0);
    const toggleImages = (selectedImageIndex) => {
        setModalImages(!modalImages);
        setCurrentSelectedImage(selectedImageIndex);
    }

    return(
        <div className="section-video-images">
            {
                !media ?
                <div className="section-no-images">
                    <p>No Images/Video Available</p>
                </div> :
                <>
                    {
                        serviceVideo ? 
                        <div className="container-video">
                            <Player
                                playsInline
                                poster={serviceImages[0] ? serviceImages[0] : video_img}
                                src={serviceVideo}
                            />
                        </div> :
                        <div className="section-no-images section-no-video">
                            <p>No Video Available</p>
                        </div>
                    }
                    <div className="container-images">
                        {
                            serviceFirstThreeImages.length>0 &&
                            serviceFirstThreeImages.map((imageUrl, index) => (
                                <div key={index} className={cx({"more-than-three" : serviceImagesNumber > 3 && index===2 })}>
                                    <img src={imageUrl} alt="Room Pic" onClick={() => toggleImages(index)}/>
                                    {
                                        index===2 && serviceMoreImages.length>0 ?
                                        <button className="btn-theme btn-no-box" onClick={() => toggleImages(index)}>
                                            +{serviceMoreImages.length} Images
                                        </button> : null
                                    }
                                </div>
                            ))
                        }
                    </div>
                    {
                        (serviceFirstThreeImages.length>0 || serviceMoreImages.length>0) && 
                        <MoreImagesPop
                            isOpen={modalImages}
                            toggle={toggleImages}
                            serviceMoreImages={serviceImages}
                            currentSelectedImage={currentSelectedImage}
                        />
                    }
                </>
            }
        </div>
    )
}

export default VideoAndImages;