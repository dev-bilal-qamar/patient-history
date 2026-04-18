import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserState } from '@/@types/auth'
import { SLICE_BASE_NAME } from './constants'

export type { UserState } from '@/@types/auth'

const initialState: UserState = {
    role: '',
    authority: [],
}

export const initialUserState: UserState = {
    role: '',
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<UserState>) => action.payload,
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
