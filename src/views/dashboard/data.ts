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
        name: 'R4 Patient History',
        description:
            'Filter by provider and dates, browse the visit list, and export rows for referrals.',
        extraData: true,
        imageSrc: '/img/others/dashboard-6.png',
        href: AppRoutes.dashboard.patientHistory,
    },
]
