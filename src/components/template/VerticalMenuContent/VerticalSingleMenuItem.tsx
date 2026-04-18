import Tooltip from '@/components/ui/Tooltip'
import Menu from '@/components/ui/Menu'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
import { useSelector } from 'react-redux'
import { toast, Notification } from '@/components/ui'
import { isAdmin } from '@/components/shared/admin-check'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
    title: string
    translateKey: string
    direction?: Direction
}

interface DefaultItemProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    sideCollapsed?: boolean
    userAuthority: string[]
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps {}

const CollapsedItem = ({
    title,
    translateKey,
    children,
    direction,
}: CollapsedItemProps) => {
    return (
        <Tooltip
            title={title}
            placement={direction === 'rtl' ? 'left' : 'right'}
        >
            {children}
        </Tooltip>
    )
}

const DefaultItem = (props: DefaultItemProps) => {
    const { nav, onLinkClick, sideCollapsed, userAuthority } = props
    const clinic = useSelector((state: any) => state.auth.user.clinicId)
    const userRole = useSelector((state: any) => state.auth.user.role)

    const handleLinkClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        navKey: string
    ) => {
        if (!clinic && !isAdmin(userRole) && navKey !== 'dashboard') {
            e.preventDefault()
            toast.push(
                <Notification type="danger" duration={2000}>
                    Please select a clinic first
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
                <Link
                    to={nav.path}
                    className="flex items-center h-full w-full"
                    target={nav.isExternalLink ? '_blank' : ''}
                    onClick={(e) => {
                        handleLinkClick(e, nav.key)
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }}
                >
                    <VerticalMenuIcon icon={nav.icon} />
                    {!sideCollapsed && (
                        <span className="text-gray-shade-1 font-normal">
                            <Trans
                                i18nKey={nav.translateKey}
                                defaults={nav.title}
                            />
                        </span>
                    )}
                </Link>
            </MenuItem>
        </AuthorityCheck>
    )
}

const VerticalSingleMenuItem = ({
    nav,
    onLinkClick,
    sideCollapsed,
    userAuthority,
    direction,
}: Omit<VerticalMenuItemProps, 'title' | 'translateKey'>) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            {sideCollapsed ? (
                <CollapsedItem
                    title={nav.title}
                    translateKey={nav.translateKey}
                    direction={direction}
                >
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        userAuthority={userAuthority}
                        onLinkClick={onLinkClick}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    userAuthority={userAuthority}
                    onLinkClick={onLinkClick}
                />
            )}
        </AuthorityCheck>
    )
}

export default VerticalSingleMenuItem
