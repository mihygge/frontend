import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
   } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import successICon from '../assets/images/check.svg';
import getBookingApi from '../api/customer/getBookingApi';
import IconInfo from '../assets/images/icon-info.svg';
import form602 from '../assets/documents/LIC602A.pdf';


const UpgradePop = (props) => {
    const [booking, setBooking] = useState({});

    const redirectToBookings = () => {
        props.history.push('/account-details-customer')
        props.history.go()
    }

    const showBooking = () => {
        getBookingApi(props.bookingId)
            .then((res) => {
                setBooking(res.data)
            }).catch((error) => {
                console.log(error)
                error.handleGlobally && error.handleGlobally();
            })
    }

    useEffect(() => {
        showBooking()
    }, [])

    return(
        <React.Fragment>
            <Modal isOpen={props.isOpen} toggle={props.sendUpgpop} className="modal-success-info">
                <button type="button" className="close modal__close" onClick={() => redirectToBookings() }></button>
                <ModalHeader></ModalHeader>
                <ModalBody>
                    <div class="popupMid">
                        <div class="successPopInn">
                            <div className="container-success-icon">
                                <img src={successICon} alt="Success" />
                            </div>
                            <span> {booking.care_name} | Booking ID - #{booking.bookingID} | { booking.room } | {booking.no_of_beds} { booking.bed_type}</span>
                            <h4>Thank you! Your request for booking has been received..</h4>
                            <p>Please share with us the completed RCFE form of the customers/seniors within 72 hours to get it confirmed.</p>
                            <p className="info">
                                <img
                                    src={IconInfo}
                                    alt="Info Icon"
                                    style={{display:"inline-block"}}
                                /> Please mail the RCFE/Physician's report(Residential Care Facilities for the Elderly)/
                                <a href={form602} target="_blank" rel="noopener noreferrer">
                                    &nbsp;Form 602&nbsp;
                                </a>
                                and other relevant documents to the Senior Living/Care Provider in order to proceed with the next steps.
                            </p>
                        </div>
                    </div>
                    <div className="buttons-container">
                        <button className="btn-theme btn-transparent" onClick={() => redirectToBookings() }>Okay</button>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )

}

export default withRouter(UpgradePop);