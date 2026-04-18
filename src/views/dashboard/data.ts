export type dashboardDataType = {
    name: string
    extraData: boolean
    imageSrc: string
    href?: string
}

export const dashboardData: dashboardDataType[] = [
    {
        name: 'smartForm',
        extraData: true,
        imageSrc: '/img/others/dashboard-6.png',
        // href: '/smart-form',
    },
]
