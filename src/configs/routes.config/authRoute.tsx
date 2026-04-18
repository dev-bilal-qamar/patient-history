import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn')),
        authority: [],
    },
    {
        key: 'verification',
        path: `/verification`,
        component: lazy(() => import('@/views/auth/Verification')),
        authority: [],
    },
    {
        key: 'verification',
        path: `/request-verification`,
        component: lazy(() => import('@/views/auth/request-verification')),
        authority: [],
    },
]

export default authRoute
