/* eslint-disable @typescript-eslint/no-explicit-any */
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import {
    useAppSelector,
    useAppDispatch,
    setSideNavCollapse,
    setUser,
    ClinicState,
} from '@/store'
import NavToggle from '@/components/shared/NavToggle'
import type { CommonProps } from '@/@types/common'
import { useSelector } from 'react-redux'
import {
    ClinicProps,
    CustomClinicDropdown,
} from '../custom/custom-clinics-dropdown'
import useResponsive from '@/utils/hooks/useResponsive'
import { useEffect } from 'react'

const _SideNavToggle = ({ className }: CommonProps) => {
    const user = useAppSelector((state) => state.auth.user)
    const clinics = useSelector((state: any) => state.auth.clinics)

    const { larger } = useResponsive()

    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse
    )

    const dispatch = useAppDispatch()

    const onCollapse = () => {
        dispatch(setSideNavCollapse(!sideNavCollapse))
    }

    useEffect(() => {
        if (clinics?.length === 1) {
            const singleClinic = clinics[0]
            dispatch(
                setUser({
                    ...user,
                    clinicId: singleClinic._id,
                })
            )
        }
    }, [clinics, dispatch, user])

    return (
        <>
            <div className="flex items-center w-full ">
                {larger.lg && (
                    <div className={className} onClick={onCollapse}>
                        <NavToggle
                            className="text-2xl"
                            toggled={sideNavCollapse}
                        />
                    </div>
                )}
                <p className="text-xl sm:text-3xl font-bold text-primary-text font-comfortaa flex-shrink-0">
                    Patient History
                </p>
                {clinics ? (
                    <div className="w-full">
                        <CustomClinicDropdown
                            placeholder="Select Clinic"
                            selectedValue={
                                clinics.find(
                                    (clinic: ClinicState) =>
                                        clinic._id === user.clinicId
                                )?.name
                            }
                            options={[...clinics]
                                .sort((a: ClinicState, b: ClinicState) =>
                                    a.name.localeCompare(b.name)
                                )
                                .map((clinic: ClinicState) => ({
                                    label: clinic.name,
                                    value: clinic._id,
                                    logo: clinic.logo,
                                }))}
                            outerClassName="w-full max-w-[200px] ml-2 truncate"
                            boxClassName="max-h-[400px] overflow-y-auto"
                            onSelect={(value: ClinicProps) => {
                                dispatch(
                                    setUser({
                                        ...user,
                                        clinicId: value.value,
                                    })
                                )
                            }}
                        />
                    </div>
                ) : null}
            </div>
        </>
    )
}

const SideNavToggle = withHeaderItem(_SideNavToggle)

export default SideNavToggle
