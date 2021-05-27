import React, { useState, useEffect } from 'react';
import Back from '../shared/back';
import VideoAndImages from './videoAndImages';
import StaticContent from './staticContent';
import Facilities from './facilities';
import RoomDetails from './roomDetails';
import FacilitiesList from './facilitiesList';
import { viewServiceApi } from '../../api/viewService'
import capitalize from 'capitalize';
import CareDetails from './careDetails';
import { sortFacility } from './sortFacility';
import StaffDetails from './staffDetails';
import useLocalStorage from '../../effects/LocalStorage/use-local-storage';
import AvailabilityFilters from './availabilityFilters';
import filterRoomsApi from '../../api/customer/filterRoomsApi';
import ViewCareSearch from '../customer/viewcaresearch/viewcaresearch';
import { careCategory } from '../../constants/customerSearchDropDown';
import cogoToast from 'cogo-toast';

const Viewcare = (props) => {

    const checkinDate = new Date();
    let checkoutDate = new Date(checkinDate);
    checkoutDate.setDate(checkoutDate.getDate()+15);
    checkoutDate = new Date(checkoutDate);

    let initialValues = {
        location: '',
        care_types: {value: "Assisted Living", label:"Assisted Living"},
        checkin_checkout: [checkinDate, checkoutDate],
        category: {value: "senior_living", label:"SENIOR LIVING"},
        bedsNo: 1,
        no_of_beds: 1,
        type: '',
    }
    if(props.location.state !== undefined) {
        initialValues = {...props.location.state, no_of_beds: props.location.state.bedsNo}
    }

    const path = props.location.pathname;
    const serviceId = path.match(/[0-9]/gi).join('');
    const [serviceDetail, setServiceDetail] = useState(null);
    const [userDetails] = useLocalStorage('userDetails', {});
    const userRole = userDetails.role;
    const [rooms, setRooms] = useState([])
    const [formValues, setFormValues] = useState(initialValues);
    const [careType, setCareType] = useState('');
    const [checkin, setCheckin] = useState(initialValues.checkin_checkout[0]?.toLocaleDateString('en-GB'));
    const [checkout, setCheckout] = useState(initialValues.checkin_checkout[1]?.toLocaleDateString('en-GB'));
    const [beds, setBeds] = useState(initialValues.no_of_beds);

    let servicesList = [];
    servicesList = serviceDetail?.services_categorised.filter((service_category, index) => {
        return (Object.keys(service_category)[0] !== "Care Provided")
    })

    let staffDetails = [];
    let boardMembers = {
        "name": serviceDetail?.care_detail?.board_members,
        "staff_role": "Board Members"
    }
    staffDetails = serviceDetail?.staff_details;

    useEffect(() => {
        setCareType(props.location.state?.care_types?.value);
        getServiceDetails();
    }, []);

    const filterRooms = (values) => {
        const checkin = values.available_date[0].toLocaleDateString('en-GB');
        const checkout = values.available_date[1].toLocaleDateString('en-GB');

        const params = {
            from: checkin,
            to: checkout,
            care_id: serviceId,
            no_of_beds: values.no_of_beds 
        }

        setBeds(values.no_of_beds);
        setCheckin(checkin);
        setCheckout(checkout);

        const { hide: hideLoading } = cogoToast.loading("Searching...", { hideAfter: 0 });
        filterRoomsApi(params)
            .then((res) => {
                hideLoading();
                setRooms(res.data.searched_rooms_detail)
            })
            .catch(() => {
                hideLoading();
                setRooms([]);
                cogoToast.warn("Sorry, we cannot find anything that matches your selected date range. Please refine your dates and try again.");
            })
    }

    const getServiceDetails = async() => {
        try{
            const response = await viewServiceApi(serviceId, 'care_details');
            setServiceDetail(response.data);
            setRooms(response.data.care_room_details);
            if(userRole!=='provider'){
                const values = {
                    available_date: initialValues?.checkin_checkout,
                    no_of_beds: initialValues?.no_of_beds,
                }
                filterRooms(values);
            }
        }
        catch(error){
            console.log(error);
            error.handleGlobally && error.handleGlobally();
        }
    }

    return(serviceDetail &&
        <>
            { 
                userRole !== 'provider' ? 
                    <ViewCareSearch
                        formValues={formValues}
                        setFormValues={setFormValues}
                        setCareType={setCareType}
                    /> : null   
            }
            <div className="wrapper-view-room">
                <div className="custom-container">
                    {
                        userRole === 'provider' ? 
                        <div className="back-button-container">
                            <Back />
                        </div> : null
                    }
                    {
                        <VideoAndImages
                            media={serviceDetail.care_assets}
                        />
                    }
                    {
                        (serviceDetail.care_detail || serviceDetail.services_categorised) &&
                        <CareDetails
                            care_detail={serviceDetail.care_detail}
                            services_categorised={serviceDetail.services_categorised}
                            wishlisted={serviceDetail.wishlisted}
                            careId={serviceId}
                            userRole={userRole}
                        />
                    }
                    {
                        (serviceDetail.care_detail.description ||  serviceDetail.care_detail.area_description) &&
                        <StaticContent
                            description={serviceDetail.care_detail.description ? capitalize(serviceDetail.care_detail.description) : null}
                            area_description={serviceDetail.care_detail.area_description ? capitalize(serviceDetail.care_detail.area_description) : null}
                        />
                    }
                    {
                        serviceDetail.available_basic_facilities &&
                        <Facilities
                            availableFacilities={serviceDetail.available_basic_facilities}
                        />
                    }
                    {
                        userRole !== 'provider' &&
                            <AvailabilityFilters
                                text="Update & Search"
                                filterRooms={filterRooms}
                                checkin={checkin}
                                checkout={checkout}
                                beds={beds}
                            />
                    }
                    {
                        serviceDetail.care_room_details && rooms.length > 0 &&
                        <div className="section-room-details">
                            {
                                rooms.map((roomDetails, index) => (
                                    <RoomDetails
                                        key={index}
                                        serviceId={serviceId}
                                        roomDetails={roomDetails}
                                        checkin={checkin}
                                        checkout={checkout}
                                        beds={beds}
                                        careName={serviceDetail.care_detail.name}
                                    />
                                ))
                            }
                        </div>
                    }
                    {
                        serviceDetail.care_detail.care_detail_facilities &&
                        serviceDetail.care_detail.care_detail_facilities.length > 0 &&
                        sortFacility([{"Care Detail Facilities": serviceDetail.care_detail.care_detail_facilities}]) &&
                        <FacilitiesList
                            conditional_class = "list-care-details"
                            header={`Care Details in ${serviceDetail.care_detail.name}`}
                            facilities={[{"Care Detail Facilities": serviceDetail.care_detail.care_detail_facilities}]}
                        />
                    }
                    {
                        serviceDetail.facility_categorised &&
                        serviceDetail.facility_categorised.length > 0 &&
                        sortFacility(serviceDetail.facility_categorised) &&
                        <FacilitiesList
                            header={`Main Features in ${serviceDetail.care_detail.name}`}
                            facilities={serviceDetail.facility_categorised}
                        />
                    }
                    {
                        servicesList &&
                        servicesList.length > 0 &&
                        sortFacility(servicesList) &&
                        <FacilitiesList
                            header={`Main Services in ${serviceDetail.care_detail.name}`}
                            facilities={servicesList}
                        />
                    }
                    {
                        userRole === 'provider' &&
                        (boardMembers || (staffDetails && staffDetails.length>0)) &&
                        <StaffDetails
                            boardMembers={boardMembers}
                            staffDetails={staffDetails}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default Viewcare;