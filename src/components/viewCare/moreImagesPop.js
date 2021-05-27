import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const MoreImagesPop = (props) => {
    const { serviceMoreImages, currentSelectedImage } = props;
    return(
        <Modal isOpen={props.isOpen} toggle={props.toggle} className="modal-more-images modal-mini">
            <ModalHeader>
                <button type="button" className="close" onClick={props.toggle}></button>
            </ModalHeader>
            <ModalBody>
                <Carousel showThumbs={false} selectedItem={currentSelectedImage}>
                    {
                        serviceMoreImages.length>0 &&
                        serviceMoreImages.map((imageUrl, index) => (
                            <div key={index}>
                                <img
                                    src={imageUrl}
                                    alt="Room Pic"
                                />
                            </div>
                        ))
                    }
                </Carousel>
            </ModalBody>
        </Modal>
    )
}

export default MoreImagesPop;