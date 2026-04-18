import { HiOutlineHome } from 'react-icons/hi'
import { LuLayoutDashboard } from 'react-icons/lu'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <LuLayoutDashboard />,
    home: <HiOutlineHome />,
}

export default navigationIcon
