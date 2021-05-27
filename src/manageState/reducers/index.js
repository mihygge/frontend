import { combineReducers } from 'redux'

import SignUpReducer from '../SignUp'
import ProviderHeader from '../ProviderHeader'
import AddNewCare from '../AddNewCare'

export default combineReducers({
    signup: SignUpReducer,
    provider_header: ProviderHeader,
    addnewcare: AddNewCare
})