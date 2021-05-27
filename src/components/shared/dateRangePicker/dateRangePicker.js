import React, { useState, useEffect } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import './_date-range-picker.scss';

const DateRangePickerCustom = (props) => {
    const { name, minDate, placeholderText, onChange, from, to } = props;

    const checkin = (from === undefined ? new Date() : new Date(from));
    let checkout = new Date(checkin);

    if (to === undefined) {
        checkout.setDate(checkout.getDate()+15);
        checkout = new Date(checkout);
    } else {
        checkout = new Date(to);
    }

    const [dateRange, setDateRange] = useState([checkin, checkout]);

    useEffect(() => {
        setDateRange([checkin, checkout]);
    },[from, to])
    
    useEffect(() => {
        onChange(dateRange); 
    }, [])

    const onRangeChange = (date) => {
        setDateRange(date);
        onChange(date);
    }

    return (
        <DateRangePicker
            name={name}
            value={dateRange}
            minDate={minDate}
            onChange={onRangeChange}
            aria-label="Date"
            placeholderText={placeholderText}
        />
    )
}

export default DateRangePickerCustom;