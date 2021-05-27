import React from 'react';
import { Formik, Form, Field } from 'formik';
import FormInput from '../../../../shared/formInput';
import RadioButtons from '../../../../shared/radioButton';

const HomeDetails = () => {
    return (
        <div className="form-in-new-care form-in-new-care-details">
            <Formik initialValues={
                    {
                        total_rooms : "",
                        total_beds: "",
                        total_bathrooms: "",
                        total_restrooms: ""
                    }
                }
            >
                <Form>
                    <div className="section-top">
                        <div className="form-group">
                            <label>General Description <sup>*</sup></label>
                            <Field name="message">
                                {({ field, form }) => {
                                    return (
                                        <React.Fragment>
                                            <textarea
                                                {...field}
                                                className="form-control message-textarea"
                                                placeholder="Provide details on how your property differs from others what it offers..."
                                            />
                                            {form.touched[field.name] &&
                                                form.errors[field.name] && (
                                                    <span className="error-message">{form.errors[field.name]}</span>
                                                )}
                                        </React.Fragment>
                                    );
                                }}
                            </Field>
                        </div>
                    </div> 
                    <div className="section-bottom">
                        <div className="four-inputs-holder">
                            <FormInput type="text" labelText="Total Rooms" name="total_rooms" placeholder="Enter no. of total rooms" required />
                            <FormInput type="text" labelText="Total No. of Beds" name="total_beds" placeholder="Enter no. of bedrooms" required />
                            <FormInput type="text" labelText="Number of bathrooms" name="total_bathrooms" placeholder="Enter no. of bathrooms" required />
                            <FormInput type="text" labelText="Number of restrooms" name="total_restrooms" placeholder="Enter no. of restrooms" required />
                        </div>
                        <div className="section-radio-buttons">
                            <div className="two-inputs-holder">
                                <RadioButtons labelText="Dining room" name="dining_room" />
                                <RadioButtons labelText="Living room" name="living_room" />
                            </div>
                            <div className="two-inputs-holder">
                                <RadioButtons labelText="Kitchen" name="kitchen" />
                                <RadioButtons labelText="Parking Lot" name="parking_lot" />
                            </div>
                            <div className="two-inputs-holder">
                                <RadioButtons labelText="Patio" name="patio" />
                                <RadioButtons labelText="Garden Facility" name="garden_facility" />
                            </div>
                            <div className="two-inputs-holder">
                                <RadioButtons labelText="Green house" name="green_house" />
                                <RadioButtons labelText="Pool" name="pool" />
                            </div>
                            <div className="two-inputs-holder">
                                <RadioButtons labelText="Fountain" name="fountain" />
                                <RadioButtons labelText="Lawn" name="lawn" />
                            </div>
                            <div className="two-inputs-holder">
                                <RadioButtons labelText="Garden Bed" name="garden_bed" />
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default HomeDetails;