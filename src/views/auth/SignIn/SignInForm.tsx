/* eslint-disable @typescript-eslint/no-explicit-any */
import PasswordInput from '@/components/shared/PasswordInput'
import { Field, Form, Formik } from 'formik'
import Input from '@/components/ui/Input'
import * as Yup from 'yup'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Button, Notification, toast } from '@/components/ui'
import useAuth from '@/utils/hooks/useAuth'

type SignInFormSchema = {
    email: string
    password: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
})

const SignInForm = () => {
    const { signIn } = useAuth()

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        const result = await signIn(values)
        setSubmitting(false)
        if (result?.status === 'failed') {
            toast.push(
                <Notification title="Sign in failed" type="danger">
                    {result.message}
                </Notification>
            )
        }
    }

    return (
        <>
            <div className="animate-loginAnimation">
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        onSignIn(values, setSubmitting)
                    }}
                >
                    {({
                        touched,
                        errors,
                        isSubmitting,
                        values,
                        setSubmitting,
                    }) => (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label=""
                                    invalid={
                                        (errors.email &&
                                            touched.email) as boolean
                                    }
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Enter Email"
                                        className="focus:ring-primary-text focus:outline-none focus:border-0"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    label=""
                                    invalid={
                                        (errors.password &&
                                            touched.password) as boolean
                                    }
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        autoComplete="off"
                                        name="password"
                                        placeholder="Enter Password"
                                        className="[&>input]:focus-within:!ring-primary-text [&>input]:focus-within:!outline-none [&>input]:focus-within:!border-0"
                                        component={PasswordInput}
                                    />
                                </FormItem>

                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    variant="solid"
                                    className="w-full"
                                    disabled={
                                        isSubmitting ||
                                        values.password === '' ||
                                        values.email === ''
                                    }
                                >
                                    Login
                                </Button>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default SignInForm
