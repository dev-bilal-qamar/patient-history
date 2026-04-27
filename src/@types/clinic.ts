/** Clinic as returned from GET v1/clinics */
export type Clinic = {
    _id: string
    name: string
    /** API key shown in the clinics table */
    key: string
    group?: string
    address?: string
    email?: string
    phone?: string
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
    __v?: number
}

export type GetClinicsApiResponse = {
    success: boolean
    status: number
    message: string
    data: Clinic[] | { results: Clinic[]; page?: number; limit?: number; totalResults?: number }
}

export type CreateClinicRequest = {
    name: string
    group: string
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

/** @deprecated use Clinic */
export type ResultGetClinicById = Clinic
