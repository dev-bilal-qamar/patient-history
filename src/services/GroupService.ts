import type {
    CreateGroupApiResponse,
    GetGroupsApiResponse,
    GroupPostRequest,
} from '@/@types/group'
import ApiService from './ApiService'

export type {
    Group,
    GroupPostRequest,
    GetGroupsApiResponse,
} from '@/@types/group'

export async function apiGetGroups() {
    return ApiService.fetchData<GetGroupsApiResponse>({
        url: `v1/groups`,
        method: 'get',
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
    })
}

export async function apiPostGroup(data: GroupPostRequest) {
    return ApiService.fetchData<CreateGroupApiResponse>({
        url: `v1/groups`,
        method: 'post',
        data,
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
    })
}
