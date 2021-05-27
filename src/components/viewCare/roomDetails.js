import React, { useState, useEffect } from 'react';
import RoomDetailsModal from './viewRoom';
import capitalize from 'capitalize';
import cx from 'classnames';
import { viewRoomApi, viewAvailableBedsApi } from '../../api/viewRoom';
import useLocalStorage from '../../effects/LocalStorage/use-local-storage';
import cogoToast from 'cogo-toast';

const RoomDetails = (props) => {
    const { roomDetails, checkin, checkout, beds, careName, serviceId } = props;
    const [roomDetailsModalIsOpen, setroomDetailsModalIsOpen] = useState(false);
    const { id, name, image_url, price, room_type, bathroom_type, no_of_beds } = roomDetails;
    const [viewRoomDetails, setViewRoomDetails] = useState(null);
    const [availableBedDetails, setAvailableBedDetails] = useState([]);
    const [finalCheckin, setFinalCheckin] = useState(checkin);
    const [finalCheckout, setFinalCheckout] = useState(checkout);
    const [finalBeds, setFinalBeds] = useState(beds)
    const [userDetails] = useLocalStorage('userDetails', {});
    const userRole = userDetails.role;

    const toggleRoomDeatails = (roomId) => {
        !roomDetailsModalIsOpen && getViewRoomDetails(roomId);
        setroomDetailsModalIsOpen(!roomDetailsModalIsOpen);
    }

    const getViewRoomDetails = async(roomId) => {
        try{
            const response = await viewRoomApi(roomId);
            setViewRoomDetails(response.data);
            if(userRole!=='provider'){
                getAvailableBeds(checkin, checkout, beds);
                setAvailableBedDetails(response.data.bed_details);
            }
        }
        catch(error){
            console.log(error);
            error.handleGlobally && error.handleGlobally();
        }
    }

    const changeDateFormat = (ddmmyy) => {
        const ddmmyyArr = ddmmyy?.split('/');
        return `${ddmmyyArr[2]}-${ddmmyyArr[1]}-${ddmmyyArr[0]}`
    }

    const getAvailableBeds = async (checkin, checkout, beds) => {
        let queryParams = {
            from: checkin && changeDateFormat(checkin),
            to: checkout && changeDateFormat(checkout),
            room_id: id,
            no_of_beds: beds
        };
        setFinalCheckin(checkin);
        setFinalCheckout(checkout);
        setFinalBeds(beds);
        try{
            const response = await viewAvailableBedsApi(queryParams);
            setAvailableBedDetails(response.data);
            if(response.data===null){
                cogoToast.warn("Sorry, we cannot find anything that matches your selected date range. Please refine your dates and try again.")
            }
        }
        catch(error){
            console.log(error)
            error.handleGlobally && error.handleGlobally()
        }
    }
    
    useEffect(() => {
        if(userRole!=='provider' && viewRoomDetails && availableBedDetails?.length>0){
            setViewRoomDetails({
                ...viewRoomDetails,
                bed_details: availableBedDetails
            })
        }
        else if(availableBedDetails===null){
            setViewRoomDetails({
                ...viewRoomDetails,
                bed_details: []
            })
        }
    }, [availableBedDetails])

    return(
        <>
            <div className="room-details">
                <div className={cx("img-container", {"section-no-images" : !image_url})}>
                    {
                        image_url ? 
                        <img src={image_url} alt="Room" />
                        : <p>No Image Available</p>
                    }
                </div>
                <div className="details-brief">
                    <h2>{name && capitalize.words(name)}</h2>
                    <div className="room-type">
                        <span>Room type: {room_type && capitalize.words(room_type.split('-').join(' '))}</span>
                        <span>{no_of_beds} Beds left</span>
                        {
                            bathroom_type==='attached' && <span>Bathroom attached</span>
                        }
                    </div>
                </div>
                <div className="details-fee">
                    <div className="price">$ {price} <span>per day + taxes</span></div>
                    <button className="btn-theme" onClick={() => toggleRoomDeatails(id)}>View Room Details</button>
                </div>
            </div>
            {
                viewRoomDetails &&
                <RoomDetailsModal
                    isOpen={roomDetailsModalIsOpen}
                    toggle={toggleRoomDeatails}
                    roomName={name && capitalize.words(name)}
                    viewRoomDetails={viewRoomDetails}
                    checkin={finalCheckin}
                    checkout={finalCheckout}
                    beds={finalBeds}
                    serviceId={serviceId}
                    careName={careName}
                    getAvailableBeds={getAvailableBeds}
                />
            }
        </>
    )
}

export default RoomDetails;