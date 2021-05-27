import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import capitalize from 'capitalize';
import classnames from 'classnames';
import { upperCase } from 'lodash';
import { totalNoOfDates } from '../../../accountDetailsCustomer/bookings/utils';
import { formatCardDate, getDayFromDate } from '../utils';

import AcceptDocsModal from './acceptDocsModal';
import CardButton from './button';
import FormCheck from '../../../shared/formCheckOrRadio';

const CardBooked = (props) => {
    const {
        booking,
        booking: { 
            first_name, last_name, mobile, price_per_bed,
            care_details,
            care_details: {
                no_of_beds, taxes_per_day, room_name, bed_details,
            }, 
        },
        handleDocsReceived,
        handleStatusChange,
    } = props;

    const [docsConfirmationOpen, setDocsConfirmationOpen] = useState(false);
    const toggleDocsConfirmationOpen = () => setDocsConfirmationOpen(!docsConfirmationOpen);

    const checkin = new Date(booking.checkin);
    const checkout = new Date(booking.checkout);
    const totalDays = totalNoOfDates(checkin, checkout)
    
    const providerAltered = ['accepted', 'rejected', 'terminated'].includes(booking.status);
    const docsReceivedDisabled = providerAltered || booking.doc_received;

    const care_types = care_details?.bed_details?.length > 0 &&
                        care_details.bed_details.map((bed, index) => (
                            bed.service_name
                        )).filter((x, i, a) => a.indexOf(x) === i)

    return (
        <div className="card-bookings room-details">
            <div className="card-booking-actions">
                {!providerAltered && (
                    <>
                        <CardButton
                            className="btn-accept"
                            displayStatus="Accept"
                            status="accepted"
                            booking={booking}
                            handleStatusChange={handleStatusChange}
                        />
                        <CardButton
                            className="btn-reject"
                            displayStatus="Reject"
                            status="rejected"
                            booking={booking}
                            handleStatusChange={handleStatusChange}
                        />
                    </>
                )}
                {booking.status === 'accepted' && (
                    <CardButton
                        className="btn-black btn-terminate"
                        displayStatus="Terminate"
                        status="terminated"
                        booking={booking}
                        handleStatusChange={handleStatusChange}
                    />
                )}
            </div>
            <div className="details-brief">
                <h2>{care_details.name}</h2>
                <div className="room-type">
                    <span>{capitalize(care_details.state)}</span>
                    {care_details.approx_distance > 0 && (
                        <span>{care_details.approx_distance} miles from city centre</span>
                    )}
                    <span>Booking ID - #{booking.bookingID}</span>
                </div>
                <span className="label-card">
                    {upperCase(care_details.category)} - {care_types.join(', ')}
                </span>
            </div>
            <div className="details-bottom">
                <div className="items-left items-list">
                    <div className="item">
                        <span className="title">Check-in</span>
                        <strong>{formatCardDate(checkin)}</strong>
                        {booking.arrival_time && (
                            <span>
                                {getDayFromDate(checkin)} {booking.arrival_time}
                            </span>
                        )}
                    </div>
                    <div className="item">
                        <span className="title">Check-Out</span>
                        <strong>{formatCardDate(checkout)}</strong>
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
                        <span>
                            {`${capitalize(first_name)} ${capitalize(last_name)} - ${mobile}`}
                        </span>
                    </div>
                </div>
                <div className="items-right items-list">
                    <div className="item">
                        <span className="title">Paid</span>
                        <strong>{`$${((price_per_bed + taxes_per_day) * no_of_beds * totalDays).toFixed(2)}`}</strong>
                    </div>
                    <div className="item">
                        <span className="title">Documents Received</span>
                        <Formik>
                            <Form>
                                <FormCheck
                                    type="checkbox"
                                    name="documents"
                                    className={classnames({
                                        'not-allowed': docsReceivedDisabled,
                                    })}
                                    checked={booking.doc_received}
                                    disabled={docsReceivedDisabled}
                                    onChange={({ target: { checked } }) =>
                                        !docsReceivedDisabled &&
                                        checked &&
                                        toggleDocsConfirmationOpen()
                                    }
                                />
                                <AcceptDocsModal
                                    isOpen={docsConfirmationOpen}
                                    toggle={toggleDocsConfirmationOpen}
                                    booking={booking}
                                    executeConfirm={handleDocsReceived}
                                />
                            </Form>
                        </Formik>
                    </div>
                    <div className="item">
                        <span className="title">Status</span>
                        <strong className={`status-${booking.status}`}>{booking.status}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardBooked;
