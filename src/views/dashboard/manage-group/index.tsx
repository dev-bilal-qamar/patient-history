import { Breadcrums } from '@/components/shared/breadcrums'
import { TableCell, TableRow } from '@/components/shared/table-component'
import {
    Button,
    Dialog,
    Input,
    Notification,
    Spinner,
    Table,
    // Pagination,
    toast,
} from '@/components/ui'
import type { Group } from '@/@types/group'
import { apiGetGroups, apiPostGroup } from '@/services/GroupService'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import Th from '@/components/ui/Table/Th'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'

const Groups = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [groupInput, setGroupInput] = useState('')
    const [groups, setGroups] = useState<Group[]>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    // const [tablePagination, setTablePagination] = useState({
    //     current_page: '',
    //     limit: '',
    //     total: '',
    // })

    const getGroups = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await apiGetGroups()
            setGroups(response.data.data)
            // setTablePagination({
            //     current_page: response.data.data.page.toString(),
            //     limit: response.data.data.limit.toString(),
            //     total: response.data.data.totalResults.toString(),
            // })
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={2000}>
                    {err?.response?.data?.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsLoading(false)
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
            setIsSubmitting(true)
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
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={2000}>
                    {err?.response?.data?.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Breadcrums>
            <div className="flex items-center gap-10 justify-between">
                <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1 mt-6">
                    Groups
                </h2>
                <Button className="" onClick={() => setIsOpen(true)}>
                    Create Group
                </Button>
            </div>
            <div>
                <div className="p-0">
                    <div className="overflow-x-auto pb-20">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-96">
                                <Spinner size={40} />
                            </div>
                        ) : (
                            <Table
                                asElement="table"
                                className="table w-full mt-6"
                            >
                                <THead asElement="thead">
                                    <Tr asElement="tr" className="h-14">
                                        <Th asElement="th">Group</Th>
                                        <Th asElement="th">Date Created</Th>
                                    </Tr>
                                </THead>
                                <TBody asElement="tbody" className="w-full">
                                    {groups && groups.length > 0 ? (
                                        groups.map((item) => (
                                            <Tr key={item._id} asElement="tr">
                                                <Td
                                                    asElement="td"
                                                    className="capitalize"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{item.name}</span>
                                                    </div>
                                                </Td>
                                                <Td asElement="td">
                                                    {dayjs(
                                                        item.createdAt
                                                    ).format('DD-MM-YYYY')}
                                                </Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr asElement="tr">
                                            <Td
                                                asElement="td"
                                                colSpan={3}
                                                className="py-12 text-center text-lg font-medium font-comfortaa text-gray-shade-10"
                                            >
                                                No groups found
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            </Table>
                        )}
                    </div>
                </div>
                {/* {groups && groups.length > 0 && (
                    <div className="w-full flex justify-center">
                        <Pagination
                            currentPage={1}
                            pageSize={10}
                            total={groups.length}
                            onChange={(page) => {
                                console.log(page)
                            }}
                        />
                    </div>
                )} */}
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
                        loading={isSubmitting}
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
