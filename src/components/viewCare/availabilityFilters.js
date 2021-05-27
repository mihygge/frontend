import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import FormSelect from '../shared/formSelect';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { availabilityFilters } from '../../forms/validations/customer/availabilityFilters.validation'

const AvailabilityFilters = (props) => {

    const { filterRooms, getAvailableBeds, checkin, checkout, beds } = props;

    const changeDateToMMDDYYYY = (ddmmyy) => {
        const ddmmyyArr = ddmmyy?.split('/');
        return ddmmyy ? `${ddmmyyArr[1]}/${ddmmyyArr[0]}/${ddmmyyArr[2]}` : null;
    }
    
    const [dateRange, setDateRange] = useState([new Date(changeDateToMMDDYYYY(checkin)), new Date(changeDateToMMDDYYYY(checkout))]);
    const [totalBed, setTotalBed] = useState({value: beds, label:beds})

    useEffect(() => {
        setDateRange([new Date(changeDateToMMDDYYYY(checkin)), new Date(changeDateToMMDDYYYY(checkout))]);
    },[checkin, checkout])

    useEffect(() => {
        setTotalBed({value: beds, label:beds})
    }, [beds])

    const handleDatesChange = (value, setFieldValue) => {
        setFieldValue('available_date', value)
        setDateRange(value)
    }

    const handleBedChange = (value, setFieldValue) => {
        setFieldValue('no_of_beds', value)
        setTotalBed(value)               
    }

    const roomOptions = [
        {value: "1", label:"1"},
        {value: "2", label:"2"},
        {value: "3", label:"3"},
        {value: "4", label:"4"}
    ]

    return (
        <section className="section-availability-filters">
            <h2>Check Availability</h2>
            <Formik
                initialValues={{
                    available_date: dateRange,
                    no_of_beds: totalBed,
                }} 
                validationSchema={availabilityFilters}
                onSubmit={(values) => {
                    !!filterRooms && filterRooms({...values, no_of_beds: values?.no_of_beds?.value});

                    if(!!getAvailableBeds){
                        const{ available_date, no_of_beds } = values;
                        const checkin = available_date[0].toLocaleDateString('en-GB');
                        const checkout = available_date[1].toLocaleDateString('en-GB');
                        getAvailableBeds(checkin, checkout, no_of_beds.value);
                    }
                }}
            >
            
            {({ values, setFieldValue, touched, errors }) => (
                <Form className="form-filters">
                    <div className="calendar-input-holder calendar-input-holder-care">
                        <div className="calendar-room form-group">
                            <DateRangePicker 
                                name="available_date"
                                value={dateRange}
                                aria-label="Date"
                                placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                                minDate={new Date()}
                                onChange={(value) => {handleDatesChange(value, setFieldValue)}}
                            />
                            {
                                touched['available_date'] &&
                                errors['available_date'] &&
                                <span className="error-message">{errors['available_date']}</span>
                            }
                        </div>
                    </div>
                    <FormSelect
                        placeholder="Select.."
                        options={roomOptions}
                        classNameOut="select-guest"
                        name="no_of_beds"
                        error={errors?.no_of_beds}
                        value={totalBed}
                        onChange={(value) => {handleBedChange(value, setFieldValue)}}
                    />
                    <button type="submit" className="btn-theme btn-transparent">{props.text}</button>
                </Form>
            )}
                
            </Formik>
        </section>
    )
}

export default AvailabilityFilters;