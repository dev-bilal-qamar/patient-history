import { FaHistory } from 'react-icons/fa'
import { HiOutlineHome } from 'react-icons/hi'
import { LuLayoutDashboard } from 'react-icons/lu'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <LuLayoutDashboard />,
    home: <HiOutlineHome />,
    patientHistory: <FaHistory />,
}

export default navigationIcon
