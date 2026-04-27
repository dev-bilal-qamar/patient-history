import { Breadcrums } from '@/components/shared/breadcrums'

import { useCallback, useEffect, useState } from 'react'
import { apiGetClinics, GetClinicsResponse } from '@/services/ClinicService'

const ClinicOnboarding = () => {
    const [clinics, setClinics] = useState<GetClinicsResponse[]>()
    const [tablePagination, setTablePagination] = useState({
        current_page: '',
        limit: '',
        total: '',
    })

    const getClinics = useCallback(async () => {
        try {
            const response = await apiGetClinics()
            setClinics(response.data.data.results)
            // setTablePagination({
            //     current_page: response.data.data.page.toString(),
            //     limit: response.data.data.limit.toString(),
            //     total: response.data.data.totalResults.toString(),
            // })
        } catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        getClinics()
    }, [getClinics])

    return (
        <Breadcrums>
            <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1 mb-5 mt-8">
                Clinics
            </h2>
        </Breadcrums>
    )
}

export default ClinicOnboarding
