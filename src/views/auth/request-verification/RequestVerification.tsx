/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomBaseModal from '@/components/custom/base-modal'
import { PasswordInput } from '@/components/shared'
import { Button, FormContainer, FormItem } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

type RequestVerificationFormSchema = {
    password: string
    confirmPassword: string
}

const validationSchema = Yup.object().shape({
    password: Yup.string().required('Please enter new password'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Passwords do not match'
    ),
})

const RequestVerification = () => {
    const onSubmit = async (
        values: RequestVerificationFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        console.log(values)
        setSubmitting(false)
    }
    return (
        <>
            <CustomBaseModal
                modalId="varification-modal"
                isOpen={true}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                modalClassName="="
                modalContentClassName="min-h-[422px] h-auto py-10"
                onClose={() => {
                    // TODO: Implement close logic
                }}
            >
                <div className="w-full max-w-[374px] mx-auto flex justify-center h-full flex-col items-center">
                    <h1 className="mb-6 text-primary-text font-bold text-5xl font-comfortaa">
                        Set Password
                    </h1>

                    <Formik
                        initialValues={{
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            onSubmit(values, setSubmitting)
                        }}
                    >
                        {({ touched, errors, isSubmitting }) => (
                            <Form className="w-full">
                                <FormContainer className="w-full">
                                    <FormItem
                                        label="Password"
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder="Password"
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Confirm Password"
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            component={PasswordInput}
                                        />
                                    </FormItem>

                                    <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                        className="w-full flex-grow"
                                    >
                                        {isSubmitting
                                            ? 'Setting Password...'
                                            : 'Set Password'}
                                    </Button>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </CustomBaseModal>
        </>
    )
}

export default RequestVerification
