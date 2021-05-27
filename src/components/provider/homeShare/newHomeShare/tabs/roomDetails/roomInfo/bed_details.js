import React, { useState, useEffect } from 'react';
import FormInput from '../../../../../../shared/formInput';
import FormSelect from '../../../../../../shared/formSelect';

const BedDetails = (childProps) => {
    const { form, available_services } = childProps
    const { errors, setFieldValue, values } = form
    const beds_attributes = form.values?.beds_attributes
    const [isAddMoreDisabled, setIsAddMoreDisabled] = useState(true);
    const [bedNumber, setBedNumber] = useState(0);
    
    const bed_type_options = [
        {value: 'king', label: 'King'},
        {value: 'queen', label: 'Queen'},
        {value: 'twin', label: 'Twin'},
        {value: 'hospital', label: 'Hospital'}
    ]
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
                            <FormInput name={`beds_attributes.${index}.bed_number`} type="text" labelText="Bed Number/ID" placeholder="Enter bed number here" required="required" />
                            <FormSelect name={`beds_attributes.${index}.bed_type`} labelText="Bed Type" placeholder="Select bed type" 
                                onChange={(data) => {setFieldValue(`beds_attributes.${index}.bed_type`, data.value)} }  
                                value={bed_type_options.find((o) => o.value === values?.['beds_attributes']?.[index]?.['bed_type'] ) } 
                                options={bed_type_options} error={errors?.beds_attributes?.[index]?.['bed_type'] } required="required" />
                            <FormSelect
                                name={`beds_attributes.${index}.service_id`}
                                labelText="Care Type" placeholder="Select care type" 
                                onChange={(data) => {setFieldValue(`beds_attributes.${index}.service_id`, data.value)} } 
                                value={service_type_options.find((o) => o.value === values?.['beds_attributes']?.[index]?.['service_id'] ) }
                                options={service_type_options}
                                error={errors?.beds_attributes?.[index]?.['service_id']}
                                required="required"
                            />
                            { beds_attributes.length > 1 ? <button type="button" className="btn btn-theme btn-remove-bed btn-danger" onClick={(e) => { childProps.remove(index); e.preventDefault(); return false } }> Remove Bed</button> : ""}
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
        </React.Fragment>

    )
}

export default BedDetails