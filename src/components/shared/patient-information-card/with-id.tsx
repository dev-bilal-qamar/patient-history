import React, { useCallback, useEffect, useState } from 'react'
import { patientFormResult } from '@/@types/smartFormsApi'
import { Notification, toast } from '@/components/ui'
import { apiGetPatientByClinicId } from '@/services/SmartFormsService'
import CardInfo from './card-info'

interface Props {
    clinicId: string
    patientId: string
}

const PatientInformationCardWithId: React.FC<Props> = ({
    clinicId,
    patientId,
}) => {
    const [selectedPatient, setSelectedPatient] = useState<patientFormResult>()

    const getPatientData = useCallback(async () => {
        try {
            const res = await apiGetPatientByClinicId(clinicId, patientId || '')

            const uniqueData = Object.values(
                res.data.data.results.reduce(
                    (
                        acc: {
                            [key: string]: patientFormResult
                        },
                        item: patientFormResult
                    ) => {
                        acc[item.patientId] = item
                        return acc
                    },
                    {}
                )
            )
            setSelectedPatient(uniqueData[0])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={5000}>
                    {err.response.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }, [clinicId, patientId])

    useEffect(() => {
        getPatientData()
    }, [getPatientData])

    return selectedPatient ? (
        <div className="flex items-center w-full bg-white rounded-md gap-4 px-4 py-2 border border-gray-shade-18 shadow-elevation-6">
            <img
                className="w-16 h-16 rounded-full object-fill border border-slate-300 bg-black/10"
                src={
                    selectedPatient.sex.toLowerCase() === 'f'
                        ? '/img/avatars/girl.png'
                        : '/img/avatars/men.png'
                }
                alt=""
            />
            <CardInfo patient={selectedPatient} />
        </div>
    ) : null
}

export default PatientInformationCardWithId
