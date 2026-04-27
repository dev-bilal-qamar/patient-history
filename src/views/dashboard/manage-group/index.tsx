import { GetFacilityResponseData } from '@/@types/adminPanelApi'
import { Breadcrums } from '@/components/shared/breadcrums'
import { TableCell, TableRow } from '@/components/shared/table-component'
import {
    Button,
    Dialog,
    Input,
    Notification,
    Pagination,
    toast,
} from '@/components/ui'
import { AppRoutes } from '@/configs/routes.config/app-routes'
import {
    apiCreateFacility,
    apiGenerateFacilityCode,
    apiGetFacility,
} from '@/services/AdminPanelService'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'

const Facility = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`

    const [dialogIsOpen, setIsOpen] = useState(false)
    const [facilityInput, setFacilityInput] = useState('')
    const [facility, setFacility] = useState<GetFacilityResponseData[]>()
    const [tablePagination, setTablePagination] = useState({
        current_page: '',
        limit: '',
        total: '',
    })

    const getFacility = useCallback(async () => {
        try {
            const response = await apiGetFacility(
                tablePagination.current_page || 1
            )
            setFacility(
                response.data.data.results.sort((a, b) =>
                    a.createdAt > b.createdAt ? -1 : 1
                )
            )
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
        getFacility()
    }, [getFacility])

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const createFacility = async () => {
        try {
            const response = await apiCreateFacility({
                name: facilityInput,
            })
            setFacility([response.data.data, ...(facility || [])])
            setIsOpen(false)
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
    }

    const generateFacilityCode = async (id: string) => {
        try {
            await apiGenerateFacilityCode(id)
            toast.push(
                <Notification type="success" duration={5000}>
                    Code generated successfully
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            getFacility()
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
    }

    return (
        <Breadcrums>
            <div className="flex items-center gap-10 justify-between">
                <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1 mt-5">
                    Groups
                </h2>
                <Button className="" onClick={() => setIsOpen(true)}>
                    Create Group
                </Button>
            </div>
            <div>
                <div className="p-0">
                    <div className="overflow-x-auto pb-20">
                        <table className="table w-full">
                            <thead>
                                <TableRow element="th" className="h-14">
                                    <TableCell element="th">Group</TableCell>
                                    <TableCell element="th">
                                        Date Created
                                    </TableCell>
                                    <TableCell element="th">Code</TableCell>
                                    <TableCell element="th">URL</TableCell>
                                </TableRow>
                            </thead>
                            <tbody className="w-full">
                                {facility &&
                                    facility.map((item, index) => (
                                        <TableRow key={index} element="tb">
                                            <TableCell
                                                element="td"
                                                className="capitalize"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>{item.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell element="td">
                                                {dayjs(item.createdAt).format(
                                                    'DD-MM-YYYY'
                                                )}
                                            </TableCell>
                                            <TableCell element="td">
                                                {item?.code !== null &&
                                                item?.code !== undefined &&
                                                item?.code !== '' ? (
                                                    <span>{item?.code}</span>
                                                ) : (
                                                    <Button
                                                        variant="twoTone"
                                                        onClick={() => {
                                                            generateFacilityCode(
                                                                item._id
                                                            )
                                                        }}
                                                    >
                                                        Generate Code
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell element="td">
                                                {item?.code ? (
                                                    <a
                                                        href={`${baseUrl}${AppRoutes.appointmentBooking.replace(
                                                            ':code',
                                                            item.code
                                                        )}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {`${baseUrl}${AppRoutes.appointmentBooking.replace(
                                                            ':code',
                                                            item.code
                                                        )}`}
                                                    </a>
                                                ) : (
                                                    ''
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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
            </div>
            <Dialog
                width={520}
                isOpen={dialogIsOpen}
                overlayClassName="dialog-overlay overflow-y-auto"
                shouldCloseOnOverlayClick={false}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h4>Create Group</h4>
                <div className="mt-4">
                    <Input
                        placeholder="Enter Group Name"
                        type="text"
                        name="name"
                        className="w-full"
                        onChange={(e) => setFacilityInput(e.target.value)}
                    />
                    <Button
                        disabled={!facilityInput}
                        variant="solid"
                        className="mt-4 w-full"
                        onClick={createFacility}
                    >
                        Create Group
                    </Button>
                </div>
            </Dialog>
        </Breadcrums>
    )
}

export default Facility
