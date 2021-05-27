import React from 'react';
import DetailsCard from './detailsCard';
import Pagination from '../../../shared/pagination/pagination';

const HomeDetails = (props) => {

    const { careOrHomes, currentPage, totatlRecords, recordsPerPage, setCurrentPage, getCareOrHomesList, formValues,
        filterFormValues, searchType } = props;

    const handleCurrentPage = (page) => {
        setCurrentPage(page);
        const values = searchType==='main' ? formValues : filterFormValues;
        getCareOrHomesList(values, page, 'result_page')
    }

    return (
        <div className="section-home-details">
            {
                !!careOrHomes?.length &&
                careOrHomes.map((careOrHome) => (
                    <DetailsCard
                        key={careOrHome.id}
                        careOrHomeDetails={careOrHome}
                        formValues={formValues}
                    />
                ))
            }
            {
                careOrHomes?.length===0 &&
                <div className="section-home-details section-no-home-message">
                    <span>
                        No results found
                    </span>
                    <p>Please change your dates or refine your filters.</p>
                </div>
            }
            {
                totatlRecords>recordsPerPage &&
                <Pagination
                    current={currentPage}
                    total={totatlRecords}
                    onChange={handleCurrentPage}
                    pageSize={recordsPerPage}
                />
            }
        </div>
    )
}

export default HomeDetails;