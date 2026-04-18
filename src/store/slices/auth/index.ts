import { combineReducers } from '@reduxjs/toolkit'
import clinics, { ClinicState } from './clinicSlice'
import session, { SessionState } from './sessionSlice'
import user, { UserState } from './userSlice'

const reducer = combineReducers({
    session,
    clinics,
    user,
})

export type AuthState = {
    session: SessionState
    user: UserState
    clinics: ClinicState[]
}

export * from './sessionSlice'
export * from './userSlice'
export * from './clinicSlice'

export default reducer
