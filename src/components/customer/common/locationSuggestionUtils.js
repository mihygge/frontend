import capitalize from 'capitalize';
import { locationSuggestionApi } from '../../../api/customer/searchCategory';

export const handleLocationSuggestion = (e, setFieldValue, setLocationSuggestionList) => {
    const searchLocationFor = e.target.value;
    setFieldValue('location', searchLocationFor);
    setFieldValue('type', '');
    const isZipcode = searchLocationFor.match(/[\D]/gi) === null;
    if(!searchLocationFor){
        setLocationSuggestionList(null);
    }
    if(!isZipcode && searchLocationFor?.length>2){
        getLocationSuggestion(searchLocationFor, setLocationSuggestionList)
    }
    else if(isZipcode){
        setFieldValue('location', searchLocationFor);
        setFieldValue('type', 'zipcode');
    }
    else{
        setLocationSuggestionList(null)
    }
}

export const getLocationSuggestion = async(searchLocationFor, setLocationSuggestionList) => {
    try{
        const response = await locationSuggestionApi(searchLocationFor);
        setLocationSuggestionList(response.data)
    }
    catch(error){
        console.log(error);
    }
}

export const handleSuggestionSelection = (locationDetail, setFieldValue, setIsSuggestionEnabled) => {
    setFieldValue('location', capitalize.words(locationDetail?.value))
    setFieldValue('type', locationDetail?.type)
    setIsSuggestionEnabled(false);
}
