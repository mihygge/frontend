import React, { useState, useEffect } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import cogoToast from 'cogo-toast'
import { withRouter } from 'react-router-dom';
import UpdateRoomInfo from './updateRoomInfo';
import { FetchRoomServiceType } from '../../../../../../api/senior_living'
import { StringToKey } from '../../../../../../utils/users'
import MediaQuery from 'react-media';
import FormSelect from '../../../../../shared/formSelect';
import cx from 'classnames';
import ConfirmationPop from '../../../../../../modals/confirmationPop';
import { deleteRoomApi } from '../../../../../../api/senior_living/delete_room.api';
import { getServiceDetailsApi } from '../../../../../../api/updateServiceFunctionality/getServiceDetails';

import {roomInitDetails} from '../../../../constants';

window._formikProps = []

const converted_arr_to_hash = (room_service_types) =>  room_service_types.reduce((hash, obj) => {
    hash[StringToKey(obj.name)] = {
            labelText: obj.name,
            id: obj.id,
            services: obj['room_services']
    }
    return hash
}, {})


const UpdateRoomDetails = (props) => {

    const { care_id, available_services } = props;

    const initialValues = {...roomInitDetails({care_id})};
    
    const [activeRoomTab, setActiveRoomTab] = useState('1');
    const [RoomServiceType, setRoomServiceType] = useState({serviceType: {},  serviceMapping: {}})
    const [availableRoomDetails, setAvailableRoomDetails] = useState({total_bedrooms: 0, total_rooms: 0})
    const [selectedServices, setSelectedServices] = useState({})
    const [careStatus, setCareStatus] = useState(null);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);

    const [tabs, setTabs] = useState([]);

    const tabContentData = (formInitialValues) => (
        [
            {
                room_no: "1",
                submit: false,
                savedRoomId: null,
                initialValues: {...formInitialValues, ...selectedServices, selected_room_services: []},
            },
        ]
    )
    
    const [tabsContent, setTabsContent] = useState([])
    
    useEffect(() => {
        getRoomServiceType();
        fetchRoomDetails();
    }, [])

    const [room_details, set_room_details] = useState([]);
    const fetchRoomDetails = async() => {
        try{
            const response = await getServiceDetailsApi(props.match?.params?.careId, 'room_details');
            set_room_details(response?.data?.room_details);
            setCareStatus(response.data.status)
            const careId = response?.data?.id;
            const savedTotalRoom = response?.data?.room_details?.length;

            const updatedTabs = [];
            const updatedTabsContents = [];
            for(let i=0; i<savedTotalRoom; i++){
                const currentRoom = response?.data?.room_details?.[i]
                const roomId = response?.data?.room_details?.[i]?.id
                updatedTabs.push({
                    name: `Room No. ${i+1}`
                })
                updatedTabsContents.push({
                    room_no: `${i+1}`,
                    submit: false,
                    savedEarlier: true,
                    savedRoomId: roomId,
                    hasBooking: currentRoom.has_booking,
                    initialValues: {
                        ...initialValues,
                        care_id: careId,
                        id: currentRoom.id,
                        room_type: currentRoom.room_type,
                        bathroom_type: currentRoom.bathroom_type,
                        name: currentRoom.name,
                        price: currentRoom.price,
                        price_desc: currentRoom.price_desc,
                        available_from: currentRoom.available_from,
                        available_to: currentRoom.available_to,
                        beds_attributes: [...currentRoom.beds],
                        beds: [...currentRoom.beds],
                        files: [...currentRoom.files],
                        previous_selected_room_services: [...currentRoom.selected_room_services]
                    },
                })
            }

            setTabs(updatedTabs);
            setTabsContent(updatedTabsContents);
        }
        catch(error){
            console.log(error);
        }
    }
    
    const toggleConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(!confirmDeleteModalIsOpen)
    }
    
    let RoomDetailsForms = new Array()
    const bindSubmitForm = (submitForm, formIndex) => {
        RoomDetailsForms[formIndex] = submitForm
    }
    
    const handleSubmitMyForm = (e) => {
        e.preventDefault();
        if(RoomDetailsForms[Number(activeRoomTab) - 1]){
            RoomDetailsForms[Number(activeRoomTab) - 1](e)
        }
    };

    const deleteRoomTab = (e) => {
        e.preventDefault();
        const deleteRoomTabIndex = Number(activeRoomTab) - 1;
        const isRoomSavedEarlier = tabsContent[deleteRoomTabIndex].savedEarlier;
        const isRoomTabSubmitted = tabsContent[deleteRoomTabIndex].submit;
        
        if(isRoomSavedEarlier || isRoomTabSubmitted){
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
        const current_room = tabsContent?.[deleteRoomTabIndex];
        const total_bed_in_current_room = current_room.savedEarlier ? current_room?.initialValues?.beds?.length : current_room?.initialValues?.beds_attributes?.length;
        const updated_total_bedrooms = availableRoomDetails.total_bedrooms + total_bed_in_current_room;
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
    
    let tooltipMessages = ""
    
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
    
    const updateAvailableRoomDetails = (bed_details) => {
        setAvailableRoomDetails(bed_details)
    }
    
    useEffect(() => {
        const NoOfSavedRooms = room_details.length>0 ? room_details.length : 0;
        let NoOfSavedBed = 0;
        if(room_details.length>0){
            room_details.forEach((room, index) => {
                NoOfSavedBed = NoOfSavedBed + room?.beds?.length;
            })
        }
        setAvailableRoomDetails({
            total_bedrooms: props.available_care_details.total_bedrooms - NoOfSavedBed,
            total_rooms: props.available_care_details.total_rooms - NoOfSavedRooms
        })
    }, [props.available_care_details, room_details])
    
    useEffect(() => {
        if(props.activeMainTab === '6' && (careStatus===null || careStatus==='active' || careStatus==='in-progress' || careStatus==='rejected')){
            props.setSaveNextButton(false)
        }
        const savedTotalRoom = room_details?.length;
        if(savedTotalRoom && careStatus!==null && careStatus!=='active' && careStatus!=='in-progress' && careStatus!=='rejected'){
            props.setSaveNextButton(true);
        }
        
    }, [props.activeMainTab, room_details])
    
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
            savedEarlier: false,
            savedRoomId: null,
            hasBooking: false,
            initialValues: tabContentData(initialValues)[0]['initialValues']}
        ]
        
        setTabsContent(newTabsContent)
        setTabs(newTabs)
        setActiveRoomTab((tabs.length + 1) + "")
    }

    const completeForm = (submitted_index, values, savedRoomId, submit, savedEarlier) => {
        let OldTabsContent = [
            ...tabsContent   
        ]    

        window._formikProps.forEach((t, i) => {
            if(!(OldTabsContent[i].submit || parseInt(activeRoomTab - 1) === i )){
                return ({
                    submit: false,
                    savedRoomId: savedRoomId,
                    savedEarlier: false,
                    room_no: i + 1,
                    initialValues: window._formikProps[i]
                })
            }
        })
        let updatedTabContents = [
            ...OldTabsContent
        ]
        updatedTabContents[submitted_index] = {
            hasBooking: updatedTabContents[submitted_index].hasBooking,
            submit: submit,
            savedRoomId: savedRoomId,
            room_no: submitted_index + 1,
            initialValues: values,
            savedEarlier: savedEarlier,
        }
        setTabsContent(updatedTabContents)
        if(!props.save_next_button_enabled && careStatus!==null && careStatus!=='active' && careStatus!=='in-progress' && careStatus!=='rejected'){
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
        const currentTabsContent = tabsContent[parseInt(activeRoomTab) - 1]
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
                submit: false,
                savedEarlier: false,
                savedRoomId: null,
                hasBooking: false,
                initialValues: {
                    ...formData.values,
                    id: null,
                    name: "",
                    video_file: !currentTabsContent.savedEarlier ? formData.values.video_file: "",
                    image_file: !currentTabsContent.savedEarlier ? formData.values.image_file: "",
                    previous_video_file: [],
                    previous_image_file: [],
                    available_date: !currentTabsContent.savedEarlier ? formData.values.available_date: ["", ""],
                    duplicate: true,
                    selected_room_services: [],
                    previous_selected_room_services: [],
                },
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
                    <button
                        disabled={tabs.length===0 ? true : false}
                        className="btn-theme btn-no-box text-uppercase"
                        onClick={(e) => (duplicate_forms(e))}
                    >
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
                            <button
                                className="btn-theme btn-transparent medium-size"
                                onClick={handleSubmitMyForm}
                                id="room_save_button"
                            >
                                {
                                    tabsContent?.[Number(activeRoomTab) - 1]?.savedEarlier ? 'Update' :
                                    (tabsContent?.[Number(activeRoomTab) - 1]?.submit ? 'Update' : 'Save')
                                }
                            </button>
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
                                <TabPane
                                    key={i}
                                    tabId={(i + 1) + ""}
                                    className="tab-content-rooms" 
                                    // className={cx("tab-content-rooms", 
                                    //     {"tab-content-rooms-disabled" : tabsContent[Number(activeRoomTab) - 1]?.submit && (i===Number(activeRoomTab) - 1)}
                                    // )}
                                >
                                    <UpdateRoomInfo {...t}
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
                                        previous_room_details={room_details[i] ? room_details[i] : {}}
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

export default withRouter(UpdateRoomDetails)