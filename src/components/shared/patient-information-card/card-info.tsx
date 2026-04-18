import dayjs from 'dayjs'
import { getTemplateResultVerify } from '@/@types/adminPanelApi'

interface Props {
    patient: getTemplateResultVerify['patient']
}

const CardInfo: React.FC<Props> = ({ patient }) => {
    return (
        <div className="flex flex-col gap-1">
            <h2 className="md:text-2xl sm:text-lg text-base font-normal">
                {patient.firstName} {patient.lastName} - {patient.patientId}
            </h2>
            <p className="sm:text-sm text-xs">
                <span className="font-bold text-black">Email:</span>{' '}
                {patient.email}
                {patient.email && patient.mobileNumber && ' | '}
                <span className="font-bold text-black">Contact:</span>{' '}
                {patient.mobileNumber}
            </p>
            <p className="sm:text-sm text-xs">
                {patient.UAEID && patient.UAEID !== '111-1111-1111111-1' && (
                    <>
                        <span className="font-bold text-black">UAE ID:</span>{' '}
                        {patient.UAEID}
                    </>
                )}
                {(!patient.UAEID || patient.UAEID === '111-1111-1111111-1') &&
                    patient.NHSNumber &&
                    patient.NHSNumber !== '00000' && (
                        <>
                            <span className="font-bold text-black">
                                Passport #:
                            </span>{' '}
                            {patient.NHSNumber}
                        </>
                    )}
            </p>
            <div className="flex gap-2 items-center">
                {patient.dob && (
                    <p className="sm:text-sm text-xs">
                        <span className="font-bold text-black">DOB:</span>{' '}
                        {dayjs(patient.dob).format('DD-MM-YYYY')}{' '}
                        {patient.sex && '|'}
                    </p>
                )}
                {patient.sex && (
                    <p className="sm:text-sm text-xs">
                        <span className="font-bold text-black">Gender:</span>{' '}
                        {patient.sex === 'M'
                            ? 'Male'
                            : patient.sex === 'F'
                            ? 'Female'
                            : patient.sex === 'U'
                            ? 'Unknown'
                            : patient.sex}
                    </p>
                )}
            </div>
        </div>
    )
}

export default CardInfo
