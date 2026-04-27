import {
    Button,
    FormContainer,
    FormItem,
    Input,
    Notification,
    Select,
    toast,
} from '@/components/ui'
import {
    apiGetFacility,
    apiPostOnboardingClinic,
} from '@/services/AdminPanelService'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { GetFacilityResponseData } from '@/@types/adminPanelApi'
import { backendOptions } from '../../smart-forms/data'

type formikValues = {
    name: string
    email: string
    phone: string
    address: string
    backend: string
    facilityId: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    backend: Yup.string().required('Backend is required'),
    facilityId: Yup.string().required('Facility is required'),
})

const OnboardingForm = () => {
    const [searchParams] = useSearchParams()
    const onboard = searchParams.get('onboard')
    const [facility, setFacility] = useState<GetFacilityResponseData[]>()

    const getFacility = useCallback(async () => {
        try {
            const response = await apiGetFacility(1, 1000)
            setFacility(
                response.data.data.results.sort((a, b) =>
                    a.createdAt > b.createdAt ? -1 : 1
                )
            )
        } catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        getFacility()
    }, [getFacility])

    const onSubmiting = async (
        values: formikValues,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { name, email, address, phone, backend, facilityId } = values
        setSubmitting(true)
        try {
            const response = await apiPostOnboardingClinic({
                name,
                email,
                phone,
                address,
                backend,
                facilityId,
            })

            if (response.data.status) {
                toast.push(
                    <Notification type="success" duration={2000}>
                        {response.data.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
            values.name = ''
            values.email = ''
            values.phone = ''
            values.address = ''
            values.facilityId = ''
            setSubmitting(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={2000}>
                    {err.response.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={{
                name: onboard ? onboard : '',
                email: '',
                phone: '',
                address: '',
                backend: '',
                facilityId: '',
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={(values, { setSubmitting }) => {
                onSubmiting(values, setSubmitting)
            }}
        >
            {({ touched, errors, isSubmitting, values }) => (
                <Form>
                    <FormContainer className="flex flex-col gap-3 w-full max-w-[641px]">
                        <FormItem
                            invalid={(errors && touched.name) as boolean}
                            errorMessage={errors.name}
                        >
                            <Field
                                readOnly={onboard ? true : false}
                                type="text"
                                autoComplete="off"
                                name="name"
                                placeholder="NAME"
                                className="focus:ring-primary-text focus:outline-none focus:border-0 "
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label=""
                            invalid={
                                (errors.facilityId &&
                                    touched.facilityId) as boolean
                            }
                            errorMessage={errors.facilityId}
                        >
                            <Select
                                name="facilityId"
                                placeholder="Select Group"
                                options={facility?.map((facility) => ({
                                    label: facility.name,
                                    value: facility._id,
                                }))}
                                className="focus:ring-primary-text focus:outline-none focus:border-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e) {
                                        values.facilityId = e.value
                                    }
                                }}
                            />
                        </FormItem>
                        <FormItem
                            label=""
                            invalid={
                                (errors.backend && touched.backend) as boolean
                            }
                            errorMessage={errors.backend}
                        >
                            <Select
                                name="backend"
                                placeholder="Select Value"
                                options={backendOptions}
                                className="focus:ring-primary-text focus:outline-none focus:border-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e) {
                                        values.backend = e.value
                                    }
                                }}
                            />
                        </FormItem>
                        <FormItem
                            invalid={(errors && touched.email) as boolean}
                            errorMessage={errors.email}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="email"
                                placeholder="EMAIL"
                                className="focus:ring-primary-text focus:outline-none focus:border-0"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            invalid={(errors && touched.address) as boolean}
                            errorMessage={errors.address}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="address"
                                placeholder="ADDRESS"
                                className="focus:ring-primary-text focus:outline-none focus:border-0"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            invalid={(errors && touched.phone) as boolean}
                            errorMessage={errors.phone}
                        >
                            <PhoneInput
                                name="phone"
                                placeholder="Enter phone number"
                                value={values.phone}
                                className="flex gap-2 items-center focus:[&>input]:outline-none focus:[&>input]:border-0 [&>input]:border-[1.5px] h-11 [&>input]:h-full focus:[&>input]:ring-primary-text focus:[&>input]:ring-[1.5px] [&>input]:rounded-md [&>input]:px-3 [&>div]:w-16 [&>div]:h-full [&>div]:border-[1.5px] [&>div]:rounded-md [&>div]:px-3 [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:gap-3"
                                onChange={(phone) => {
                                    values.phone = phone as string
                                }}
                            />
                        </FormItem>
                        <div className="flex justify-end">
                            <Button
                                variant="solid"
                                className="w-32"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? 'ONBOARDING...' : 'ONBOARD'}
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}
export default OnboardingForm
