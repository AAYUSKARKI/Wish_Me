import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onlineuser: null
}

 const OnlineuserSlice = createSlice({
    name: "onlineuser",
    initialState,
    reducers: {
        setOnlineuser: (state, action) => {
            state.onlineuser = action.payload
        }
    }
})

export const { setOnlineuser } = OnlineuserSlice.actions

export default OnlineuserSlice.reducer