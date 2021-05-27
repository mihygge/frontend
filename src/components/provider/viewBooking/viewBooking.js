import React, { useCallback, useEffect, useState, useRef } from 'react';
import FormSelect from '../../shared/formSelect';
import FormInput from '../../shared/formInput';
import SearchIcon from '../../../assets/images/searchIcon.svg';
import { Formik, Form } from 'formik';
import CardBooked from './cardBooked';
import cogoToast from 'cogo-toast';
import Pagination from '../../shared/pagination/pagination';
import './_view-booking.scss';

import { careTypeOptions, statusOptions } from '../../../constants/booking';

import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import {
    viewBookingsApi,
    bookingDocsReceivedApi,
    bookingStatusUpdateApi,
} from '../../../api/provider';

const ViewBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        page: 1,
        booking_id: null,
        category: null,
        status: null,
    });
    const [{ id: userID }] = useLocalStorage('userDetails', {});
    const userId = useRef(userID);
    const initialValues = useRef({ search: '' });

    const providerBookingsApi = useCallback(viewBookingsApi, []);
    const docsReceivedApi = useCallback(bookingDocsReceivedApi, []);
    const updateStatusApi = useCallback(bookingStatusUpdateApi, []);

    const loadingFactory = () => cogoToast.loading('Loading...', { hideAfter: 0 });

    const getProviderBookings = useCallback(
        async (filters) => {
            const { hide: hideLoading } = loadingFactory();
            try {
                setIsLoading(true);
                const response = await providerBookingsApi(userId.current, filters);
                hideLoading();
                setIsLoading(false);
                setBookings(response.data.data);
                setRecordsPerPage(response.data.meta['per_page']);
                setTotalRecords(response.data.meta['total-records']);
            } catch (error) {
                hideLoading();
                error.handleGlobally && error.handleGlobally();
                console.log(error);
            }
        },
        [providerBookingsApi],
    );

    const handleDocsReceived = async (booking) => {
        const { hide: hideLoading } = loadingFactory();
        try {
            const response = await docsReceivedApi(booking.id);
            hideLoading();
            mutateBookings(response.data.data);
        } catch (error) {
            hideLoading();
            error.handleGlobally && error.handleGlobally();
            console.log(error);
        }
    };

    const handleStatusChange = async (booking, status) => {
        const { hide: hideLoading } = loadingFactory();
        try {
            const response = await updateStatusApi(booking.id, status);
            hideLoading();
            mutateBookings(response.data.data);
        } catch (error) {
            hideLoading();
            error.handleGlobally && error.handleGlobally();
            console.log(error);
        }
    };

    const mutateBookings = (booking) => {
        const bookingsCpy = [...bookings];
        const idx = bookings.findIndex((b) => b.id === booking.id);
        if (idx > -1) {
            bookingsCpy.splice(idx, 1, booking);
            setBookings(bookingsCpy);
        }
    };

    // This will be triggered whenever filters change.
    // i.e., page change, select filter change and search by booking_id change.
    useEffect(() => {
        getProviderBookings(filters);
    }, [getProviderBookings, filters]);

    const handleCurrentPage = (page) => {
        setFilters({ ...filters, page });
    };

    const onCareTypeChange = ({ value: category }) => {
        setFilters({ ...filters, page: 1, category });
    };

    const onStatusFilterChange = ({ value: status }) => {
        setFilters({ ...filters, page: 1, status });
    };

    const onSearchChange = ({ search: booking_id }) => {
        setFilters({ ...filters, page: 1, booking_id });
    };

    return (
        <div className="container-senior-living container-view-booking">
            <div className="section-title">
                <h2 className="title">Bookings</h2>
            </div>
            <div className="section-filters">
                <FormSelect
                    placeholder="Search by care type"
                    options={careTypeOptions}
                    classNameOut="provider-type"
                    onChange={onCareTypeChange}
                    isDisabled={isLoading}
                />
                <FormSelect
                    placeholder="Search by status"
                    options={statusOptions}
                    classNameOut="provider-type status"
                    onChange={onStatusFilterChange}
                    isDisabled={isLoading}
                />
                <div className="search-by-id">
                    <Formik initialValues={initialValues.current} onSubmit={onSearchChange}>
                        <Form>
                            <FormInput
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Search by booking id"
                                disabled={isLoading}
                            />
                            <button type="submit" className="btn-theme btn-no-box icon-search">
                                <img src={SearchIcon} alt="Search Icon" />
                            </button>
                        </Form>
                    </Formik>
                </div>
            </div>
            {isLoading || bookings.length === 0 ? (
                <div className="section-cards-care section-no-care-message">
                    <span>{isLoading ? 'Loading...' : 'No bookings available'}</span>
                </div>
            ) : (
                <div className="section-booking-cards">
                    {bookings.map((booking) => {
                        return (
                            <CardBooked
                                key={booking.id}
                                booking={booking.attributes}
                                handleDocsReceived={handleDocsReceived}
                                handleStatusChange={handleStatusChange}
                            />
                        );
                    })}
                </div>
            )}

            {totalRecords > 20 && (
                <Pagination
                    current={filters.page}
                    total={totalRecords}
                    onChange={handleCurrentPage}
                    pageSize={recordsPerPage}
                />
            )}
        </div>
    );
};

export default ViewBooking;
