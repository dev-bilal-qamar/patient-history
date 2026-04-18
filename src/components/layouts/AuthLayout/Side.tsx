import { cloneElement } from 'react'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { useLocation } from 'react-router-dom'
import clsx from 'clsx'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    const pathname = useLocation().pathname
    const isPublicForm =
        pathname === '/patient-form/' ||
        pathname.startsWith('/appointment-booking')

    return (
        <div
            className={clsx(
                'grid h-full',
                isPublicForm ? 'grid-cols-1' : 'grid-cols-2'
            )}
        >
            <div
                className={clsx(
                    "bg-no-repeat bg-cover flex bg-[url('/img/others/auth-cover-bg.png')]",
                    isPublicForm && 'hidden'
                )}
            >
                <div className="w-full h-full bg-primary-100/[35%] px-6 pb-6 items-end flex justify-end relative">
                    <h2 className="absolute bottom-24 font-normsPro text-4xl font-normal text-white right-10">
                        Welcome to
                    </h2>
                    <img
                        src="/img/logo/logo.png"
                        alt={APP_NAME}
                        className="h-[112px] max-w-[290px] w-full object-contain"
                    />
                </div>
            </div>
            <div
                className={clsx(
                    'flex flex-col dark:bg-gray-800 pb-6 relative',
                    isPublicForm
                        ? pathname === '/patient-form/'
                            ? 'bg-gray-shade-4'
                            : ''
                        : ' bg-white justify-center items-center'
                )}
            >
                {!isPublicForm && (
                    <>
                        <div className="absolute bottom-6 left-6">
                            <img
                                src="/img/others/r4-insight.png"
                                alt={APP_NAME}
                                className="h-[118px] w-full max-w-[318px] object-contain"
                            />
                        </div>
                        <div className="absolute right-0 h-full w-full flex justify-end">
                            <img
                                src="/img/logo/digisol-vertical.png"
                                alt={APP_NAME}
                                className="h-full w-full max-w-[300px] object-contain"
                            />
                        </div>
                    </>
                )}
                <div>
                    {!isPublicForm && <div>{content}</div>}
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
