import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ClinicBySignInResponse } from '@/@types/auth'
import { SLICE_BASE_NAME } from './constants'

export type ClinicState = ClinicBySignInResponse

const initialState: ClinicBySignInResponse[] = []

export const initialClinicState: ClinicBySignInResponse[] = []

const clinicSlice = createSlice({
    name: `${SLICE_BASE_NAME}/clinics`,
    initialState,
    reducers: {
        setClinics: (
            _state,
            action: PayloadAction<ClinicBySignInResponse[]>
        ) => action.payload,
    },
})

export const { setClinics } = clinicSlice.actions
export default clinicSlice.reducer
