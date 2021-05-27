import React from 'react'
import { connect } from 'react-redux'
import ProvideHeaderComponent from '../components/Provider/providerheader'

const ProviderHeader = (props) => {
    return <ProvideHeaderComponent {...props}/>
}

function mapStateToProps(state) {
    return {
        username: state.provider_header.username
    };
}

export default connect(mapStateToProps, null)(ProviderHeader)