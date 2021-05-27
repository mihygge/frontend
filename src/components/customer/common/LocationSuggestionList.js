import React from 'react';
import { handleSuggestionSelection } from './locationSuggestionUtils';
import { searchByLocationType } from '../../../constants/customer/customerConst';

const LocationTypeList = (props) => {
    const { type, locationSuggestionList, setFieldValue, setIsSuggestionEnabled } = props;
    return(
        <>
            {locationSuggestionList.filter(loc => loc.type === type)?.length > 0 ? <h3>{type}</h3> : ''}
            {
                locationSuggestionList?.length > 0 &&
                locationSuggestionList.filter(loc => loc.type === type).map((loc, index) => (
                    <li
                    key={index}
                    onClick={() => {handleSuggestionSelection(loc, setFieldValue, setIsSuggestionEnabled)}}
                    >
                    {loc.value}
                    </li>
                ))
            }
        </>
    );
}


const LocationSuggestionList = (props) => {
    const { locationSuggestionList } = props;
    return (
        <div className="customised-search-results">
            {
                locationSuggestionList?.length > 0 ?
                <>
                {
                    searchByLocationType.map((locationType, index) => (
                        <ul key={index}>
                            <LocationTypeList type={locationType} {...props} />
                        </ul>
                    ))
                }
                </> : locationSuggestionList?.length === 0 ? <ul><li className="no-results">Sorry, we cannot find anything that matches your search term.</li></ul> : ''
            }
        </div>
    )
}

export default LocationSuggestionList;
