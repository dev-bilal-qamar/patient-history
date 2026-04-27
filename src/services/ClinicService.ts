import type {
    CreateClinicRequest,
    GetClinicsApiResponse,
    PostClinicApiResponse,
} from '@/@types/clinic'
import ApiService from './ApiService'

export type GetClinicsResponse = CreateClinicRequest

export type {
    Clinic,
    GetClinicsApiResponse,
    CreateClinicRequest,
} from '@/@types/clinic'

export async function apiGetClinics() {
    return ApiService.fetchData<GetClinicsApiResponse>({
        url: `v1/clinics`,
        method: 'get',
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
    })
}

export async function apiPostClinic(data: CreateClinicRequest) {
    return ApiService.fetchData<PostClinicApiResponse>({
        url: `v1/clinics`,
        method: 'post',
        data,
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
    })
}
