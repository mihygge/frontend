import React, { useState, useRef, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Tooltip } from 'reactstrap';
import classnames from 'classnames';
import cogoToast from 'cogo-toast'

import RoomInfo from './roomInfo';
import { FetchRoomServiceType } from '../../../../../../api/senior_living'
import { StringToKey } from '../../../../../../utils/users'
import MediaQuery from 'react-media';
import FormSelect from '../../../../../shared/formSelect';
import cx from 'classnames';
import ConfirmationPop from '../../../../../../modals/confirmationPop';
import { deleteRoomApi } from '../../../../../../api/senior_living/delete_room.api';

//Bad Practice, need to replace with Array ref
window._formikProps = []

const converted_arr_to_hash = (room_service_types) =>  room_service_types.reduce((hash, obj) => {
    hash[StringToKey(obj.name)] = {
            labelText: obj.name,
            id: obj.id,
            services: obj['room_services']
    }
    return hash
}, {})


const RoomDetails = (props) => {
    const { care_id, available_services } = props
    
    const [activeRoomTab, setActiveRoomTab] = useState('1');
    const [RoomServiceType, setRoomServiceType] = useState({serviceType: {},  serviceMapping: {}})
    const [availableRoomDetails, setAvailableRoomDetails] = useState({total_bedrooms: 0, total_rooms: 0})
    const [selectedServices, setSelectedServices] = useState({})
    
    const [tooltipOpen, setTooltipOpen] = useState(false);
    
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    
    const toggleConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(!confirmDeleteModalIsOpen)
    }
    
    const initialValues = {
        room_type: "",
        bathroom_type: "",
        available_date: ["", ""],
        name: "",
        price: "",
        price_desc: "",
        beds_attributes: [
            {
                bed_type: "",
                bed_number: "",
                service_id: ""
            }
        ],
        care_id: care_id,
        video_file: "",
        image_file: ""
    }
    
    let RoomDetailsForms = new Array()
    const bindSubmitForm = (submitForm, formIndex) => {
        RoomDetailsForms[formIndex] = submitForm
    }
    
    
    const handleSubmitMyForm = (e) => {
        e.preventDefault();
        if(tabsContent[Number(activeRoomTab) - 1]?.['submit']){
            cogoToast.info('This form is already saved.')
        }
        else if(RoomDetailsForms[Number(activeRoomTab) - 1]){
            RoomDetailsForms[Number(activeRoomTab) - 1](e)
        }
    };

    const deleteRoomTab = (e) => {
        e.preventDefault();
        const deleteRoomTabIndex = Number(activeRoomTab) - 1;
        const isRoomTabSubmitted = tabsContent[deleteRoomTabIndex].submit;
        if(isRoomTabSubmitted){
            const savedRoomId = tabsContent[deleteRoomTabIndex].savedRoomId;
            deleteRoomTabFromBE(deleteRoomTabIndex, savedRoomId);
        }else{
            deleteRoomTabfromForm(deleteRoomTabIndex);
        }
    }
    
    const deleteRoomTabfromForm = (deleteRoomTabIndex) => {
        tabs.splice(deleteRoomTabIndex, 1);
        tabsContent.splice(deleteRoomTabIndex, 1);

        window._formikProps.splice(deleteRoomTabIndex, 1);
        deleteRoomTabIndex === 0 ? setActiveRoomTab('1') : setActiveRoomTab((activeRoomTab - 1) + "");

        const updatedTabs = tabs.map((tab, index) => {tab.name = `Room No. ${index+1}`; return tab});
        const updateTabsContent = tabsContent.map((tabContent, index) => {
            tabContent.room_no = `${index+1}`
            tabContent.initialValues = window._formikProps[index].values;
            return tabContent
        });

        setTabs(updatedTabs);
        setTabsContent(updateTabsContent);
        if(tabsContent.length===0){
            props.setSaveNextButton(false)
        }
    }

    const deleteRoomTabFromBE = async(deleteRoomTabIndex, savedRoomId) => {
        const updated_total_bedrooms = availableRoomDetails.total_bedrooms + tabsContent[deleteRoomTabIndex]?.initialValues?.beds_attributes?.length;
        const updated_total_rooms = availableRoomDetails.total_rooms + 1;
        deleteRoomTabfromForm(deleteRoomTabIndex);
        updateAvailableRoomDetails({total_bedrooms: updated_total_bedrooms, total_rooms: updated_total_rooms})
        try{
            await deleteRoomApi(savedRoomId);
            cogoToast.success('Saved room details has been deleted successfully');
        }
        catch(error){
            console.log(error);
        }
    }
    
    
    let submit_disabled = false;
    let tooltipMessages = ""
    
    
    const tabContentData = (formInitialValues) => (
        [
            {
                room_no: "1",
                submit: false,
                savedRoomId: null,
                initialValues: {...formInitialValues, ...selectedServices},
            },
        ]
    )
    

    const getRoomServiceType = async () => {
        const res = await FetchRoomServiceType()
        const room_service_types = res.data
        const service_type_mapping = converted_arr_to_hash(room_service_types)
        
        let serviceMapping = Object.values(service_type_mapping)
        let map={}, form_values = {};
        for(let i=0;i<serviceMapping.length;i++){
                for(let j=0;j<serviceMapping[i].services.length;j++){
                        map[StringToKey(serviceMapping[i].services[j].name)] = { service_id: serviceMapping[i].services[j].id, service_type_id: serviceMapping[i].id}
                }
        }
        setRoomServiceType({serviceType:service_type_mapping,  serviceMapping: map})
        
        let room_service_initial_values = {}
        Object.keys(RoomServiceType).forEach(key => room_service_initial_values[key] = false)

        
        setSelectedServices(room_service_initial_values)
    }   
    
    useEffect(() => {
        getRoomServiceType()
    }, [])
    
    const updateAvailableRoomDetails = (bed_details) => {
        setAvailableRoomDetails(bed_details)
    }
    
    useEffect(() => {
        setAvailableRoomDetails(props.available_care_details)
    }, [props.available_care_details])
    
    useEffect(() => {
        if(props.activeMainTab === '6' ){
            props.setSaveNextButton(false)
        }
    }, [props.activeMainTab])
    
    const [tabs, setTabs] = useState([
        {
            name: 'Room No. 1'
        },
    ])

    const [tabsContent, setTabsContent] = useState(tabContentData(initialValues))
    
    if(tabsContent[Number(activeRoomTab) - 1]?.['submit']){
        submit_disabled = true 
        tooltipMessages = 'This tab form already submitted'
    } else if(availableRoomDetails.total_bedrooms <= 0 ){
        submit_disabled = true
        tooltipMessages = 'No available rooms to create rooms.'
    }
    
    
    const addNewTab =(e) => {
        if(availableRoomDetails.total_bedrooms <=0 || availableRoomDetails.total_rooms <= 0 || tabs.length >=  props.available_care_details.total_rooms){
            cogoToast.warn('Total no. of rooms or bedrooms already booked or total number of tab exceeding total no of rooms');
            return false
        }
        const newTabs =  [
            ...tabs,
            {
                name: `Room No. ${tabs.length + 1}`
            }
        ]
        
        const newTabsContent = [
            ...tabsContent,
            {room_no: (tabs.length + 1) + "",
            submit: false,
            savedRoomId: null,
            initialValues: tabContentData(initialValues)[0]['initialValues']}
            
        ]
        
        setTabsContent(newTabsContent)
        setTabs(newTabs)
        setActiveRoomTab((tabs.length + 1) + "")
    }

    const completeForm = (submitted_index, values, savedRoomId) => {
        let OldTabsContent = [
            ...tabsContent   
        ]    

        window._formikProps.forEach((t, i) => {
            if(!(OldTabsContent[i].submit || parseInt(activeRoomTab - 1) === i )){
                return ({
                    submit: false,
                    savedRoomId: savedRoomId,
                    room_no: i + 1,
                    initialValues: window._formikProps[i]
                })
            }
        })
        let updatedTabContents = [
            ...OldTabsContent
        ]
        updatedTabContents[submitted_index] = {
            submit: true,
            savedRoomId: savedRoomId,
            room_no: submitted_index + 1,
            initialValues: values,
            
        }
        setTabsContent(updatedTabContents)
        if(!props.save_next_button_enabled){
            props.setSaveNextButton(true)
        }
    }
    
    const toggle = tab => {
        if(parseInt(tab) > tabsContent.length ){
            cogoToast.warn('No tab to traverse, confirm this care details');
            return false
        }
        if(activeRoomTab !== tab) setActiveRoomTab(tab);
    }
    
    const duplicate_forms = (e) => {
        if((availableRoomDetails.total_bedrooms <=0 )|| availableRoomDetails.total_rooms <= 0 ||  tabs.length >= props.available_care_details.total_rooms){
            cogoToast.warn('Total no. of rooms or bedrooms already booked or total number of tab exceeding total no of rooms');
            return false
        }
        const formData = window._formikProps[parseInt(activeRoomTab) - 1]
        const newTabs =  [
            ...tabs,
            {
                name: `Room No. ${tabs.length + 1}`
            }
        ]
        const newTabsContent = [
            ...tabsContent,
            {
                room_no: (tabs.length + 1) + "",
                initialValues: {...formData.values, name: ""},
                submit: false,
                savedRoomId: null,
            }
        ]
        setTabsContent(newTabsContent)
        setTabs(newTabs)
        setActiveRoomTab((tabs.length + 1) + "")
    } 
    
    return (
        <>
        <div className="section-room-deatils-in-tabs">
            <div className="section-header">
                <MediaQuery query="(min-width: 768px)">
                    {
                        matches => matches ? ( 
                            <h3>Room Details</h3>
                        ) : <FormSelect 
                                className="rooms-selector" 
                                placeholder={tabs.length>0 ? 'R1' : ''}
                                options={
                                    tabs.map((tab, index) => {
                                        return {value: `${index+1}`, label: `R${index+1}`}
                                    })
                                }
                                onChange={(e) => {
                                    setActiveRoomTab(e.value)}
                                }
                            />
                    }
                </MediaQuery>
                <div>
                    {/*<Tooltip placement="right" isOpen={tooltipOpen && submit_disabled} target="room_save_button" toggle={toggle}>
                        {tooltipMessages}
                    </Tooltip> */}
                    <button className="btn-theme btn-no-box text-uppercase" onClick={(e) => (duplicate_forms(e))}>
                        <MediaQuery query="(min-width: 768px)">
                            {
                                matches => matches ? ( 
                                    'Duplicate room details'
                                ) : 'Duplicate room'
                            }
                        </MediaQuery>
                    </button>
                    <button className="btn-theme btn-transparent medium-size" onClick={(e) => (addNewTab())}>
                        <MediaQuery query="(min-width: 768px)">
                            {
                                matches => matches ? ( 
                                    'Add New Room'
                                ) : 'Add Room'
                            }
                        </MediaQuery>
                    </button>
                </div>
            </div>
            <div className="section-room-details-outer">
                <div className="btns-save-in-room">
                        {tabs.length === 0 ? '' :
                        <>
                            <button className="btn-theme btn-transparent medium-size" disabled={submit_disabled} onClick={handleSubmitMyForm} id="room_save_button">Save</button>
                            <button
                                className="btn-theme btn-transparent medium-size"
                                disabled={tabs.length === 0}
                                onClick={toggleConfirmDeleteModal}
                                id="room_delete_button"
                            >Delete</button>
                        </>
                    }
                </div>
                <div className="section-room-details">
                    <div className="nav-rooms-container">
                        <Nav>
                            {
                                tabs.map((t, i) => (
                                    <NavItem key={i}>
                                        <NavLink
                                            className={classnames({ active: activeRoomTab === (i + 1) + "" })}
                                            onClick={() => { toggle((i + 1) + ""); }}
                                        >
                                            {t.name} 
                                        </NavLink>
                                    </NavItem>
                                ))
                            }
                        </Nav>
                    </div>
                    <TabContent activeTab={activeRoomTab} className="tab-content-rooms">
                        {
                            tabsContent.map((t, i) => (
                                <TabPane key={i} tabId={(i + 1) + ""}
                                    className={cx("tab-content-rooms", 
                                        {"tab-content-rooms-disabled" : tabsContent[Number(activeRoomTab) - 1]?.submit && (i===Number(activeRoomTab) - 1)}
                                    )}
                                >
                                    <RoomInfo {...t}
                                        Formindex={i + 1} 
                                        bindSubmitForm={bindSubmitForm} 
                                        toggle={toggle} 
                                        RoomServiceType={RoomServiceType} 
                                        care_id={care_id}
                                        available_room_details={availableRoomDetails}
                                        available_services={available_services}
                                        updateAvailableRoomDetails={updateAvailableRoomDetails}
                                        completeForm={completeForm}
                                        activeRoomTab={activeRoomTab}
                                    />
                                </TabPane>
                            ))
                        }
                    </TabContent>
                </div>
            </div>
        </div>
        <ConfirmationPop
            isOpen={confirmDeleteModalIsOpen}
            toggle={toggleConfirmDeleteModal}
            confirmationDesc={'room delete'}
            executeOnConfirm={deleteRoomTab}
        />
        </>
    )
}

export default RoomDetails