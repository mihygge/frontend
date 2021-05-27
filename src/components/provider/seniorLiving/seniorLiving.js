import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CareCard from './careCard';
import Pagination from '../../shared/pagination/pagination';
import { careListApi } from '../../../api/serviceListing';
import cx from 'classnames';
import cogoToast from 'cogo-toast';

import useLocalStorage from '../../../effects/LocalStorage/use-local-storage'

const SeniorLiving = (props) => {
    const [seniorLivingList, setSeniorLivingList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totatlRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [userDetail] = useLocalStorage('userDetails', {})
    const userId = userDetail.id;

    const path = props.location.pathname;

    useEffect(() => {
        if(path==='/provider'){
            getSeniorLivingList(1);
        }
    }, []);

    const getSeniorLivingList = async(page) => {
        const { hide: hideLoading } = cogoToast.loading("Loading...", { hideAfter: 0 });
        try{
            setIsLoading(true);
            const response = await careListApi('senior_living', userId, page);
            hideLoading();
            setIsLoading(false);
            setSeniorLivingList(response.data.data);
            setRecordsPerPage(response.data.meta['per_page'])
            setTotalRecords(response.data.meta['total-records'])
        }
        catch(error){
            hideLoading();
            error.handleGlobally && error.handleGlobally() 
            console.log(error)
        }
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page);
        getSeniorLivingList(page);
    }

    return (
        <div className="container-senior-living">
            <div className="section-title">
                <h2 className="title">Senior Living</h2>
                <Link to="/provider/senior-living/add-new-care" className="btn-theme medium-size">Add New Care</Link>
            </div>
            {
                seniorLivingList.length>0 &&
                    <div className={cx("section-cards-care", { "section-cards-care-without-pagination" : totatlRecords<=20 })}>
                        {
                            seniorLivingList.length>0 &&
                            seniorLivingList.map((seniorLiving, _index) => (
                                <CareCard key={seniorLiving.id} careDetails={seniorLiving} type='senior-living'/>
                            ))
                        }
                    </div>
            }
            {
                !isLoading && seniorLivingList.length===0 &&
                    <div className="section-cards-care section-no-care-message">
                        <span>
                            No Care added
                        </span>
                    </div>
            }
            {
                totatlRecords>20 &&
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

export default  SeniorLiving;
