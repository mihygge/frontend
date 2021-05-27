import React from 'react';
import FormInput from '../../../../shared/formInput';

const PriceRange = (props) => {
    return (
        <div className="section-checks">
            <div className="section-checks-common">
                <FormInput labelText="Min" placeholder="Min" name="min" id="min" className="field-beds" />
                <FormInput labelText="Max" placeholder="Max" name="max" id="max" className="field-beds" />
            </div>
        </div>
    )
}

export default PriceRange;

