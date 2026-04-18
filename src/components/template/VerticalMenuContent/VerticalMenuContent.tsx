/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import Menu from '@/components/ui/Menu'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import { themeConfig } from '@/configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import useMenuActive from '@/utils/hooks/useMenuActive'
import { useTranslation } from 'react-i18next'
import { Direction, NavMode } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
import { ChevronDown } from 'lucide-react'

export interface VerticalMenuContentProps {
    navMode: NavMode
    collapsed?: boolean
    routeKey: string
    navigationTree?: NavigationTree[]
    userAuthority: string[]
    onMenuItemClick?: () => void
    direction?: Direction
}

const { MenuGroup } = Menu

const VerticalMenuContent = (props: VerticalMenuContentProps) => {
    const {
        navMode = themeConfig.navMode,
        collapsed,
        routeKey,
        navigationTree = [],
        userAuthority = [],
        onMenuItemClick,
        direction = themeConfig.direction,
    } = props

    const { t } = useTranslation()

    const [defaulExpandKey, setDefaulExpandKey] = useState<string[]>([])
    const [expandedGroups, setExpandedGroups] = useState<
        Record<string, boolean>
    >({})

    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    useEffect(() => {
        if (defaulExpandKey.length === 0 && activedRoute?.parentKey) {
            setDefaulExpandKey([activedRoute?.parentKey])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activedRoute?.parentKey])

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const toggleGroup = (key: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [key]: !(prev[key] ?? true),
        }))
    }

    const getNavItem = (nav: NavigationTree) => {
        if (nav.subMenu.length === 0 && nav.type === NAV_ITEM_TYPE_ITEM) {
            return (
                <VerticalSingleMenuItem
                    key={nav.key}
                    nav={nav}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                    onLinkClick={handleLinkClick}
                />
            )
        }

        if (nav.subMenu.length > 0 && nav.type === NAV_ITEM_TYPE_COLLAPSE) {
            return (
                <VerticalCollapsedMenuItem
                    key={nav.key}
                    nav={nav}
                    sideCollapsed={collapsed}
                    userAuthority={userAuthority}
                    direction={direction}
                    onLinkClick={onMenuItemClick}
                />
            )
        }

        if (nav.type === NAV_ITEM_TYPE_TITLE) {
            if (nav.subMenu.length > 0) {
                const accessibleSubMenu = nav.subMenu.filter((item) => {
                    return !item.access?.length || item.access.includes('user')
                })

                if (accessibleSubMenu.length === 0) {
                    return null
                }

                const isExpanded = expandedGroups[nav.key] ?? true

                return (
                    <AuthorityCheck
                        key={nav.key}
                        userAuthority={userAuthority}
                        authority={nav.authority}
                    >
                        <MenuGroup
                            label={
                                <div
                                    className="flex items-center justify-between cursor-pointer select-none"
                                    onClick={() => toggleGroup(nav.key)}
                                >
                                    <span>
                                        {t(nav.translateKey) || nav.title}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${
                                            isExpanded
                                                ? 'rotate-0'
                                                : '-rotate-90'
                                        }`}
                                    />
                                </div>
                            }
                        >
                            {isExpanded &&
                                accessibleSubMenu.map((subNav) =>
                                    subNav.subMenu.length > 0 ? (
                                        <VerticalCollapsedMenuItem
                                            key={subNav.key}
                                            nav={subNav}
                                            sideCollapsed={collapsed}
                                            userAuthority={userAuthority}
                                            direction={direction}
                                            onLinkClick={onMenuItemClick}
                                        />
                                    ) : (
                                        <VerticalSingleMenuItem
                                            key={subNav.key}
                                            nav={subNav}
                                            sideCollapsed={collapsed}
                                            userAuthority={userAuthority}
                                            direction={direction}
                                            onLinkClick={onMenuItemClick}
                                        />
                                    )
                                )}
                        </MenuGroup>
                    </AuthorityCheck>
                )
            } else {
                ;<>
                    <MenuGroup label={nav.title} />
                </>
            }
        }
    }

    return (
        <div className="h-full flex flex-col justify-between gap-10 pb-5">
            <Menu
                className="px-2 pb-4 h-[calc(100dvh-170px)] overflow-y-auto overflow-x-hidden"
                variant={navMode}
                sideCollapsed={collapsed}
                defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
                defaultExpandedKeys={defaulExpandKey}
            >
                {navigationTree.map((nav) => getNavItem(nav))}
            </Menu>
            <div className="flex w-full items-center justify-center px-4 gap-2 opacity-55">
                <h6 className="font-bold text-lg font-comfortaa text-gray-shade-17">
                    Powered by
                </h6>
                <img
                    src="/img/logo/digisol.jpeg"
                    alt="logo"
                    className="w-full max-w-24 h-[38px] object-contain"
                />
            </div>
        </div>
    )
}

export default VerticalMenuContent
