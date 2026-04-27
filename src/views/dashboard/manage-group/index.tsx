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
import type { Group } from '@/@types/group'
import { apiGetGroups, apiPostGroup } from '@/services/GroupService'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'

const Groups = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [groupInput, setGroupInput] = useState('')
    const [groups, setGroups] = useState<Group[]>()
    const [tablePagination, setTablePagination] = useState({
        current_page: '',
        limit: '',
        total: '',
    })

    const getGroups = useCallback(async () => {
        try {
            const response = await apiGetGroups()
            setGroups(response.data.data)
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
        getGroups()
    }, [getGroups])

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const createGroup = async () => {
        try {
            const response = await apiPostGroup({
                name: groupInput,
            })
            if (response.data.success) {
                toast.push(
                    <Notification type="success" duration={2000}>
                        {response.data.message}
                    </Notification>
                )
            }
            setIsOpen(false)
            getGroups()
        } catch (err) {
            console.error(err)
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
                                </TableRow>
                            </thead>
                            <tbody className="w-full">
                                {groups && groups.length > 0 ? (
                                    groups.map((item) => (
                                        <TableRow key={item._id} element="tb">
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
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow element="tb">
                                        <TableCell element="td">
                                            <span className="text-gray-shade-10 text-lg font-medium text-center">
                                                No groups found
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {groups && groups.length > 0 && (
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
                )}
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
                        onChange={(e) => setGroupInput(e.target.value)}
                    />
                    <Button
                        disabled={!groupInput}
                        variant="solid"
                        className="mt-4 w-full"
                        onClick={createGroup}
                    >
                        Create Group
                    </Button>
                </div>
            </Dialog>
        </Breadcrums>
    )
}

export default Groups
