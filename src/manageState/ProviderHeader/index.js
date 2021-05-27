import { createSlice } from "@reduxjs/toolkit"

const providerheader = createSlice({
    name: "providerheader",
    initialState: {
        username: "",
        image_url: ""
    },
    reducers: {
        setusername(state, action){
           state.username = action.payload.username
        },
        
    }
}) 
export const { setusername } = providerheader.actions

export default providerheader.reducer