import React from 'react';
import FormCheck from '../../../../shared/formCheckOrRadio';
import { searchFilterLicenseType } from '../../../../../constants/customer/searchFiltersValues';

const License = (props) => {

    const { values, setFieldValue, filterFormValues, handleCheckboxChange } = props;

    return (
        <div className="section-checks">
            <div className="section-checks-common">
                {
                    !!searchFilterLicenseType?.length &&
                    searchFilterLicenseType?.map((filter, index) => (
                        <FormCheck
                            key={index}
                            type="checkbox"
                            name={filter.id}
                            id={filter.id}
                            labelText={filter.label}
                            checked={filterFormValues?.licence_type?.[filter.id]}
                            onChange={(e) => {handleCheckboxChange(e, 'licence_type', values, setFieldValue)}}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default License;

