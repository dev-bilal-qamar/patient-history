import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import { AppRoutes } from './app-routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'dashboard',
        path: AppRoutes.dashboard.index,
        component: lazy(() => import('@/views/dashboard')),
        authority: [],
    },
    {
        key: 'dashboard.patientHistory',
        path: AppRoutes.dashboard.patientHistory,
        component: lazy(() => import('@/views/dashboard/patient-history')),
        authority: [],
    },
    {
        key: 'dashboard.manageGroups',
        path: AppRoutes.dashboard.manageGroups,
        component: lazy(() => import('@/views/dashboard/manage-group')),
        authority: [],
    },
    {
        key: 'dashboard.clinics',
        path: AppRoutes.dashboard.clinics,
        component: lazy(() => import('@/views/dashboard/clinic-onboarding')),
        authority: [],
    },
    {
        key: 'dashboard.addClinic',
        path: AppRoutes.dashboard.addClinic,
        component: lazy(
            () =>
                import(
                    '@/views/dashboard/clinic-onboarding/components/onboardingForm'
                )
        ),
        authority: [],
    },
]
