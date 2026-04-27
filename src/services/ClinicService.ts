import ApiService from './ApiService'

export type GetClinicsResponse = {
    name: string
    group: string
    address: string
    email: string
    phone: string
}

export type PostClinicApiResponse = {
    success: boolean
    message: string
}

export async function apiGetClinics() {
    return ApiService.fetchData({
        url: `v1/clinics`,
        method: 'get',
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
    })
}

export async function apiPostClinic(data: GetClinicsResponse) {
    return ApiService.fetchData<PostClinicApiResponse>({
        url: `v1/clinics`,
        method: 'post',
        data,
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
    })
}
