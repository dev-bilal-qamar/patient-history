import type { Group } from './group'

export type Clinic = {
    _id: string
    clinicId: string
    name: string
    group: Group
    address: string
    email: string
    phone: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    __v: number
    key?: string
    apiKey?: string
}

export type GetClinicsApiResponse = {
    success: boolean
    status: number
    message: string
    data: Clinic[]
}

export type CreateClinicRequest = {
    name: string
    groupId: string
    email: string
    phone: string
    address: string
}

export type PostClinicApiResponse = {
    success: boolean
    message: string
    status?: number
    data?: Clinic
}
