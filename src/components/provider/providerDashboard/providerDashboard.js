import React, { useEffect } from 'react';
import logo from '../../../assets/images/logo.png';
import NavMain from '../navMain';
import SeniorLiving from '../seniorLiving';
import HomeShare from '../homeShare';
import ViewBooking from '../viewBooking';
import AddNewCare from '../../../containers/providers/addNewCare.container';
import UserLog from '../../shared/userLog';
import { Route, Switch } from 'react-router-dom'
import getStaffRoles from '../../../api/staff/roles.api'
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage'
import Copyrights from '../../commons/copyrights';
import MediaQuery from 'react-media';
import AddHomeShareCare from '../../../containers/providers/addHomeShareCare.container';
import Back from '../../shared/back';

const ProviderHome = ({ location, match }) => {
    const [_, setRoles] = useLocalStorage('roles', '')
    useEffect(() => {
        getStaffRoles().then((res) => {
            const staff_roles_mapping =  res.data.reduce((map1, obj) => {map1[obj.name + ""] = obj.id; return map1}, {})
            setRoles(staff_roles_mapping)
        })
    }, [])

    return (
        <div className="wrapper-provider-dashboard">
            <div className="provider-dashboard container-full">
                <div className="column-side">
                    <div className="logo-container">
                        <a className="header-logo header-logo-provider" href="/">
                            <img src={logo} alt="Logo" />
                            <span>miHygge</span>
                        </a>
                        <MediaQuery query="(max-width: 767px)">
                            {
                                matches => matches ? ( 
                                    <UserLog />
                                ) : null
                            }
                        </MediaQuery>
                    </div>
                    <NavMain />
                </div>
                <div className="column-main">
                    <MediaQuery query="(min-width: 767px)">
                        {
                            matches => matches ? ( 
                                <div className="section-user-log">
                                    {/* May required later as per client suggestion  - pass a 'isHidden' param and write logic in that */}
                                    {/* {
                                        !(location.pathname==='/provider' || location.pathname==='/provider/home-share') ? <Back /> : ''
                                    } */}
                                    <Back isDisabled={location.pathname==='/provider' || location.pathname==='/provider/home-share'}/>
                                    <UserLog />
                                </div>
                            ) : null
                        }
                    </MediaQuery>
                    <Switch>
                        <Route exact path = {`${match.path}`} component = {SeniorLiving}/>
                        <Route exact path = {`${match.path}/home-share`} component = {HomeShare}/>
                        <Route exact path = {`${match.path}/view-booking`} component = {ViewBooking}/>
                        <Route exact path = {`${match.path}/senior-living/add-new-care`} component = {AddNewCare}/> 
                        <Route exact path = {`${match.path}/home-share/new-home-share`} component = {AddHomeShareCare}/> 
                        <Route exact path = {`${match.path}/senior-living/update/:careId`} component = {AddNewCare}/>   
                        <Route exact path = {`${match.path}/home-share/update/:careId`} component = {AddHomeShareCare}/> 
                    
                    </Switch>
                </div>
            </div>
            <Copyrights />
        </div>
    )
}

export default ProviderHome
