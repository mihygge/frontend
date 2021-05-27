import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CareCard from '../seniorLiving/careCard/';
import Pagination from '../../shared/pagination/pagination';
import { careListApi } from '../../../api/serviceListing';
import cx from 'classnames';
import cogoToast from 'cogo-toast';

import useLocalStorage from '../../../effects/LocalStorage/use-local-storage'

const HomeShare = (props) => {

    const [homeShareList, setHomeShareList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totatlRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [userDetail] = useLocalStorage('userDetails', {})
    const userId = userDetail.id;

    const path = props.location.pathname;

    useEffect(() => {
        if(path==='/provider/home-share'){
            getHomeShareList(1);
        }
    }, []);

    const getHomeShareList = async(page) => {
        const { hide: hideLoading } = cogoToast.loading("Loading...", { hideAfter: 0 });
        try{
            setIsLoading(true);
            const response = await careListApi('home_share', userId, page);
            hideLoading();
            setIsLoading(false);
            setHomeShareList(response.data.data);
            setRecordsPerPage(response.data.meta['per_page'])
            setTotalRecords(response.data.meta['total-records'])
        }
        catch(error){
            hideLoading();
            console.log(error)
        }
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page);
        getHomeShareList(page);
    }

    return (
        <div className="container-senior-living">
            <div className="section-title">
                <h2 className="title">Home Share</h2>
                <Link to="/provider/home-share/new-home-share" className="btn-theme medium-size">New Home</Link>
            </div>
            {
                homeShareList.length>0 &&
                    <div className={cx("section-cards-care", { "section-cards-care-without-pagination" : totatlRecords<=20 })}>
                        {
                            homeShareList.length>0 && 
                            homeShareList.map((homeShare, index) => (
                                <CareCard key={homeShare.id} careDetails={homeShare} type='home-share'/>
                            ))
                        }
                    </div>
            }
            {
                !isLoading && homeShareList.length===0 &&
                <div className="section-cards-care section-no-care-message">
                    <span>No Home added</span>
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

export default  HomeShare;
