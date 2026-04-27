import {
    Button,
    FormContainer,
    FormItem,
    Input,
    Notification,
    Select,
    toast,
} from '@/components/ui'
import { Group } from '@/@types/group'
import { apiPostClinic } from '@/services/ClinicService'
import { apiGetGroups } from '@/services/GroupService'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { AxiosError } from 'axios'
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
    const [groups, setGroups] = useState<Group[]>()

    const getGroups = useCallback(async () => {
        try {
            const response = await apiGetGroups()
            setGroups(response.data.data)
        } catch (err) {
            console.error(err)
        }
    }, [])

    useEffect(() => {
        getGroups()
    }, [getGroups])

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

            if (response.data.success) {
                toast.push(
                    <Notification type="success" duration={2000}>
                        {response.data.message}
                    </Notification>
                )
            }
            setSubmitting(false)
        } catch (err) {
            const message =
                err instanceof AxiosError &&
                err.response?.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data
                    ? String(
                          (err.response.data as { message: string }).message
                      )
                    : 'Something went wrong'
            toast.push(
                <Notification type="danger" duration={2000}>
                    {message}
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
                            invalid={(errors && touched.email) as boolean}
                            errorMessage={errors.email}
                        >
                            <Field
                                type="email"
                                autoComplete="off"
                                name="email"
                                placeholder="EMAIL"
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
                                options={groups?.map((group) => ({
                                    label: group.name,
                                    value: group._id,
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
                            invalid={
                                (errors && touched.address) as boolean
                            }
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
