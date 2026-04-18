import Header from '@/components/template/Header'
import UserDropdown from '@/components/template/UserDropdown'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import View from '@/views'
import { BsInfoCircle } from 'react-icons/bs'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <style>{`
                .release-dropdown-item.menu-item-hoverable:hover {
                    background-color: #EE3851 !important;
                    color: white !important;
                    
                }
                .release-dropdown-item.menu-item-hoverable:hover > div {
                    color: white !important;
                }
                .release-dropdown-item.menu-item-hoverable:hover > div > span {
                    color: white !important;
                }
                .release-dropdown-item.menu-item-hoverable:hover > div > span.text-gray-500 {
                    color: rgba(255, 255, 255, 0.9) !important;
                }
            `}</style>

            <div className="mx-2 hidden lg:flex">
                <BsInfoCircle className="text-xl" />
            </div>
            <UserDropdown hoverable={false} />
        </>
    )
}

const ModernLayout = () => {
    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    <Header
                        className="border-b border-gray-200 dark:border-gray-700"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />
                    <View />
                </div>
            </div>
        </div>
    )
}

export default ModernLayout
