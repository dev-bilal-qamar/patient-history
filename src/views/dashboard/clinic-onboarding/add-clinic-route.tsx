import { Breadcrums } from '@/components/shared/breadcrums'
import { Button } from '@/components/ui'
import { AppRoutes } from '@/configs/routes.config/app-routes'
import { useNavigate } from 'react-router-dom'
import OnboardingForm from './components/onboardingForm'

export default function AddClinicRoute() {
    const navigate = useNavigate()

    return (
        <Breadcrums>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1">
                    Add clinic
                </h2>
                <Button
                    className="min-w-0"
                    variant="default"
                    onClick={() => navigate(AppRoutes.dashboard.clinics)}
                >
                    Back to clinics
                </Button>
            </div>
            <OnboardingForm
                onCreated={() => navigate(AppRoutes.dashboard.clinics)}
            />
        </Breadcrums>
    )
}
