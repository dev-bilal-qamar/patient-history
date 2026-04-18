import { AppRoutes } from '@/configs/routes.config/app-routes'

export type dashboardDataType = {
    name: string
    extraData?: boolean
    imageSrc: string
    href?: string
}

export const dashboardData: dashboardDataType[] = [
    {
        name: 'Patient History',
        extraData: true,
        imageSrc: '/img/others/dashboard-6.png',
        href: AppRoutes.dashboard.patientHistory,
    },
]
