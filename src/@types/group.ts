export type Group = {
    _id: string
    name: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

export type GetGroupsApiResponse = {
    success: boolean
    status: number
    message: string
    data: Group[]
}

export type GroupPostRequest = {
    name: string
}

export type CreateGroupApiResponse = {
    success: boolean
    status: number
    message: string
    data: Group
}
