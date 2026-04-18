import React, { Fragment } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { RiArrowRightSFill } from 'react-icons/ri'
import clsx from 'clsx'

interface Props {
    children: React.ReactNode
}

export const Breadcrums: React.FC<Props> = ({ children }) => {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const { pathname } = location
    const pathnames = pathname.split('/').filter((x) => x)
    const jobId = searchParams.get('jobId')

    const jobQuery = jobId ? `?jobId=${jobId}` : ''

    return (
        <div className="w-full mx-auto bg-white p-6 rounded-2xl h-full">
            <div className="flex items-center gap-1 pb-4">
                {pathnames &&
                    pathnames.map((item, index) => (
                        <Fragment key={index}>
                            <Link
                                to={
                                    '/' +
                                    pathnames.slice(0, index + 1).join('/') +
                                    jobQuery
                                }
                            >
                                <h3
                                    className={clsx(
                                        'uppercase text-sm font-bold text-primary-text',
                                        index === pathnames.length - 1 &&
                                            'underline'
                                    )}
                                >
                                    {item}
                                </h3>
                            </Link>
                            <RiArrowRightSFill className="text-primary-text text-xl last:hidden" />
                        </Fragment>
                    ))}
            </div>
            <div className="h-[calc(100%-36px)] relative overflow-y-auto !overflow-x-hidden">
                {children}
            </div>
        </div>
    )
}
