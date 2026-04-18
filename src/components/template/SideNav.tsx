import classNames from 'classnames'
import ScrollBar from '@/components/ui/ScrollBar'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
    SIDE_NAV_CONTENT_GUTTER,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import useResponsive from '@/utils/hooks/useResponsive'
import { useAppSelector } from '@/store'
import NavigationConfig from '@/configs/navigation.config'

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = () => {
    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel
    )
    const navMode = useAppSelector((state) => state.theme.navMode)
    const mode = useAppSelector((state) => state.theme.mode)
    const direction = useAppSelector((state) => state.theme.direction)
    const currentRouteKey = useAppSelector(
        (state) => state.base.common.currentRouteKey
    )
    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse
    )

    const { larger } = useResponsive()

    const sideNavColor = () => {
        if (navMode === NAV_MODE_THEMED) {
            return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
        }
        return `side-nav-${navMode}`
    }

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) {
            return NAV_MODE_DARK
        }

        if (navMode === NAV_MODE_TRANSPARENT) {
            return mode
        }

        return navMode
    }

    const navigationConfig = NavigationConfig()

    const menuContent = (
        <VerticalMenuContent
            navMode={navMode}
            collapsed={sideNavCollapse}
            navigationTree={navigationConfig}
            routeKey={currentRouteKey}
            userAuthority={['user']}
            direction={direction}
        />
    )

    return (
        <>
            {larger.lg && (
                <div
                    style={
                        sideNavCollapse ? sideNavCollapseStyle : sideNavStyle
                    }
                    className="flex-shrink-0"
                >
                    <div
                        style={
                            sideNavCollapse
                                ? sideNavCollapseStyle
                                : sideNavStyle
                        }
                        className={classNames(
                            'side-nav bg-green-shade-1 shadow-sidebar fixed left-0 top-0 h-screen',
                            sideNavColor(),
                            !sideNavCollapse && 'side-nav-expand'
                        )}
                    >
                        <div className="side-nav-header mb-4">
                            <Logo
                                mode={logoMode()}
                                type={sideNavCollapse ? 'streamline' : 'full'}
                                imgClass={
                                    sideNavCollapse
                                        ? 'w-12 h-16 object-contain py-1'
                                        : 'w-[160px] h-16 object-contain'
                                }
                                style={{ borderBottom: '1px solid #e5e5e5' }}
                                className={
                                    sideNavCollapse
                                        ? SIDE_NAV_CONTENT_GUTTER
                                        : LOGO_X_GUTTER
                                }
                            />
                        </div>
                        {sideNavCollapse ? (
                            menuContent
                        ) : (
                            <div className="side-nav-content check ">
                                <ScrollBar autoHide direction={direction}>
                                    {menuContent}
                                </ScrollBar>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default SideNav
