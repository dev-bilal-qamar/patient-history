import { Breadcrums } from '@/components/shared/breadcrums'
import OnboardingForm from './components/onboardingForm'
import { OnboardClinicTable } from './components/onboardClinics-table'
import { useCallback, useEffect, useState } from 'react'
import {
    apiGetClinic,
    apiGetClinicServerNames,
} from '@/services/AdminPanelService'
import { useSearchParams } from 'react-router-dom'
import { Card, Pagination } from '@/components/ui'
import { ResultGetClinicById } from '@/@types/adminPanelApi'
import { OnboardedClinic } from './components/onboarded-clinic'

const ClinicOnboarding = () => {
    const [searchParams] = useSearchParams()
    const onboard = searchParams.get('onboard')
    const [clinics, setClinics] = useState<string[]>()
    const [onboardedClinics, setOnboardedClinics] =
        useState<ResultGetClinicById[]>()
    const [tablePagination, setTablePagination] = useState({
        current_page: '',
        limit: '',
        total: '',
    })

    const getClinicServerNames = useCallback(async () => {
        try {
            const response = await apiGetClinicServerNames()
            setClinics(response.data.data)
        } catch (err) {
            console.error(err)
        }
    }, [])

    const getClinics = useCallback(async () => {
        try {
            const response = await apiGetClinic(
                tablePagination.current_page || 1
            )
            setOnboardedClinics(response.data.data.results)
            setTablePagination({
                current_page: response.data.data.page.toString(),
                limit: response.data.data.limit.toString(),
                total: response.data.data.totalResults.toString(),
            })
        } catch (err) {
            console.error(err)
        }
    }, [tablePagination.current_page])

    useEffect(() => {
        getClinics()
        getClinicServerNames()
    }, [getClinicServerNames, getClinics])

    return (
        <Breadcrums>
            <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1 mb-5 mt-8">
                Clinic Onboarding
            </h2>
            {!onboard && clinics && clinics.length > 0 ? (
                <OnboardClinicTable clinics={clinics} />
            ) : !onboard && clinics?.length === 0 ? (
                <Card bordered className="mb-4">
                    <p className="text-center text-gray-500 text-xl py-8">
                        You Currently have no clinic for onboarding
                    </p>
                </Card>
            ) : null}
            {onboard !== '' && onboard !== null && <OnboardingForm />}
            {!onboard && onboardedClinics && onboardedClinics.length > 0 ? (
                <>
                    <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1 mb-5 mt-8">
                        Onboarded Clinics
                    </h2>
                    <OnboardedClinic clinics={onboardedClinics} />
                    <div className="w-full flex justify-center">
                        <Pagination
                            currentPage={+tablePagination.current_page}
                            pageSize={+tablePagination.limit}
                            total={+tablePagination.total}
                            onChange={(page) => {
                                setTablePagination({
                                    ...tablePagination,
                                    current_page: page.toString(),
                                })
                            }}
                        />
                    </div>
                </>
            ) : !onboard && clinics?.length === 0 ? (
                <Card bordered className="mb-4">
                    <p className="text-center text-gray-500 text-xl py-8">
                        You Currently have no onboarded clinic
                    </p>
                </Card>
            ) : null}
        </Breadcrums>
    )
}

export default ClinicOnboarding
