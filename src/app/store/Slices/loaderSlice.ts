import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface LoaderState {
    isOpen: boolean;
}

const initialState: LoaderState = {
    isOpen: false
};

const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        openLoader: state => ({...state, isOpen: true }),
        closeLoader: state => ({...state, isOpen: false }),
    }

});

export const { openLoader, closeLoader } = loaderSlice.actions;
export const loaderSelector = (state: RootState) => state.loader;
export default loaderSlice.reducer;