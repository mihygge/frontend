import { createSlice } from "@reduxjs/toolkit"

import { ProfileLicenseState } from './new_care_initial_state'

const addNewCareSlice = createSlice({
    name: "addnewcare",
    initialState: {
        formData: {
            profile_license: ProfileLicenseState
        },
        success: false,
        
        activeTab: '1',
        care_id: null,
        care_name: null,
        available_care_details: {total_bedrooms: 0, total_rooms: 0},
        available_services: [],
        button_save_next_status: true
    },
    reducers: {
        setactiveTab(state, action){
           state.activeTab = action.payload.activeTab
        },
        setCareId(state, action){
            state.care_id = action.payload
        },
        setCareName(state, action){
            state.care_name = action.payload
        },
        setAvailableCareDetails(state, action){
            state.available_care_details = action.payload
        },
        setAvailableServices(state, action){
            state.available_services = action.payload
        },
        setSaveNextButton(state, action){
            state.button_save_next_status = action.payload
        },
        initializeState(state) {
            state.formData.profile_license = ProfileLicenseState
            state.activeTab = '1'
            state.care_id = null 
            state.available_care_details = {total_bedrooms: 0, total_rooms: 0}
            state.available_services = []
        }
    }
}) 
export const { setactiveTab, setCareId, 
            setCareName, setAvailableCareDetails, 
            setAvailableServices, initializeState, setSaveNextButton } = addNewCareSlice.actions

export default addNewCareSlice.reducer