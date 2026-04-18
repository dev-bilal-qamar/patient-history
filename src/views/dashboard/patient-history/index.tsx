import { useMemo, useState } from 'react'
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
    const [searchBy, setSearchBy] = useState<'patient' | 'provider'>('patient')

    const providerOptions = [
        { value: 'all', label: 'All' },
        { value: 'p1', label: 'Dr. Sarah Ali' },
        { value: 'p2', label: 'Dr. Omar Hassan' },
        { value: 'p3', label: 'Dr. Layla Rahman' },
    ]

    const summary = useMemo(() => {
        const total = dummyPatientVisits.length
        const male = dummyPatientVisits.filter(
            (r) => r.gender.toLowerCase() === 'male'
        ).length
        const female = dummyPatientVisits.filter(
            (r) => r.gender.toLowerCase() === 'female'
        ).length
        return { total, male, female }
    }, [])

    return (
        <Breadcrums>
            <div className="flex flex-col gap-6">
                <Card
                    bordered
                    className="border-gray-shade-2 rounded-2xl shadow-md"
                    bodyClass="p-5 md:p-6"
                >
                    <div className="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8">
                        <div className="flex-1 min-w-0 flex flex-col gap-5">
                            <Radio.Group
                                value={searchBy}
                                onChange={(v) =>
                                    setSearchBy(v as 'patient' | 'provider')
                                }
                            >
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <Radio value="patient" />
                                        <span className="text-sm font-medium text-gray-shade-1">
                                            Patient and Date
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                        <Radio value="provider" />
                                        <span className="text-sm font-medium text-gray-shade-1">
                                            Provider and Date
                                        </span>
                                    </label>
                                </div>
                            </Radio.Group>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                <div className="grid gap-y-1.5">
                                    <label
                                        htmlFor="ph-search-patient"
                                        className="text-xs font-medium text-gray-shade-1"
                                    >
                                        Patient
                                    </label>
                                    <Input
                                        id="ph-search-patient"
                                        placeholder="Search Patient"
                                        className="w-full"
                                        value={patient}
                                        disabled={searchBy !== 'patient'}
                                        onChange={(e) =>
                                            setPatient(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-y-1.5">
                                    <span className="text-xs font-medium text-gray-shade-1">
                                        Provider
                                    </span>
                                    <Select
                                        placeholder="Select Provider"
                                        options={providerOptions}
                                        value={provider}
                                        isDisabled={searchBy !== 'provider'}
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
                                <div className="grid gap-y-1.5">
                                    <span className="text-xs font-medium text-gray-shade-1">
                                        From Date
                                    </span>
                                    <DatePicker
                                        value={fromDate}
                                        inputFormat="DD/MM/YYYY"
                                        inputSuffix={
                                            <HiCalendar className="text-lg text-primary-text" />
                                        }
                                        className="w-full"
                                        placeholder="Select from date"
                                        onChange={setFromDate}
                                    />
                                </div>
                                <div className="grid gap-y-1.5">
                                    <span className="text-xs font-medium text-gray-shade-1">
                                        To Date
                                    </span>
                                    <DatePicker
                                        value={toDate}
                                        inputFormat="DD/MM/YYYY"
                                        inputSuffix={
                                            <HiCalendar className="text-lg text-primary-text" />
                                        }
                                        className="w-full"
                                        placeholder="Select to date"
                                        onChange={setToDate}
                                    />
                                </div>
                            </div>
                        </div>

                        <aside className="w-full lg:w-64 xl:w-72 shrink-0 flex flex-col border-t border-gray-shade-2 lg:border-t-0 lg:border-l lg:pl-8 pt-5 lg:pt-0">
                            <h3 className="text-sm font-semibold text-gray-shade-5">
                                Summary
                            </h3>
                            <div className="border-b border-gray-shade-2 mt-2 mb-3" />
                            <dl className="space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-gray-shade-1 font-medium">
                                        Total Patients
                                    </dt>
                                    <dd className="text-gray-shade-5 font-semibold tabular-nums">
                                        {summary.total}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-gray-shade-1 font-medium">
                                        Male Patients
                                    </dt>
                                    <dd className="text-gray-shade-5 font-semibold tabular-nums">
                                        {summary.male}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-gray-shade-1 font-medium">
                                        Female Patients
                                    </dt>
                                    <dd className="text-gray-shade-5 font-semibold tabular-nums">
                                        {summary.female}
                                    </dd>
                                </div>
                            </dl>
                        </aside>
                    </div>
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
