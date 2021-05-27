import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import VideoAndImages from './videoAndImages';
import BedDetails from './bedDetails';
import FacilitiesList from '../facilitiesList';
import { sortFacility } from '../sortFacility';

const RoomDetailsModal = ({ isOpen, toggle, roomName, viewRoomDetails, checkin, checkout, beds, careName, serviceId, getAvailableBeds }) => {
    const { room_assets, room_detail, bed_details, services_categorised } = viewRoomDetails;
    return (
        <Modal isOpen={isOpen} toggle={toggle} className="modal-view-room">
            <ModalHeader>
                <button type="button" className="close" onClick={toggle}></button>
            </ModalHeader>
            <ModalBody>
                {
                    <VideoAndImages
                        media={room_assets}
                    />
                }
                <h2 className="title-main">{roomName}</h2>
                {
                    bed_details &&
                    <BedDetails
                        bedDetails={bed_details}
                        roomDetail={room_detail}
                        checkin={checkin}
                        checkout={checkout}
                        beds={beds}
                        serviceId={serviceId}
                        careName={careName}
                        roomName={roomName}
                        getAvailableBeds={getAvailableBeds}
                    />
                }
                {
                    services_categorised &&
                    services_categorised.length > 0 &&
                    sortFacility(services_categorised) &&
                    <FacilitiesList
                        header={`All Facilities in ${roomName}`}
                        facilities={services_categorised}
                    />
                }
            </ModalBody>
        </Modal>
    )
}

export default RoomDetailsModal;