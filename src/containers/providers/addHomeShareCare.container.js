import { withRouter } from "react-router";
import { connect } from 'react-redux'

import React from 'react';
import AddHomeShareCare from '../../components/provider/homeShare/newHomeShare/AddHomeShareCare';
import { setactiveTab, setCareId, setCareName, 
    setAvailableCareDetails, setAvailableServices, initializeState, setSaveNextButton } from '../../manageState/AddNewCare'

const AddHomeShareCareContainer = (props) => {
    return (<AddHomeShareCare {...props} />)
}

function mapDispatchToProps(dispatch) {
    return {
        setactiveTab: currentTab => dispatch(setactiveTab({activeTab: currentTab})),
        setCareId: (care_id) => dispatch(setCareId(care_id)),
        setCareName: (care_name) => dispatch(setCareName(care_name)),
        setAvailableCareDetails: (care_details) => dispatch(setAvailableCareDetails(care_details)),
        setAvailableServices: (services) => dispatch(setAvailableServices(services)),
        initializeState: () => dispatch(initializeState()),
        setSaveNextButton: (status) => dispatch(setSaveNextButton(status)),
    };
} 

function mapStateToProps(state) {
    return {
        tabData: state.addnewcare,
    };
}


export default connect(mapStateToProps, mapDispatchToProps, null, {
    pure: false
})(withRouter(AddHomeShareCareContainer));