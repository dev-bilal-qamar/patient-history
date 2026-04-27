import CustomButton from '@/components/ui/Button/custom-button'
import { FiEdit } from 'react-icons/fi'
import { TableCell, TableRow } from '@/components/shared/table-component'
import { Link } from 'react-router-dom'

interface Props {
    clinics: string[]
}

export const OnboardClinicTable: React.FC<Props> = ({ clinics }) => {
    return (
        <div className="mb-4 p-0">
            <div className="overflow-x-auto pb-20">
                <table className="table w-full">
                    <thead>
                        <TableRow element="th" className="h-14">
                            <TableCell element="th">Clinics</TableCell>
                            <TableCell element="th">Action</TableCell>
                        </TableRow>
                    </thead>
                    <tbody className="w-full">
                        {clinics.map((item, index) => (
                            <TableRow key={index} element="tb">
                                <TableCell element="td">{item}</TableCell>
                                <TableCell element="td">
                                    <Link to={`?onboard=${item}`}>
                                        <CustomButton
                                            variant={'outline'}
                                            className="uppercase w-auto px-3 h-7 text-xs py-0"
                                            iconinstart={
                                                <FiEdit className="text-gray-shade-10 text-lg" />
                                            }
                                        >
                                            onboard
                                        </CustomButton>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
