import { TableCell, TableRow } from '@/components/shared/table-component'
import { ResultGetClinicById } from '@/@types/adminPanelApi'
import { ApiKeyCell } from './api-key-cell'

interface Props {
    clinics: ResultGetClinicById[]
}

export const OnboardedClinic: React.FC<Props> = ({ clinics }) => {
    return (
        <div className="mb-4 p-0">
            <div className="overflow-x-auto pb-20 border border-gray-shade-10 rounded-lg">
                <table className="table w-full">
                    <thead>
                        <TableRow element="th" className="h-14">
                            <TableCell element="th">Clinic Name</TableCell>
                            <TableCell element="th">Clinic ID</TableCell>
                            <TableCell element="th">Clinic Api Key</TableCell>
                        </TableRow>
                    </thead>
                    <tbody className="w-full">
                        {clinics.map((item, index) => (
                            <TableRow key={index} element="tb">
                                <TableCell element="td">{item.name}</TableCell>
                                <TableCell element="td">{item._id}</TableCell>
                                <ApiKeyCell apiKey={item.key} />
                            </TableRow>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
