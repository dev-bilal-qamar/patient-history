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
    apiPostClinic,
    
} from '@/services/ClinicService'
import { apiGetGroups, GroupPostRequest } from '@/services/GroupService'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useCallback, useEffect, useState } from 'react'

type formikValues = {
    name: string
    group: string
    email: string
    phone: string
    address: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    group: Yup.string().required('Group is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
})

const OnboardingForm = () => {
    const [groups, setGroups] = useState<GroupPostRequest[]>()

    const getClinics = useCallback(async () => {
        try {
            const response = await apiGetGroups()
            setGroups(response.data.data.results)
        } catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        getClinics()
    }, [getClinics])

    const onSubmiting = async (
        values: formikValues,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { name, email, address, phone, group } = values
        setSubmitting(true)
        try {
            const response = await apiPostClinic({
                name,
                group,
                email,
                phone,
                address,
            })

            if (response.status) {
                toast.push(
                    <Notification type="success" duration={2000}>
                        {response.message}
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
            values.group = ''
            setSubmitting(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.push(
                <Notification type="danger" duration={2000}>
                    {err.response.message}
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
                name: '',
                email: '',
                phone: '',
                address: '',
                group: '',
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
                            invalid={(errors.group && touched.group) as boolean}
                            errorMessage={errors.group}
                        >
                            <Select
                                name="group"
                                placeholder="Select Group"
                                options={clinics?.map((clinic) => ({
                                    label: clinic.name,
                                    value: clinic.id,
                                }))}
                                className="focus:ring-primary-text focus:outline-none focus:border-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e) {
                                        values.group = e.value
                                    }
                                }}
                            />
                        </FormItem>
                        <FormItem
                            label=""
                            invalid={(errors.group && touched.group) as boolean}
                            errorMessage={errors.group}
                        >
                            <Select
                                name="value"
                                placeholder="Select Value"
                                options={clinics?.map((clinic) => ({
                                    label: clinic.name,
                                    value: clinic.value,
                                }))}
                                className="focus:ring-primary-text focus:outline-none focus:border-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e) {
                                        values.value = e.value
                                    }
                                }}
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
