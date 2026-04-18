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
]
