import React, { useEffect, useReducer, useRef } from 'react';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import cogoToast from 'cogo-toast';
import './_bookings.scss';

import BookingsNav from './bookingsNav';
import DetailsCard from './detailsCard';
import Pagination from '../../shared/pagination/pagination';

import { viewBookingsApi, cancelBookingApi } from '../../../api/customer';

const bookingsReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, isLoading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                bookings: action.payload.data,
                meta: action.payload.meta,
            };
        case 'SET_PAGE':
            return { ...state, isLoading: true, page: action.payload };
        case 'SET_TAB':
            return { ...state, isLoading: true, page: 1, activeTab: action.payload };
        case 'REPLACE_BOOKING':
            const bookingsCpy = [...state.bookings];
            const booking = action.payload;
            const idx = bookingsCpy.findIndex((b) => b.id === booking.id);
            if (idx > -1) {
                bookingsCpy.splice(idx, 1, booking);
            }
            return { ...state, bookings: bookingsCpy };
        default:
            return state;
    }
};

const Bookings = () => {
    const [userDetails] = useLocalStorage('userDetails', {});
    const userId = useRef(userDetails?.id);

    const [
        {
            bookings,
            meta: { per_page: recordsPerPage, 'total-records': totalRecords },
            page,
            activeTab,
            isLoading,
        },
        dispatch,
    ] = useReducer(bookingsReducer, {
        bookings: [],
        meta: {},
        page: 1,
        activeTab: null,
        isLoading: true,
    });

    const getBookings = async (params) => {
        const { hide: hideLoading } = cogoToast.loading('Loading...', { hideAfter: 0 });
        try {
            dispatch({ type: 'FETCH_INIT' });
            let response = await viewBookingsApi(userId.current, params);
            let sortedBooking = response.data.data.sort((a, b) => new Date(a.attributes.checkin) - new Date(b.attributes.checkin));
            response = {
                ...response,
                data: {
                    ...response.data,
                    data: sortedBooking
                }
            }  
            hideLoading();
            dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
        } catch (error) {
            console.log(error);
            error.handleGlobally && error.handleGlobally();
        }
    };

    const cancelBooking = async (booking) => {
        const { hide: hideLoading } = cogoToast.loading('Loading...', { hideAfter: 0 });
        try {
            const response = await cancelBookingApi(booking.id, 'cancelled');
            hideLoading();
            dispatch({ type: 'REPLACE_BOOKING', payload: response.data.data });
            cogoToast.success(`Booking(#${booking.bookingID}) cancelled.`);
        } catch (error) {
            console.log(error);
            error.handleGlobally && error.handleGlobally();
        }
    };

    useEffect(() => {
        getBookings({ page, filter: activeTab });
    }, [activeTab, page]);

    const handleCurrentPage = (page) => {
        dispatch({ type: 'SET_PAGE', payload: page });
    };

    const toggleTabs = (tab = null) => {
        if (activeTab !== tab) {
            dispatch({ type: 'SET_TAB', payload: tab });
        }
    };

    return (
        <div className="tabs-my-profile">
            <BookingsNav
                activeTab={activeTab}
                isLoading={isLoading}
                totalRecords={totalRecords}
                toggleTabs={toggleTabs}
            />
            <div className="tab-content">
                <div className="container-whishlist section-home-details container-bookings container-view-booking">
                    {isLoading || bookings.length === 0 ? (
                        <div className="section-cards-care section-no-care-message">
                            <span>{isLoading ? 'Loading...' : 'No bookings available'}</span>
                        </div>
                    ) : (
                        <>
                            {bookings.map((booking, index) => (
                                <DetailsCard
                                    key={index}
                                    activeTab={activeTab}
                                    bookingDetails={booking.attributes}
                                    cancelBooking={cancelBooking}
                                />
                            ))}
                            {totalRecords > recordsPerPage && (
                                <Pagination
                                    current={page}
                                    total={totalRecords}
                                    pageSize={recordsPerPage}
                                    onChange={handleCurrentPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
