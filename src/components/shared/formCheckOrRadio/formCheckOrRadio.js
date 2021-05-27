import React, { Component } from 'react';
import {ErrorMessage} from 'formik'
import cx from "classnames";

export default class FormCheckOrRadio extends Component {
    render() {
        const { labelText, type, id, onChange, applyClassName, name, value, checked, conditionalClass, className, disabled } = this.props;
        return (
            <div className={cx("form-group-radio-checkbox", className, conditionalClass)}>
                <div>
                    <input
                        name={name}
                        type={type}
                        id={id}
                        onChange={onChange}
                        value={value}
                        checked={checked}
                        className="form-control"
                        disabled={disabled}
                    />
                    {
                        labelText ? 
                        <label
                            htmlFor={id}
                            className={cx({ "selected": applyClassName })}>
                            {labelText}
                        </label> : null
                    }
                </div>
                <ErrorMessage
                    name={name}
                    component="span"
                    className="error-message"
                />
            </div>
        );
    }
}
