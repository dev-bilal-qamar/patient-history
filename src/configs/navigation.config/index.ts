import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import { AppRoutes } from '../routes.config/app-routes'

const NavigationConfig = (): NavigationTree[] => {
    return [
        {
            key: 'dashboard',
            path: '/dashboard',
            title: 'Dashboard',
            translateKey: 'nav.dashboard',
            icon: 'dashboard',
            type: NAV_ITEM_TYPE_TITLE,
            authority: [],
            subMenu: [
                {
                    key: 'dashboard',
                    path: AppRoutes.dashboard.index,
                    title: 'Dashboard',
                    translateKey: 'nav.dashboard',
                    icon: 'dashboard',
                    type: NAV_ITEM_TYPE_ITEM,
                    authority: [],
                    access: [],
                    subMenu: [],
                },
                {
                    key: 'dashboard.patientHistory',
                    path: AppRoutes.dashboard.patientHistory,
                    title: 'R4 Patient History',
                    translateKey: 'nav.patient-history',
                    icon: 'patientHistory',
                    type: NAV_ITEM_TYPE_ITEM,
                    authority: [],
                    access: [],
                    subMenu: [],
                },
                {
                    key: 'dashboard.manageGroups',
                    path: AppRoutes.dashboard.manageGroups,
                    title: 'Manage Groups',
                    translateKey: 'nav.manage-groups',
                    icon: 'manageGroups',
                    type: NAV_ITEM_TYPE_ITEM,
                    authority: [],
                    access: [],
                    subMenu: [],
                },
                {
                    key: 'dashboard.clinics',
                    path: AppRoutes.dashboard.clinics,
                    title: 'Clinics',
                    translateKey: 'nav.clinics',
                    icon: 'clinic',
                    type: NAV_ITEM_TYPE_ITEM,
                    authority: [],
                    access: [],
                    subMenu: [],
                },
            ],
        },
    ]
}

export default NavigationConfig
