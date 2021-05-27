import React from 'react';
import {ErrorMessage} from 'formik'

const RadioButtons = (props) => {
    const { labelText, onClickVal, name, value, checked, required, onClickValForNonAvailable, error_message} = props;
    const not_available = name + "_notavailable"
    return (
        <div className="section-radio-buttons form-group">
            <label>
                {labelText}
                {required ? <sup>*</sup> : null}
            </label>
            <div className="radio-buttons">
                <div onClick={onClickVal}>
                    <input
                        name={name}
                        type="radio"
                        id={name}
                        value={value}
                        checked={checked}
                    />
                    <label
                        htmlFor="available">
                        Available
                    </label>
                </div>
                <div onClick={onClickValForNonAvailable}>
                    <input
                        name={name}
                        type="radio"
                        id={not_available}
                        value="null"
                        checked={!checked}
                    />
                    <label
                        htmlFor="not_available">
                        Not Available
                    </label>
                </div>
            </div>
            {error_message && <span className="error-message">{error_message}</span>}
        </div>
    );
}

export default RadioButtons;