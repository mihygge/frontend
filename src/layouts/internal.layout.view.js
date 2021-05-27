import React from 'react';
import Footer from '../components/commons/footer';
import ViewCare from '../components/viewCare';
import Values from '../components/commons/values';
import HeaderWithUser from '../components/commons/headerWithUserLogin';
import useLocalStorage from '../effects/LocalStorage/use-local-storage';

const InternalLayoutView = ({ location }) => {

    const [userDetail] = useLocalStorage('userDetails', {});
    const userName = `${userDetail.first_name} ${userDetail.last_name}`;
    const userRole = userDetail.role;
    
    return (
        <div className="layout-internal layout-internal-view-care">
            <HeaderWithUser user={userName}/>
            <ViewCare location={location}/>
            {
                userRole === 'provider' ? '' :
                <Values />
            }
            <Footer />
        </div>
    )
}

export default InternalLayoutView;
