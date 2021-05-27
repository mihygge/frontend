import React from 'react';
import FormCheck from '../../../../shared/formCheckOrRadio';
import { searchFilterServices } from '../../../../../constants/customer/searchFiltersValues';

const Services = (props) => {

    const { values, setFieldValue, filterFormValues, handleCheckboxChange } = props;

    return (
        <div className="section-checks">
            <div className="section-checks-common">
                {
                    !!searchFilterServices?.length &&
                    searchFilterServices?.map((filter, index) => (
                        <FormCheck
                            key={index}
                            type="checkbox"
                            name={filter.id}
                            id={filter.id}
                            labelText={filter.label}
                            checked={filterFormValues?.services?.[filter.id]}
                            onChange={(e) => {handleCheckboxChange(e, 'services', values, setFieldValue)}}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Services;

