/** Single group as returned from GET/POST v1/groups (Mongo-style document). */
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

/** Body for create group */
export type GroupPostRequest = {
    name: string
}

export type CreateGroupApiResponse = {
    success: boolean
    status: number
    message: string
    data?: unknown
}
