import { Link } from 'react-router-dom'
import { ArrowRight, History } from 'lucide-react'
import { dashboardData } from './data'
import { Breadcrums } from '@/components/shared/breadcrums'

const Dashboard = () => {
    return (
        <Breadcrums>
            <div className="relative min-h-[min(560px,calc(100vh-12rem))] flex flex-col overflow-hidden rounded-2xl">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-100/60 via-white to-gray-shade-11"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_1px_1px,rgba(238,56,81,0.12)_1px,transparent_0)] bg-[length:28px_28px]"
                />

                <div className="relative z-[1] flex flex-1 flex-col items-center justify-start gap-8 py-4 md:py-6">
                    <div className="w-full max-w-xl px-1 flex flex-col gap-8">
                        <header>
                            <div className="flex gap-4 sm:gap-5">
                                <div
                                    aria-hidden
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-primary-100 shadow-sm"
                                >
                                    <History className="h-6 w-6 text-primary-text" />
                                </div>
                                <div className="min-w-0 text-left">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-text/90">
                                        Start here
                                    </p>
                                    <h1 className="mt-1.5 text-lg md:text-xl font-semibold text-black-shade-1 tracking-tight leading-snug">
                                        R4 Patient History — one search away
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-shade-1 leading-relaxed">
                                        Look up past visits by patient or date
                                        range, scan timelines, and open any
                                        encounter when you need context for care
                                        or follow-up.
                                    </p>
                                </div>
                            </div>
                        </header>

                        {dashboardData.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href || ''}
                                className="group flex flex-col sm:flex-row gap-6 sm:gap-8 rounded-3xl border border-gray-shade-2 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-elevation-3 transition duration-300 hover:border-primary-text/25 hover:shadow-elevation-4 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-text"
                            >
                                <div className="shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-primary-100/80 to-white border border-primary-100 p-5 sm:w-[220px] sm:h-[200px]">
                                    <img
                                        src={item.imageSrc}
                                        alt={`${item.name} illustration`}
                                        className="w-full h-full max-h-[160px] object-contain"
                                    />
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-primary-text">
                                            {item.name}
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-shade-1 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-primary-text">
                                        <span className="group-hover:underline underline-offset-4">
                                            View R4 Patient History
                                        </span>
                                        <ArrowRight
                                            aria-hidden
                                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Breadcrums>
    )
}

export default Dashboard
