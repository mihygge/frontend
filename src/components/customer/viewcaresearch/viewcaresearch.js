import React, { useState, useEffect } from 'react';
import FormSelect from '../../shared/formSelect';
import FormInputWithOnChange from '../../shared/formInput/formInputWithOnChange';
import { careCategory, custSearchSLMenu, custSearchHSMenu } from '../../../constants/customerSearchDropDown';
import { Formik, Form } from 'formik';
import SearchIcon from '../../../assets/images/searchIcon.svg';
import DateRangePicker from '../../shared/dateRangePicker';
import { mainSearch } from '../../../forms/validations/customer/mainSearch.validations';
import { withRouter, Link } from 'react-router-dom';
import { handleLocationSuggestion } from '../common/locationSuggestionUtils';
import LocationSuggestionList from '../common/LocationSuggestionList';

const ViewCareSearch = (props) => {
    const { formValues, setFormValues, setCareType } = props;
    const [category, setCategory] = useState(formValues?.category?.value);
    const [customerSearchDropDown, setSustomerSearchDropDown] = useState([...custSearchSLMenu]);
    const [locationSuggestionList, setLocationSuggestionList] = useState(null);
    const [isSuggestionEnabled, setIsSuggestionEnabled] = useState(false);

    useEffect(() => {
        if(locationSuggestionList?.length>0){
            setIsSuggestionEnabled(true)
        }
    }, [locationSuggestionList])


    useEffect(() => {
        if(category === 'senior_living')setSustomerSearchDropDown(custSearchSLMenu);
        else if(category === 'home_share')setSustomerSearchDropDown(custSearchHSMenu);
    }, [category])

    const handleCategoryChange = (e, setFieldValue) => {
        setCategory(e.value);
        setFieldValue('category', e)
        let careTypeVal = '';
        let careTypeFormVal = '';
        if(e.value==='senior_living'){
            careTypeVal = 'Assisted Living'
            careTypeFormVal = {value: "Assisted Living", label:"Assisted Living"};
        }
        else{
            careTypeVal = '';
            careTypeFormVal = '';
        } 
        setFieldValue('care_types', careTypeFormVal)
        setCareType(careTypeVal)
        setFormValues({
            ...formValues,
            category: e,
            care_types: careTypeFormVal
        })
    }

    const handleCareTypeChange = (careTypes, setFieldValue) => {
        let careTypeFormVal = '';
        if(category==='home_share' && !(Array.isArray(careTypes) && careTypes.length)){
            careTypeFormVal = '';
        }
        else{
            if(category==='senior_living'){
                setCareType(careTypes.value)
            }
            careTypeFormVal = careTypes
        }
        setFieldValue('care_types', careTypeFormVal)
        setFormValues({
            ...formValues,
            care_types: careTypeFormVal
        })
    }

    const handleLocationChange = (e, setFieldValue, setLocationSuggestionList) => {
        setFieldValue('location', e.target.value)
        setFormValues({
            ...formValues,
            ...formValues,
            location: e.target.value,
            type: ''
        })
        handleLocationSuggestion(e, setFieldValue, setLocationSuggestionList)
    }
    
    const handleDatesChange = (value, setFieldValue) => {
        setFieldValue('checkin_checkout', value)
        setFormValues({
            ...formValues,
            checkin_checkout: value
        })
    }
    
    const handleBedNoChange = (e, setFieldValue) => {
        setFieldValue('bedsNo', e.target.value)
        setFormValues({
            ...formValues,
            bedsNo: e.target.value
        })
    }
    
    return (
        <div className="wrapper-banner-customer">
            <div className="custom-container">
                <div className="banner-customer">
                    <h1 className="title-main">Where would you like to live, retire, get care?</h1>
                    <section className="section-filters">
                        <Formik
                            enableReinitialize
                            initialValues={formValues}
                            validationSchema={mainSearch}
                            validateOnChange={false}
                            >
                            {(formikProps) => {
                                const { setFieldValue, values, errors, touched } = formikProps;
                                return(
                                <Form>
                                    <div className="filters-primary">
                                        <div className="filters-primary-inner">
                                            <FormSelect 
                                                name="category"
                                                placeholder="SENIOR LIVING"
                                                value={values?.category}
                                                options = {careCategory}
                                                classNameOut="selector-primary"
                                                error={errors?.category}
                                                onChange={(e) => {handleCategoryChange(e, setFieldValue)}}
                                            />
                                            <FormSelect 
                                                name="care_types"
                                                placeholder="Select.."
                                                value={values?.care_types}
                                                options = {customerSearchDropDown}
                                                isMulti = {category==='home_share'}
                                                classNameOut="selector-primary selector-multiple"
                                                error={errors?.care_types}
                                                onChange={(careTypes) => {handleCareTypeChange(careTypes, setFieldValue)}} 
                                            />
                                        </div>
                                    </div>
                                    <div className="filters-secondary">
                                        <div className="field-location customised-search-container">
                                            <FormInputWithOnChange
                                                type="text"
                                                name="location"
                                                id="location"
                                                placeholder="Search by location"
                                                onChange={(e) => {handleLocationChange(e, setFieldValue, setLocationSuggestionList)}}
                                            />
                                            {
                                                isSuggestionEnabled &&
                                                <LocationSuggestionList
                                                    locationSuggestionList={locationSuggestionList}
                                                    setFieldValue={setFieldValue}
                                                    setIsSuggestionEnabled={setIsSuggestionEnabled}
                                                />
                                            }
                                            <button className="btn-theme btn-no-box icon-search">
                                                <img src={SearchIcon} alt="Search Icon" />
                                            </button>
                                        </div>
                                        <div className="calendar">
                                            <DateRangePicker
                                                name="checkin_checkout"
                                                minDate={new Date()}
                                                from={values.checkin_checkout[0]}
                                                to={values.checkin_checkout[1]}
                                                onChange={(value) => {handleDatesChange(value, setFieldValue)}}
                                            />
                                            {
                                                touched['checkin_checkout'] &&
                                                errors['checkin_checkout'] &&
                                                <span className="error-message">{errors['checkin_checkout']}</span>
                                            }
                                        </div>
                                        <FormInputWithOnChange
                                            placeholder="No. of Beds"
                                            name="bedsNo"
                                            id="bedsNo"
                                            className="field-beds"
                                            onChange={(e) => {handleBedNoChange(e, setFieldValue)}}
                                        />
                                        <Link className="btn-theme btn-explore"
                                            to={{
                                                pathname: "/customer-search",
                                                state: values
                                            }}
                                        >Explore</Link>
                                    </div>
                                </Form>
                                )
                            }}
                        </Formik>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default withRouter(ViewCareSearch);