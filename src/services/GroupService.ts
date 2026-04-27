import ApiService from './ApiService'

type GroupPostRequest = {
    name: string
}

export async function apiGetGroups() {
    return ApiService.fetchData({
        url: `v1/groups`,
        method: 'get',
    })
}

export async function apiPostGroup(data: GroupPostRequest) {
    return ApiService.fetchData({
        url: `v1/groups`,
        method: 'post',
        data,
    })
}
