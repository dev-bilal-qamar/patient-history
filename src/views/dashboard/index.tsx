/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom'
import { dashboardData } from './data'
import { useSelector } from 'react-redux'
import { isAdmin } from '@/components/shared/admin-check'
import { Notification, toast } from '@/components/ui'

const Dashboard = () => {
    const clinic = useSelector((state: any) => state.auth.user.clinicId)
    const userRole = useSelector((state: any) => state.auth.user.role)

    return (
        <div className="h-full relative">
            <div className="relertive">
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mx-auto">
                    {dashboardData.map((item, index) => (
                        <Link
                            key={index}
                            to={item.href || ''}
                            className="border border-gray-shade-2 w-full max-w-full h-[311px] rounded-2xl py-5 px-4 bg-white"
                        >
                            <div className="w-full flex justify-between gap-3 items-center h-8 mb-4">
                                <h2 className="text-sm text-primary-text font-medium uppercase">
                                    {item.name}
                                </h2>
                            </div>
                            <div className="w-auto h-[calc(100%-43px)] border p-3.5 rounded-lg">
                                <img
                                    src={item.imageSrc}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
