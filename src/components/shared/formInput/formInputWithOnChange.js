import React, { Component } from 'react';
import {  Field, ErrorMessage } from 'formik';
import cx from 'classnames';

export default class FormInputWithOnChange extends Component {
    render() {
        const { name, type, placeholder, id, conditionalClass, labelText, required, className, disabled, onChange, onKeyDown } = this.props
        return (
            // FE ToDo: 'form-error' class needs to be added conditionally
            <div className={cx("form-group", className)}>
                {
                    labelText ? <label>{labelText} {required ? <sup>*</sup> : null}</label> : null
                }
                <Field
                    name={name}
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    className={cx("form-control", conditionalClass)}
                    disabled={disabled}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
                <ErrorMessage
                    name={name}
                    component="span"
                    className="error-message"
                />
            </div>
        )
    }
}
