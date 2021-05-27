import React from 'react';
import { TabContent, TabPane } from 'reactstrap';

import ProfileAndLicenseDetails from './profileLicenseDetails';
import StaffDetails from './staffDetails';
import CareServiceProvided from './careServiceProvided';
import FacilitiesAndSafety from './facilitiesSafety';
import CareDetails from './careDetails';
import RoomDetails from './roomDetails';
import UpdateRoomDetails from './updateRoomDetails';

const TabsData = (props) => {
    const {tabData, bindSubmitForm, setactiveTab, setCareId, room_types, facilities, 
        provided_services, setCareName, isUpdate, setAvailableServices, setSaveNextButton, 
        setAvailableCareDetails, save_next_button_enabled} = props
    
    return (
        <TabContent activeTab={tabData.activeTab}>
                    <TabPane tabId="1">
                        <ProfileAndLicenseDetails
                            bindSubmitForm={bindSubmitForm}
                            setactiveTab={setactiveTab}
                            setCareId={setCareId}
                            setCareName={setCareName}
                            isUpdate={isUpdate}
                        />
                    </TabPane>
                    <TabPane tabId="2">
                        <StaffDetails
                            care_id={tabData.care_id}
                            bindSubmitForm={bindSubmitForm}
                            setactiveTab={setactiveTab}
                            isUpdate={isUpdate}
                            setSaveNextButton={setSaveNextButton}
                            activeMainTab={tabData.activeTab}
                        />
                    </TabPane>
                    <TabPane tabId="3">
                        <CareDetails
                            care_id={tabData.care_id}
                            bindSubmitForm={bindSubmitForm}
                            room_types={room_types}
                            setactiveTab={setactiveTab}
                            isUpdate={isUpdate}
                            setAvailableCareDetails={setAvailableCareDetails}
                            setSaveNextButton={setSaveNextButton}
                            activeMainTab={tabData.activeTab}
                        />
                    </TabPane>
                    <TabPane tabId="4">
                        <CareServiceProvided 
                            care_id={tabData.care_id} 
                            bindSubmitForm={bindSubmitForm} 
                            provided_services={provided_services} 
                            setactiveTab={setactiveTab} 
                            setAvailableServices={setAvailableServices}
                            setSaveNextButton={setSaveNextButton}
                            activeMainTab={tabData.activeTab}
                            isUpdate={isUpdate}
                        />
                    </TabPane>
                    <TabPane tabId="5">
                        <FacilitiesAndSafety 
                            care_id={tabData.care_id} 
                            bindSubmitForm={bindSubmitForm} 
                            setactiveTab={setactiveTab} 
                            facilities={facilities}
                            setSaveNextButton={setSaveNextButton}
                            activeMainTab={tabData.activeTab}
                            isUpdate={isUpdate}
                        />
                    </TabPane>
                    <TabPane tabId="6">
                        {
                            !isUpdate ? 
                            <RoomDetails {...tabData}
                                setSaveNextButton={setSaveNextButton}
                                activeMainTab={tabData.activeTab}
                                save_next_button_enabled={save_next_button_enabled}
                            /> :
                            <UpdateRoomDetails {...tabData}
                                setSaveNextButton={setSaveNextButton}
                                activeMainTab={tabData.activeTab}
                                save_next_button_enabled={save_next_button_enabled}
                            />
                        }
                    </TabPane>
                </TabContent>
    )
}

export default TabsData