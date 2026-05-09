import { Breadcrums } from '@/components/shared/breadcrums'
import { Button, Notification, Spinner, toast } from '@/components/ui'
import { AppRoutes } from '@/configs/routes.config/app-routes'
import type { Clinic } from '@/@types/clinic'
import { apiGetClinics } from '@/services/ClinicService'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardedClinic } from './components/onboarded-clinic'

const ClinicOnboarding = () => {
    const [clinics, setClinics] = useState<Clinic[]>()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const getClinics = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await apiGetClinics()
            const raw = response.data.data
            setClinics(
                Array.isArray(raw)
                    ? raw
                    : (raw as { results: Clinic[] }).results ?? []
            )
        } catch (err) {
            const message =
                err instanceof AxiosError &&
                err.response?.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data
                    ? String((err.response.data as { message: string }).message)
                    : 'Could not load clinics'
            toast.push(
                <Notification type="danger" duration={2000}>
                    {message}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        getClinics()
    }, [getClinics])

    return (
        <Breadcrums>
            <div className="flex items-center justify-between gap-4 ">
                <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1">
                    Clinics
                </h2>
                <Button onClick={() => navigate(AppRoutes.dashboard.addClinic)}>
                    Create clinic
                </Button>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <Spinner size={40} />
                </div>
            ) : (
                <OnboardedClinic clinics={clinics ?? []} />
            )}
        </Breadcrums>
    )
}

export default ClinicOnboarding
