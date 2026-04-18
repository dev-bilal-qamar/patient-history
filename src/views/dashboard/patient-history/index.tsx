import { useState } from 'react'
import classNames from 'classnames'
import {
    Card,
    DatePicker,
    Input,
    Radio,
    Select,
    Table,
    Tooltip,
} from '@/components/ui'
import { HiCalendar } from 'react-icons/hi'
import { FileText } from 'lucide-react'
import { dummyPatientVisits } from './dummyData'
import { Breadcrums } from '@/components/shared/breadcrums'

const PatientHistory = () => {
    const [provider, setProvider] = useState<{
        value: string
        label: string
    } | null>(null)
    const [patient, setPatient] = useState('')
    const [fromDate, setFromDate] = useState<Date | null>(new Date(2026, 3, 18))
    const [toDate, setToDate] = useState<Date | null>(new Date(2026, 3, 18))
    const [searchBy, setSearchBy] = useState<'patient' | 'period'>('patient')

    const providerOptions = [
        { value: 'all', label: 'All' },
        { value: 'p1', label: 'Dr. Sarah Ali' },
        { value: 'p2', label: 'Dr. Omar Hassan' },
        { value: 'p3', label: 'Dr. Layla Rahman' },
    ]

    return (
        <Breadcrums>
            <div className="flex flex-col gap-6">
                <Card
                    bordered
                    className="border-gray-shade-2 rounded-2xl"
                    bodyClass="p-5 md:p-6"
                >
                    <Radio.Group
                        value={searchBy}
                        onChange={(v) => setSearchBy(v)}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4">
                            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5 items-center">
                                <div className="row-span-2 flex items-center justify-center self-stretch py-0.5">
                                    <Radio value="patient" className="shrink-0" />
                                </div>
                                <span className="text-xs font-medium text-gray-shade-1 min-w-0">
                                    Patient
                                </span>
                                <div className="min-w-0 w-full">
                                    <Input
                                        placeholder="Search Patient"
                                        className="w-full"
                                        value={patient}
                                        disabled={searchBy !== 'patient'}
                                        onChange={(e) =>
                                            setPatient(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5 items-center">
                                <div
                                    aria-hidden
                                    className="row-span-2 flex items-center justify-center self-stretch w-5 shrink-0"
                                />
                                <label className="text-xs font-medium text-gray-shade-1 min-w-0">
                                    Provider
                                </label>
                                <div className="min-w-0 w-full">
                                    <Select
                                        placeholder="Select Provider"
                                        options={providerOptions}
                                        value={provider}
                                        onChange={(value) =>
                                            setProvider(
                                                value as {
                                                    value: string
                                                    label: string
                                                }
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5 items-center">
                                <div className="row-span-2 flex items-center justify-center self-stretch py-0.5">
                                    <Radio value="period" className="shrink-0" />
                                </div>
                                <span className="text-xs font-medium text-gray-shade-1 min-w-0">
                                    From Date
                                </span>
                                <div className="min-w-0 w-full">
                                    <DatePicker
                                        value={fromDate}
                                        inputFormat="DD/MM/YYYY"
                                        inputSuffix={
                                            <HiCalendar className="text-lg text-primary-text" />
                                        }
                                        className="w-full"
                                        placeholder="Select from date"
                                        disabled={searchBy !== 'period'}
                                        onChange={setFromDate}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5 items-center">
                                <div
                                    aria-hidden
                                    className="row-span-2 flex items-center justify-center self-stretch w-5 shrink-0"
                                />
                                <label className="text-xs font-medium text-gray-shade-1 min-w-0">
                                    To Date
                                </label>
                                <div className="min-w-0 w-full">
                                    <DatePicker
                                        value={toDate}
                                        inputFormat="DD/MM/YYYY"
                                        inputSuffix={
                                            <HiCalendar className="text-lg text-primary-text" />
                                        }
                                        className="w-full"
                                        placeholder="Select to date"
                                        disabled={searchBy !== 'period'}
                                        onChange={setToDate}
                                    />
                                </div>
                            </div>
                        </div>
                    </Radio.Group>
                </Card>

                <div className="border-b border-gray-shade-2 mb-4" />
                <Card
                    bordered
                    className="border-gray-shade-2 rounded-2xl overflow-hidden"
                    bodyClass="p-0"
                >
                    <Table overflow>
                        <Table.THead>
                            <Table.Tr>
                                <Table.Th>Patient Code</Table.Th>
                                <Table.Th>Patient</Table.Th>
                                <Table.Th>Gender</Table.Th>
                                <Table.Th>Age</Table.Th>
                                <Table.Th>Mobile No</Table.Th>
                                <Table.Th>Provider</Table.Th>
                                <Table.Th className="text-center">
                                    Action
                                </Table.Th>
                            </Table.Tr>
                        </Table.THead>
                        <Table.TBody>
                            {dummyPatientVisits.map((row) => (
                                <Table.Tr key={row.id}>
                                    <Table.Td>{row.patientCode}</Table.Td>
                                    <Table.Td>{row.patientName}</Table.Td>
                                    <Table.Td>{row.gender}</Table.Td>
                                    <Table.Td>{row.age}</Table.Td>
                                    <Table.Td>{row.mobileNo}</Table.Td>
                                    <Table.Td>{row.provider}</Table.Td>
                                    <Table.Td className="text-center">
                                        <Tooltip title="View EMR Report">
                                            <button
                                                type="button"
                                                className={classNames(
                                                    'inline-flex items-center justify-center rounded-lg p-2',
                                                    'text-primary-text hover:bg-violet-50',
                                                    'transition-colors'
                                                )}
                                                aria-label="View EMR Report"
                                                onClick={() => undefined}
                                            >
                                                <FileText className="w-5 h-5" />
                                            </button>
                                        </Tooltip>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.TBody>
                    </Table>
                </Card>
            </div>
        </Breadcrums>
    )
}

export default PatientHistory
