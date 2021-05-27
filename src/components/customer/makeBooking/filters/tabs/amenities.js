import React from 'react';
import FormCheck from '../../../../shared/formCheckOrRadio';
import { searchFilterAmenities } from '../../../../../constants/customer/searchFiltersValues';

const Amenities = (props) => {

    const { values, setFieldValue, filterFormValues, handleCheckboxChange } = props;

    return (
        <div className="section-checks">
           <div className="section-checks-common">
                {
                    !!searchFilterAmenities?.length &&
                    searchFilterAmenities?.map((filter, index) => (
                        <FormCheck
                            key={index}
                            type="checkbox"
                            name={filter.id}
                            id={filter.id}
                            labelText={filter.label}
                            checked={filterFormValues?.amenities?.[filter.id]}
                            onChange={(e) => {handleCheckboxChange(e, 'amenities', values, setFieldValue)}}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Amenities;

