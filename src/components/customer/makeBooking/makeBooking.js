import React from 'react';
import FacilityInfo from './staticContent';
import HomeDetails from './homeDetails';
import Filters from './filters';
import './_make-booking.scss';

const MakeBooking = (props) => {

    const { careOrHomes, currentPage, totatlRecords, recordsPerPage, 
        setCurrentPage, getCareOrHomesList, formValues, serviceTypeSLDescList, careType,
        filterFormValues, setFilterFormValues, filterValues, searchType } = props;

    const careTypeDesc = serviceTypeSLDescList?.get(careType)

    return (
        <div className="wrapper-make-booking">
            <div className="custom-container">
                {
                    careType && careTypeDesc &&
                    <FacilityInfo 
                        title={`What is ${careType}?`}
                        description={careTypeDesc}
                    />
                }
                {
                    <Filters
                        formValues={formValues}
                        getCareOrHomesList={getCareOrHomesList}
                        filterValues={filterValues}
                        filterFormValues={filterFormValues}
                        setFilterFormValues={setFilterFormValues}
                    />
                }
                {
                    <HomeDetails
                        careOrHomes={careOrHomes}
                        currentPage={currentPage}
                        totatlRecords={totatlRecords}
                        recordsPerPage={recordsPerPage}
                        setCurrentPage={setCurrentPage}
                        getCareOrHomesList={getCareOrHomesList}
                        formValues={formValues}
                        filterFormValues={filterFormValues}
                        searchType={searchType}
                    />
                }
            </div>
        </div>
    )
}

export default MakeBooking;