import React, { useState } from 'react';
import CancelBookingPop from '../cancelSubPop';
import capitalize from 'capitalize';
import { totalNoOfDates } from './utils';
import { Link } from 'react-router-dom';
import { formatCardDate, getDayFromDate } from '../../provider/viewBooking/utils';

const DetailsCard = (props) => {
    const { bookingDetails, cancelBooking, activeTab } = props;

    const {  
        bookingDetails : {
            bookingID, status, checkin, checkout, arrival_time, price_per_bed, first_name, last_name, 
            care_details,
            care_details: {
                id, name, image_url, state, approx_distance, no_of_beds, taxes_per_day, room_name, bed_details,
            },
        }
    } = props;

    const currentStatus = activeTab==='past' ? 'closed' : status;
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const totalDays = totalNoOfDates(checkinDate, checkoutDate);

    const [confirmationModal, setconfirmationModal] = useState(false);
    const toggleConfirmationModal = () => setconfirmationModal(!confirmationModal);

    return (
        <div className="room-details home-details card-bookings">
            <div className="section-img-details-brief">
                <div className="img-container">
                    <img src={image_url} alt="Home" />
                </div>
                <div className="details-brief">
                    <div className="details-top">
                        <h2>{name}</h2>
                        <div className="room-type">
                            <span>{capitalize(state)}</span>
                            {
                                approx_distance > 0 &&
                                <span>{approx_distance} miles from city centre</span>
                            }
                            <span>Booking ID - #{bookingID}</span>
                        </div>
                        <div className="status-booking">
                            Status - <span className={`status-${currentStatus}`}>{capitalize(currentStatus)}
                        </span></div>
                    </div>
                    <div className="details-bottom">
                        <div className="items-left items-list">
                            <div className="item">
                                <span className="title">Check-in</span>
                                <strong>{formatCardDate(checkinDate)}</strong>
                                {
                                    arrival_time &&
                                    <span>
                                        {`${getDayFromDate(checkinDate)} ${arrival_time}`}
                                    </span>
                                }
                            </div>
                            <div className="item">
                                <span className="title">Check-Out</span>
                                <strong>{formatCardDate(checkoutDate)}</strong>
                            </div>
                            <div className="item">
                                <span className="title">Room & Guest Details</span>
                                <strong className="room-info">
                                    <span>{`Room ID - ${room_name}`}</span>
                                    <span>{capitalize(care_details.room_type.split('-').join(' '))}</span>
                                    <span>{no_of_beds} {no_of_beds>1 ? 'beds' : 'bed'}</span>
                                </strong>
                                {
                                    bed_details?.length > 0 &&
                                    bed_details.map((bed, index) => (
                                        <strong className="room-info" key={index}>
                                            <span>{`Bed ID - ${bed.bed_number}`}</span>
                                            <span>{capitalize(bed.bed_type)}</span>
                                            <span>{capitalize(bed.service_name)}</span>
                                        </strong>
                                    ))
                                }
                                <span>{`${capitalize(first_name)} ${capitalize(last_name)}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="details-fee buttons-container">
                <strong className="amount-paid">{`Paid - $${((price_per_bed + taxes_per_day) * no_of_beds * totalDays).toFixed(2)}`}</strong>
                {
                    ['accepted', 'pending'].includes(status) &&
                    activeTab !== 'past' &&
                    <button
                        disabled={new Date() >= new Date(checkin)}
                        className="btn-theme btn-transparent btn-black"
                        onClick={toggleConfirmationModal}
                    >
                        Cancel
                    </button>
                }
                <Link
                    to={`/care/${id}`}
                    className="btn-theme btn-transparent"
                >
                    { activeTab !== 'past' ? 'View care' : 'Book again'}
                </Link>
            </div>
            <CancelBookingPop
                title="confirmed booking"
                toggle={toggleConfirmationModal}
                isOpen={confirmationModal}
                api={
                    async () => {
                    await cancelBooking(bookingDetails);
                    toggleConfirmationModal();
                }}
            />
        </div>
    );
};

export default DetailsCard;
