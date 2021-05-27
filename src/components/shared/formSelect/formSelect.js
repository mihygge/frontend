import React, { Component } from 'react';
import Select from 'react-select';
import cx from "classnames";

class FormSelect extends Component {
    render() {
        const { value, onChange, isDisabled, error, options, isMulti, isSearchable, placeholder, className, defaultValue, labelText, required, classNameOut } = this.props
        return (
            <div className={cx("form-group", classNameOut)}>
                {
                    labelText ? 
                    <label>
                        {labelText} 
                        {
                            required ? <sup>*</sup> : null
                        }
                    </label> : null
                }
                <Select classNamePrefix="select-dropdown"
                    className={cx("select-dropdown-container", className)}
                    onChange={onChange}
                    value={value}
                    isDisabled={isDisabled}
                    placeholder={placeholder}
                    options={options}
                    isMulti={isMulti}
                    isSearchable={isSearchable}
                    defaultValue={defaultValue}
                />
                {
                    error ? (<span className="error-message">{error}</span>) : null
                }
            </div>
        )
    }
}

export default FormSelect;