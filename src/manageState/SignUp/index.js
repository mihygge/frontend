import { createSlice } from "@reduxjs/toolkit"

const signup = createSlice({
    name: "signup",
    initialState: {
        errorMessage: "",
        infoMessage: "",
        successMessage: "",
    },
    reducers: {
        clearAllMessages(state){
            state.errorMessage = ""
            state.infoMessage = ""
            state.successMessage = ""
        },
        setErrorMessage(state, action){
            state.errorMessage = action.payload
        },
        setSuccessMessage(state, action){
            state.successMessage = action.payload
        }
    }
}) 
export const { clearAllMessages, setErrorMessage, setSuccessMessage } = signup.actions

export default signup.reducer