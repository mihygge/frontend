import React, { useState, useEffect } from 'react';
import FormInput from '../../../../../../shared/formInput';
import FormSelect from '../../../../../../shared/formSelect';
import ConfirmationPop from '../../../../../../../modals/confirmationPop';

import {bedTypeOptions} from "../../../../../constants";

const UpdateBedDetails = (childProps) => {
    const { form, available_services, hasBooking } = childProps
    const { errors, setFieldValue, values } = form
    const beds_attributes = form.values?.beds_attributes
    const [isAddMoreDisabled, setIsAddMoreDisabled] = useState(true);
    const [bedNumber, setBedNumber] = useState(0);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [deleteBedIndex, setDeleteBedIndex] = useState(null);

    const toggleConfirmDeleteModal = (e, index) => {
        !confirmDeleteModalIsOpen && setDeleteBedIndex(index);
        setConfirmDeleteModalIsOpen(!confirmDeleteModalIsOpen)
    }

    const deleteBed = (e) => {
        e.preventDefault();
        childProps.remove(deleteBedIndex);
        if(beds_attributes[deleteBedIndex].id){
            form.values.destroyBed.push(beds_attributes[deleteBedIndex].id);
        }
        return false 
    }

    const service_type_options = available_services.map((e) => ({value: e.value, label: e.name}))

    useEffect(() => {
        const room_type = form.values.room_type;
        if(room_type){
            setIsAddMoreDisabled(false)
        }
        if (room_type === 'single') {
            setBedNumber(1);
        } else if(room_type === 'double'){
            setBedNumber(2)
        } else if(room_type === 'for-three'){
            setBedNumber(3)
        } else if(room_type === 'for-four' ){
            setBedNumber(4)
        }
    }, [form.values.room_type])

    return(
        <React.Fragment>
            <div className="multiple-inputs-holder">
                {
                    beds_attributes?.map((bed_attribute, index) => (
                        <div key={index} className="three-inputs-holder">
                            <FormInput
                                name={`beds_attributes.${index}.bed_number`}
                                type="text"
                                labelText="Bed Number/ID"
                                placeholder="Enter bed number here"
                                required="required"
                                disabled={hasBooking && !!beds_attributes[index].id}
                            />
                            <FormSelect
                                name={`beds_attributes.${index}.bed_type`}
                                labelText="Bed Type"
                                placeholder="Select bed type" 
                                onChange={(data) => setFieldValue(`beds_attributes.${index}.bed_type`, data.value)}
                                value={bedTypeOptions.find((o) => o.value === values?.['beds_attributes']?.[index]?.['bed_type'] ) } 
                                options={bedTypeOptions}
                                error={errors?.beds_attributes?.[index]?.['bed_type'] }
                                required="required"
                                isDisabled={hasBooking && !!beds_attributes[index].id}
                            />
                            <FormSelect
                                name={`beds_attributes.${index}.service_id`}
                                labelText="Care Type"
                                placeholder="Select care type" 
                                onChange={(data) => setFieldValue(`beds_attributes.${index}.service_id`, data.value)}
                                value={service_type_options.find((o) => o.value === values?.['beds_attributes']?.[index]?.['service_id'] ) }
                                options={service_type_options}
                                error={errors?.beds_attributes?.[index]?.['service_id']}
                                required="required"
                                isDisabled={hasBooking && !!beds_attributes[index].id}
                            />
                            { 
                                beds_attributes.length > 1 ? 
                                <button
                                    type="button"
                                    className="btn btn-theme btn-remove-bed btn-danger"
                                    onClick={(e) => {toggleConfirmDeleteModal(e, index)}}
                                    disabled={hasBooking && !!beds_attributes[index].id}
                                >
                                    Remove Bed
                                </button> : ""
                            }
                        </div>
                    )) 
                }
                {
                    errors['available_beds'] ? (<span className="error-message">{errors['available_beds']}</span>) : null
                }
            </div>
            {
                (bedNumber === 0 || beds_attributes?.length < bedNumber) ?
                    <button 
                        type="button"
                        disabled={isAddMoreDisabled}
                        className="btn-theme btn-transparent"
                        onClick={(e) => {
                            childProps.push({
                                bed_type: "",
                                bed_number: ""
                            });
                        }}
                    >
                        Add More
                    </button>
                : ""
            }
            <ConfirmationPop
                isOpen={confirmDeleteModalIsOpen}
                toggle={toggleConfirmDeleteModal}
                confirmationDesc={'bed delete'}
                executeOnConfirm={deleteBed}
            />
        </React.Fragment>

    )
}

export default UpdateBedDetails;