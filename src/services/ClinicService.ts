import ApiService from './ApiService'

export type GetClinicsResponse = {
    name: string
    group: string
    address: string
    email: string
    phone: string
}

export async function apiGetClinics() {
    return ApiService.fetchData({
        url: `v1/clinics`,
        method: 'get',
    })
}

export async function apiPostClinic(data: GetClinicsResponse) {
    return ApiService.fetchData({
        url: `v1/clinics`,
        method: 'post',
        data,
    })
}
