import { forwardRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import type { ScrollbarProps as ReactCustomScrollbarProps } from 'react-custom-scrollbars-2'
import type { TypeAttributes } from '../@types/common'

export interface ScrollbarProps extends ReactCustomScrollbarProps {
    direction?: TypeAttributes.Direction
}

export type ScrollbarRef = Scrollbars

const ScrollBar = forwardRef<ScrollbarRef, ScrollbarProps>((props, ref) => {
    const { direction = 'ltr', ...rest } = props

    return (
        <Scrollbars
            ref={ref}
            renderView={(viewProps) => (
                <div
                    {...viewProps}
                    style={{
                        ...viewProps.style,
                        ...(direction === 'rtl' && {
                            marginLeft: viewProps.style.marginRight,
                            marginRight: 0,
                        }),
                    }}
                />
            )}
            renderTrackVertical={({ style, ...trackProps }) => (
                <div
                    {...trackProps}
                    className="scrollbar-rc-track"
                    style={style}
                />
            )}
            renderTrackHorizontal={({ style, ...trackProps }) => (
                <div
                    {...trackProps}
                    className="scrollbar-rc-track"
                    style={style}
                />
            )}
            renderThumbVertical={({ style, ...thumbProps }) => {
                const { backgroundColor: _bg, ...thumbStyle } = style || {}
                return (
                    <div
                        {...thumbProps}
                        className="scrollbar-rc-thumb"
                        style={thumbStyle}
                    />
                )
            }}
            renderThumbHorizontal={({ style, ...thumbProps }) => {
                const { backgroundColor: _bg, ...thumbStyle } = style || {}
                return (
                    <div
                        {...thumbProps}
                        className="scrollbar-rc-thumb"
                        style={thumbStyle}
                    />
                )
            }}
            {...rest}
        />
    )
})

ScrollBar.displayName = 'ScrollBar'

export default ScrollBar
