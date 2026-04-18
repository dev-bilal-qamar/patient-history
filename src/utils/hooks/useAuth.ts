/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSignIn } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
    initialUserState,
} from '@/store'
import appConfig from '@/configs/app.config'
// import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
// import useQuery from './useQuery'
import type { SignInCredential } from '@/@types/auth'
import { initialClinicState, setClinics } from '@/store/slices/auth/clinicSlice'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    // const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        if (appConfig.useHardcodedAuth) {
            dispatch(signInSuccess('hardcoded-dev-token'))
            dispatch(
                setUser({
                    userId: 'dev',
                    email: values.email,
                    userName: 'Dev User',
                    role: 'user',
                    authority: [],
                })
            )
            dispatch(setClinics(initialClinicState))
            navigate(appConfig.authenticatedEntryPath)
            return { status: 'success', message: '' }
        }

        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                const { token } = resp.data.data
                dispatch(signInSuccess(token))
                if (resp.data.data.clinics) {
                    dispatch(
                        setClinics(resp.data.data.clinics || initialClinicState)
                    )
                }
                if (resp.data.data.user) {
                    dispatch(setUser(resp.data.data.user || initialUserState))
                }
                // const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(appConfig.authenticatedEntryPath)
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(setClinics(initialClinicState))
        dispatch(setUser(initialUserState))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signOut,
    }
}

export default useAuth
