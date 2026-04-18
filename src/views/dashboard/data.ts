import { AppRoutes } from '@/configs/routes.config/app-routes'

export type dashboardDataType = {
    name: string
    description: string
    extraData: boolean
    imageSrc: string
    href: string
}

export const dashboardData: dashboardDataType[] = [
    {
        name: 'Patient History',
        description:
            'Search by patient or date range, review visits, and export records when you need them.',
        extraData: true,
        imageSrc: '/img/others/dashboard-6.png',
        href: AppRoutes.dashboard.patientHistory,
    },
]
