import React from 'react';
import ImageGallery from './imageGallery';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import video_img from '../../../assets/images/video-play.svg';

const VideoAndImages = ({ media }) => {
    
    let roomVideo = '';
    let roomImages = [];
    
    if(media){
        roomVideo = media.first_asset_url;
        roomImages = media.rest_assets_url;
    }

    return (
        <div className="section-video-images">
            {
                !media ?
                <div className="section-no-images">
                    <p>No Images/Video Available</p>
                </div> :
                <>
                    {
                        roomVideo ?  
                        <div className="video-container">
                            <Player
                                playsInline
                                poster={roomImages[0] ? roomImages[0] : video_img}
                                src={roomVideo}
                            />
                        </div> :
                        <div className="section-no-images section-no-video-room-details">
                            <p>No Video Available</p>
                        </div>
                    }
                    {
                        roomImages.length>0 &&
                        <div className="images-gallery-view-care">
                            <ImageGallery gallery={roomImages} />
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default VideoAndImages;