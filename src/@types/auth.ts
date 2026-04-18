export interface UserState {
    userId?: string
    email?: string
    avatar?: string
    userName?: string
    role: string
    authority: string[]
    clinicId?: string
}

export type SignInCredential = {
    email: string
    password: string
}

export type ClinicBySignInResponse = {
    _id: string
    name: string
    logo: string
}

export type SignInResponse = {
    status: string | boolean
    message: string
    data: {
        token: string
        user: UserState
        clinics: ClinicBySignInResponse[]
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type ServerNamesDataUnregistered = {
    _id: string
    name: string
    email: string
    phone: string
    address: string
    createdAt: string
    updatedAt: string
    __v: number
}

export type ApiRegisterResponse = {
    status: string | boolean
    message: string
    data: {
        token: string
        user: UserState
        clinics: ClinicBySignInResponse[]
    }
}
