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
            ],
        },
    ]
}

export default NavigationConfig
