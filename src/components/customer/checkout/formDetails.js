import React, { useState, useEffect } from 'react';
import FormInput from '../../shared/formInput';
import { Formik, Form, ErrorMessage } from 'formik';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import FormCheck from '../../shared/formCheckOrRadio';
import { relationshipsForBookingListApi } from '../../../api/customer/checkout';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import { Input } from 'reactstrap';
import InputMask from 'react-input-mask';
import { Nav, NavItem, NavLink, } from 'reactstrap';
import RoomDetailsTable from './roomDetailsTable';
import { customerCheckout } from '../../../forms/validations/customer/customerCheckout.validation'
import { addBookingApi } from '../../../api/customer/addBooking';
import { withRouter } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import DatePicker from 'react-datepicker';

const changeDateFormat = (ddmmyy) => {
    const ddmmyyArr = ddmmyy.split('/');
    return `${ddmmyyArr[2]}-${ddmmyyArr[1]}-${ddmmyyArr[0]}`
}

/* May required later
const changeDateToMMDDYYYY = (ddmmyy) => {
    const ddmmyyArr = ddmmyy?.split('/');
    return `${ddmmyyArr[1]}/${ddmmyyArr[0]}/${ddmmyyArr[2]}`
}
*/

const FormDetails = (props) => {

    const { bookingDetails, noOfGuest } = props

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [maskedMobileNumber, setMaskedMobileNumber] = useState('');
    const [timeOfArrival, setTimeOfArrival] = useState(new Date());
    const toggle = () => setDropdownOpen(prevState => !prevState);

    useEffect(() => {
        getRelationshipsForBookingList();
    }, [])

    const [relationshipsForBookingList, setRelationshipsForBookingList] = useState(null);
    const getRelationshipsForBookingList = async() => {
        try{
            const response = await relationshipsForBookingListApi();
            setRelationshipsForBookingList(response.data);
        }
        catch(error){
            console.log(error);
        }
    }

    const [userDetail] = useLocalStorage('userDetails', {})
    const userId = userDetail.id
    const emailID = userDetail.email;

    const initialValues = {
        first_name: '',
        last_name: '',
        no_of_guests: noOfGuest,
        relationship: '',
        other_relation: '',
        email: emailID,
        mobile: '',
        arrival_time: new Date(),
        otherSelected: false,
    }

    const [formValues, setformValues] = useState(initialValues);

    const handleRelationship = (e, setFieldValue, values) => {
        const relationship = 'relationship';
        setFieldValue(relationship, {
            ...values?.[relationship],
            [e.target.id]: e.target.checked
        })
        if(e.target.id==='others' && !e.target.checked){
            setFieldValue('other_relation', '')
            setformValues({
                ...values,
                relationship: {
                    ...values?.[relationship],
                    [e.target.id]: e.target.checked
                },
                other_relation: ''
            })
        }
        else if(e.target.id==='others' && e.target.checked){
            setFieldValue('otherSelected', true)
            setformValues({
                ...values,
                otherSelected: true
            })
        }
        else{
            setformValues({
                ...values,
                relationship: {
                    ...values?.[relationship],
                    [e.target.id]: e.target.checked
                }
            })
        }
    }

    const handleMobileChange = (e, setFieldValue) => {
        setFieldValue('mobile', e.target.value)
        setMaskedMobileNumber(e.target.value);
    }
    
    const handleTimeChange = (e, setFieldValue) => {
        const date = e ? e : '';
        setFieldValue('arrival_time', date)
        setTimeOfArrival(date);
    }
    
    return (
        <div>
            <Formik
                initialValues={formValues}
                validationSchema={customerCheckout}
                onSubmit={async(values, actions) => {
                    const maskedMobileNumber = values.mobile;
                    if(values.mobile){
                        const unmaskedMobileNumber = values.mobile.match(/[0-9]/gi).join('');
                        values.mobile = unmaskedMobileNumber;
                    }

                    const { first_name, last_name, email, mobile, arrival_time, no_of_guests, relationship, other_relation } = values;
                    const { checkin, checkout, serviceId, selectedBed, price_dec } = bookingDetails

                    const bedIds = []
                    selectedBed.forEach(bed => bedIds.push({'bed_id': bed.bed_id}))

                    const bookingValues = {
                        first_name, last_name, email, mobile, no_of_guests, other_relation,
                        relationship_ids: relationship && Object.keys(relationship)?.filter(key => key!=='others' && relationship[key] === true)?.map(key => key),
                        arrival_time: `${arrival_time.getHours()}:${arrival_time.getMinutes()}`,
                        user_id: userId,
                        care_id: serviceId,
                        price_includes: price_dec,
                        checkin: checkin && changeDateFormat(checkin),
                        checkout: checkout && changeDateFormat(checkout),
                        bed_bookings_attributes: {...bedIds}
                    }
                    const requestBody = {
                        booking: {...bookingValues}
                    }
                    try{
                        const response = await addBookingApi(requestBody);
                        const bookingId = response.data.data.id;
                        window.open(`/bookings/${bookingId}/confirm`);
                    }
                    catch(error){
                        console.log(error);
                        cogoToast.error("Sorry, bed(s) already booked")
                        error.handleGlobally && error.handleGlobally();
                    }
                    values.mobile = maskedMobileNumber;
                }}
            >
                {({ setFieldValue, values, touched, errors }) => (
                <Form>
                    <div className="three-inputs-holder">
                        <FormInput
                            type="text"
                            name="first_name"
                            id="first_name"
                            placeholder="Enter your first name"
                            labelText="First Name"
                        />
                        <FormInput
                            type="text"
                            name="last_name"
                            id="last_name"
                            placeholder="Enter your last name"
                            labelText="Last Name"
                        />
                        <div className="third-panel-wrapper">
                            <FormInput
                                type="text"
                                name="no_of_guests"
                                id="no_of_guests"
                                disabled={true}
                                labelText="No. of Guests"
                            />
                            <div className="form-group">
                                <label>Booking for</label>
                                <Dropdown isOpen={dropdownOpen} toggle={toggle} className="booking-dropdown">
                                    <DropdownToggle>
                                        Choose from options
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <div className="dropdown-menu-wrapper">
                                        {
                                            relationshipsForBookingList?.length>0 &&
                                            relationshipsForBookingList.map((rel, index) => (
                                                <FormCheck
                                                    key={index}
                                                    type="checkbox"
                                                    id={rel.id}
                                                    name={rel.id}
                                                    labelText={rel.name}
                                                    checked={values?.relationship?.[rel.id]}
                                                    onChange={(e) => handleRelationship(e, setFieldValue, values)}
                                                />
                                            ))
                                        }
                                        <FormCheck
                                            type="checkbox"
                                            id="others"
                                            name="others"
                                            labelText="Others"
                                            checked={values?.relationship?.['others']}
                                            onChange={(e) => handleRelationship(e, setFieldValue, values)}
                                        />
                                        <FormInput
                                            disabled={!values?.relationship?.['others']}
                                            type="text"
                                            name="other_relation"
                                            id="other_relation"
                                            placeholder="Specify relationship"
                                        />
                                        </div>
                                    </DropdownMenu>
                                </Dropdown>
                                <ErrorMessage
                                    name="relationship"
                                    component="span"
                                    className="error-message"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="three-inputs-holder">
                        <FormInput
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Enter your Email ID"
                            labelText="Email ID"
                        />
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <Input
                                type="text"
                                name='mobile'
                                id="mobile"
                                placeholder="Enter your phone number"
                                tag={InputMask}
                                mask="(+9) 999-999-9999"
                                value={maskedMobileNumber}
                                onChange={(e)=>{handleMobileChange(e, setFieldValue)}}
                            />
                            <ErrorMessage
                                name="mobile"
                                component="span"
                                className="error-message"
                            />
                        </div>
                        <div className="form-group timepicker-wrapper">
                            <label>Arrival Time</label>
                            <DatePicker
                                name="arrival_time"
                                id="arrival_time"
                                selected={timeOfArrival}
                                className='form-control'
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={60}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                onChange={date => handleTimeChange(date, setFieldValue)}
                                placeholderText="HH:MM AM/PM"
                            />
                            {
                                touched['arrival_time'] &&
                                errors['arrival_time'] &&
                                <span className="error-message">{errors['arrival_time']}</span>
                            }
                        </div>
                    </div>

                    <div className="second-section-wrapper">
                        <div className="left-section-wrapper">
                            <div className="tabs-add-care nav-custom-tabs">
                                <Nav>
                                    <NavItem>
                                        <NavLink className="active nav-link">
                                            Room Details
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <RoomDetailsTable bookingDetails={ bookingDetails } />
                            </div>
                        </div>
                    </div>
                    {/* May required later */}
                    {/* {
                        new Date(changeDateToMMDDYYYY(bookingDetails.checkin)).toLocaleDateString('en-US') === (new Date()).toLocaleDateString('en-US') &&
                        'Non-Refundable'
                    } */}
                    <div className="btn-checkout-container">
                        <button className="btn-theme btn-checkout">Proceed to Payment</button>
                    </div>
                </Form>
                )}
            </Formik>
        </div>
    );
};

export default withRouter(FormDetails);