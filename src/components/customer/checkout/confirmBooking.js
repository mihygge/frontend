import React, { useEffect, useState } from 'react';
import {StripeProvider, Elements} from 'react-stripe-elements';
import BookingPaymentCard from './bookingPaymentCard';
import HeaderWithUser from '../../commons/headerWithUserLogin';
import { Nav, NavItem, NavLink, } from 'reactstrap';
import Copyrights from '../../commons/copyrights';
import getBookingApi from '../../../api/customer/getBookingApi';
import { withRouter } from 'react-router-dom';
import ExistingCardBookingPayment from './existingCardBookingPayment';
import cogoToast from 'cogo-toast';

const ConfirmBooking = (props) => {
    const path = props.location.pathname;
    const bookingId = path.match(/[0-9]/gi).join('');
    const [cardsClass, setCardsClass] = useState('')
    const [formClass, setFormClass] = useState('active nav-link')
    const [currentTab, setCurrentTab] = useState('cardForm')

    const makeActive = (tab) => {
        setCurrentTab(tab)

        if(tab === 'cards') {
            setCardsClass('active nav-link')
            setFormClass('nav-link')
        } else {
            setFormClass('active nav-link')
            setCardsClass('nav-link')
        }
    }

    const redirectToBookings = () => {
        props.history.push('/account-details-customer')
        props.history.go()
    }

    const showBooking = () => {
        getBookingApi(bookingId).then((res) => {
            if(res.data.status !== 'draft') {
                redirectToBookings();
            }
        }).catch(err => {
            cogoToast.error("Something went wrong please try later");
            redirectToBookings()
        })
    }

    useEffect(() => {
        showBooking()
    }, [])

    return (
        <div className="wrapper-account-details">
            <HeaderWithUser />
            <div className="wrapper-content">
                <div className="custom-container-checkout custom-container-checkout-customer">
                    <h2>Confirm Booking</h2>
                    <div className="tabs-add-care nav-custom-tabs">
                        <Nav>
                            <NavItem>
                                <NavLink className={formClass} onClick={() => makeActive('cardForm')}>
                                    Enter card details
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={cardsClass} onClick={() => makeActive('cards')}>
                                    Existing Cards
                                </NavLink>
                            </NavItem>
                        </Nav>
                        {
                            currentTab === 'cardForm' && 
                            <StripeProvider apiKey={process.env.REACT_APP_MIH_STRIPE_PK}>
                                <Elements>
                                    <BookingPaymentCard bookingId={bookingId}/> 
                                </Elements>
                            </StripeProvider>
                        }

                        {
                            currentTab === 'cards' &&
                                <ExistingCardBookingPayment bookingId={bookingId}/>
                        }
                    </div>
                </div>
            </div>
            <Copyrights />
        </div>
    )
}

export default withRouter(ConfirmBooking);