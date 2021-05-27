import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import cogoToast from 'cogo-toast';

import CustomNav from './tabs/custom_nav'
import SectionTitle from './section-title'
import TabContent from './tabs/tabContent' 
import { useServiceFacility } from '../../../../effects/care_services_facility/use_service_facility'
import { UpdateCareDetails } from '../../../../api/senior_living'
import CheckoutModal from '../../../../modals/checkoutModal'

const AddHomeShareCare = (props) => {
    const { tabData, setactiveTab,
        setCareId, setCareName, location, 
        setAvailableServices, setAvailableCareDetails,
        initializeState, setSaveNextButton
    } = props;
    const { pathname, state } = location;
    
    const { room_types, facilities, provided_services } = useServiceFacility('homeshare')

    let history = useHistory();

    let isUpdate = false;

    if(pathname.includes('update')){
        isUpdate = true;
    }

    useEffect(() =>{
        initializeState();
        isUpdate && execUpdateFunc();
    }, [])

    const execUpdateFunc = () => {
        setCareId(state?.serviceId);
        setCareName(state?.serviceName);
    }
    
    let CareForms = new Array(7)
    const bindSubmitForm = (submitForm, formIndex) => {
        CareForms[formIndex] = submitForm
    }
    
    const updateCareStatus = (redirectTo) => {
        if(!tabData.care_id){
            cogoToast.warn('Care Details yet to be created.')
            return false
        }
           
        const request_body = {
            care: {
                status: 'pending'
            }
        }

        try{
            cogoToast.loading('Update Care Status').then(async () => {
                await UpdateCareDetails(tabData.care_id, request_body)
                cogoToast.success('Successfully updated.')
                history.push(redirectTo)
                initializeState()
                window._formikProps = []
            })
        }
        catch(err){
            console.log(err)          
        }
    }
    
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal);

    const add_more_care = async() => {
        updateCareStatus('/provider');
    }
    
    const buy_subscription = async () => {
        updateCareStatus('/account-details');
    }

    const handleSubmitMyForm = (e) => {
        e.preventDefault();
        if(tabData.activeTab === '6'){
            const confirmMove = window.confirm('Save room details before you submit the Care/Home')
            if(confirmMove){
                setModal(true)             
            }
        }
        if(CareForms[Number(tabData.activeTab) - 1]){
            CareForms[Number(tabData.activeTab) - 1](e)
        }
    };
    
    const tabContentProps = {
        bindSubmitForm,
        tabData,
        room_types,
        setCareId,
        setactiveTab,
        provided_services,
        setCareName,
        isUpdate,
        facilities,
        setAvailableServices,
        setAvailableCareDetails,
        setSaveNextButton
    }
    
    return (
        <div className="container-add-new-care">
            <SectionTitle
                handleSubmitMyForm={handleSubmitMyForm}
                activeTab={tabData.activeTab}
                enabled_save_button={tabData.button_save_next_status}
                title={!isUpdate ? 'Add Home Share' : `${tabData.care_name ? `${tabData.care_name} - ` : ''}  Update Details`}
            />
            <div className="tabs-add-care nav-custom-tabs">
                <CustomNav 
                    setactiveTab={setactiveTab}
                    isUpdate={isUpdate}
                    {...tabData}
                />
                <TabContent {...tabContentProps}/>
            </div>
            <CheckoutModal isOpen={modal} toggle={toggle} add_more_care={add_more_care} buy_subscription={buy_subscription}/>
        </div>
    )
}

export default AddHomeShareCare;