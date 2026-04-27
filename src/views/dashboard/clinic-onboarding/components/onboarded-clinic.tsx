import { ApiKeyCell } from './api-key-cell'
import Table from '@/components/ui/Table'
import Tr from '@/components/ui/Table/Tr'
import THead from '@/components/ui/Table/THead'
import Th from '@/components/ui/Table/Th'
import Td from '@/components/ui/Table/Td'
import TBody from '@/components/ui/Table/TBody'
import { Clinic } from '@/@types/clinic'

interface Props {
    clinics: Clinic[]
}

export const OnboardedClinic: React.FC<Props> = ({ clinics }) => {
    return (
        <div className="p-0 mt-6">
            <Table asElement="table" className="table w-full">
                <THead asElement="thead">
                    <Tr asElement="tr" className="h-14">
                        <Th asElement="th">Clinic Name</Th>
                        <Th asElement="th">Clinic ID</Th>
                        <Th asElement="th">Clinic Api Key</Th>
                    </Tr>
                </THead>
                <TBody asElement="tbody" className="w-full">
                    {clinics.length > 0 ? (
                        clinics.map((item) => (
                            <Tr key={item._id} asElement="tr">
                                <Td asElement="td">{item.name}</Td>
                                <Td asElement="td">{item._id}</Td>
                                <ApiKeyCell apiKey={item.key} />
                            </Tr>
                        ))
                    ) : (
                        <Tr asElement="tr" className="text-center">
                            <Td asElement="td" className="text-center">
                                <span className="text-gray-shade-10 text-lg font-medium text-center font-comfortaa">
                                    No clinics found
                                </span>
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </div>
    )
}
