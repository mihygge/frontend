import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './_date-picker.scss';

class DatePickerComponent extends Component {

    render () {
        const { maxDate, minDate, placeholderText, onChange, selected } = this.props
        return (
            <DatePicker
                className="datepicker-field"
                onChange={onChange}
                selected={selected}
                maxDate={maxDate}
                minDate={minDate}
                placeholderText={placeholderText}
            />
        )
    }
}

export default DatePickerComponent;