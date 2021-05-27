import React from 'react';
import { searchFilterDistance } from '../../../../../constants/customer/searchFiltersValues'

const Distance = (props) => {

    const { values, setFieldValue } = props;

    const handleInputChange = (e, setFieldValue) => {
        setFieldValue('distance', e.target.id)
    }
    
    return (
        <div className="radio-btns-wrapper">
            {
                !!searchFilterDistance?.length &&
                searchFilterDistance.map((filter, index) => (
                    <label key={index} className="radio-wrapper">
                        {filter.label}
                        <input
                            type="radio"
                            name={filter.id}
                            id={filter.id}
                            checked={values?.distance === filter.id}
                            onChange={(e) => {handleInputChange(e, setFieldValue)}}
                        />
                        <span className="checkmark"></span>
                    </label>
                ))
            }
        </div>
    )
}

export default Distance;