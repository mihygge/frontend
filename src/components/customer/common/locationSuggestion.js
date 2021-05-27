import React, { useState, useEffect } from 'react';
import FormInputWithOnChange from '../../shared/formInput/formInputWithOnChange';
import SearchIcon from '../../../assets/images/searchIcon.svg';
import { Formik, Form } from 'formik';
import { withRouter } from 'react-router-dom';
import { handleLocationSuggestion } from './locationSuggestionUtils';
import './_location-suggestion.scss';
import { homePageSearch } from '../../../forms/validations/customer/homePageSearch.validation';
import LocationSuggestionList from './LocationSuggestionList';

const LocationSuggestion = (props) => {

    const [locationSuggestionList, setLocationSuggestionList] = useState(null);
    const [isSuggestionEnabled, setIsSuggestionEnabled] = useState(false);

    useEffect(() => {
        if(locationSuggestionList?.length>0){
            setIsSuggestionEnabled(true)
        }
    }, [locationSuggestionList])

    const initialValues = {
        location: '',
        type: '',
    }

    return (
        <div className="search-holder">
            <Formik
                initialValues={initialValues}
                validationSchema={homePageSearch}
                onSubmit={async(values, actions) => {
                    const { location, type } = values;
                    props.history.push(`/customer-search?location=${location}&type=${type}`)
                    props.history.go()
                }}
            >
            {({ setFieldValue }) => {
                return(
                <Form>
                    <div className="customised-search-container">
                        <FormInputWithOnChange
                            type="text"
                            name="location"
                            id="location"
                            placeholder="Search by location(City, State, County, Zipcode)"
                            onChange={(e) => {handleLocationSuggestion(e, setFieldValue, setLocationSuggestionList)}}
                        />
                        {
                            isSuggestionEnabled && locationSuggestionList &&
                            <LocationSuggestionList
                                locationSuggestionList={locationSuggestionList}
                                setFieldValue={setFieldValue}
                                setIsSuggestionEnabled={setIsSuggestionEnabled}
                            />
                        }
                    </div>
                    <button className="btn-theme btn-no-box icon-search"><img src={SearchIcon} alt="Search Icon" /></button>
                </Form>
                )
            }}
            </Formik>
        </div>
    )
}

export default withRouter(LocationSuggestion);