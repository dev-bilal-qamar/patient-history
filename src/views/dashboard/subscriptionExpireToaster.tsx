import { GetClinicByIdSubscription } from '@/@types/adminPanelApi'
import React from 'react'
import { IoClose } from 'react-icons/io5'

interface Props {
    subscriptions: GetClinicByIdSubscription[]
}

const SubscriptionExpireToaster: React.FC<Props> = ({ subscriptions }) => {
    const [currentSubscriptions, setCurrentSubscriptions] = React.useState<
        GetClinicByIdSubscription[]
    >([])

    React.useEffect(() => {
        const today = new Date()
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)

        // Filter subscriptions expiring in the next 7 days
        const filteredSubscriptions = subscriptions.filter(
            ({ expiry, status }) => {
                if (status !== 'active') return false
                const expiryDate = new Date(expiry)
                return expiryDate >= today && expiryDate <= nextWeek
            }
        )

        setCurrentSubscriptions(filteredSubscriptions)
    }, [subscriptions])

    const handleClose = () => {
        // Remove the first subscription from the list
        setCurrentSubscriptions((prev) => prev.slice(1))
    }

    if (currentSubscriptions.length === 0) {
        return null
    }

    const [currentSubscription] = currentSubscriptions
    const expiryDate = new Date(currentSubscription.expiry)
    const today = new Date()
    const daysLeft = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    return (
        <div className="fixed bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center justify-between gap-8 h-16 right-2 xl:right-8 top-[91%] sm:top-[90%] xl:top-[85%] ml-2 z-50">
            <p className="block sm:inline text-base">
                <strong className="font-bold">Warning! </strong>
                Your subscription <strong>
                    {currentSubscription.type}
                </strong>{' '}
                will expire in{' '}
                <strong>
                    {daysLeft} day{daysLeft > 1 ? 's' : ''}
                </strong>
            </p>
            <IoClose
                className="cursor-pointer h-10 w-10 sm:h-8 sm:w-8 text-red-700"
                onClick={handleClose}
            />
        </div>
    )
}

export default SubscriptionExpireToaster
