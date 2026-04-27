import ApiService from './ApiService'

type ClinicPostRequest = {
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

export async function apiPostClinic(data: ClinicPostRequest) {
    return ApiService.fetchData({
        url: `v1/clinics`,
        method: 'post',
        data,
    })
}
