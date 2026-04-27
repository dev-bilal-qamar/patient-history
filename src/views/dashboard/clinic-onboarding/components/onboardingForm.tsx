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
import 'react-phone-number-input/style.css'

export type OnboardingFormProps = {
    /** Called after a successful create (e.g. close dialog + refresh list). */
    onCreated?: () => void
}
type formikValues = {
    name: string
    groupId: string
    email: string
    phone: string
    address: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    groupId: Yup.string().required('Group is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
})

const OnboardingForm = ({ onCreated }: OnboardingFormProps) => {
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
        const { name, email, address, phone, groupId } = values
        setSubmitting(true)
        try {
            const response = await apiPostClinic({
                name,
                groupId,
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
                onCreated?.()
            }
            setSubmitting(false)
        } catch (err) {
            const message =
                err instanceof AxiosError &&
                err.response?.data &&
                typeof err.response.data === 'object' &&
                'message' in err.response.data
                    ? String((err.response.data as { message: string }).message)
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
                groupId: '',
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={(values, { setSubmitting }) => {
                onSubmiting(values, setSubmitting)
            }}
        >
            {({
                touched,
                errors,
                isSubmitting,
                values,
                setFieldValue,
                setFieldTouched,
            }) => (
                <Form>
                    <FormContainer className="flex flex-col gap-3 w-full max-w-[641px] mt-6 ml-0.5">
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
                            invalid={
                                (errors.groupId && touched.groupId) as boolean
                            }
                            errorMessage={errors.groupId}
                        >
                            <Select
                                placeholder="Select Group"
                                options={groups?.map((group) => ({
                                    label: group.name,
                                    value: group._id,
                                }))}
                                value={
                                    groups
                                        ?.map((g) => ({
                                            label: g.name,
                                            value: g._id,
                                        }))
                                        .find(
                                            (o) => o.value === values.groupId
                                        ) ?? null
                                }
                                className="focus:ring-primary-text focus:outline-none focus:border-0 cursor-pointer"
                                onChange={(option) => {
                                    void setFieldValue(
                                        'groupId',
                                        (option as { value: string } | null)
                                            ?.value ?? ''
                                    )
                                    void setFieldTouched('groupId', true)
                                }}
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
                            <div className="rounded-md border border-gray-200 bg-white pl-2 pr-1 py-1 transition-shadow focus-within:border-primary-text focus-within:ring-1 focus-within:ring-primary-text min-h-[44px] flex items-center">
                                <PhoneInput
                                    international
                                    defaultCountry="AE"
                                    countryCallingCodeEditable={false}
                                    value={values.phone}
                                    numberInputProps={{
                                        className:
                                            'PhoneInputInput !h-9 !min-h-0 !border-0 !shadow-none !ring-0 !outline-none !bg-transparent !text-sm',
                                    }}
                                    onChange={(phone) => {
                                        void setFieldValue(
                                            'phone',
                                            phone ?? ''
                                        )
                                    }}
                                    onBlur={() => {
                                        void setFieldTouched('phone', true)
                                    }}
                                />
                            </div>
                        </FormItem>
                        <div className="flex justify-end">
                            <Button
                                variant="solid"
                                className="w-32"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? 'Creating…' : 'Create clinic'}
                            </Button>
                        </div>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}
export default OnboardingForm
