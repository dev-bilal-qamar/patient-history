/* eslint-disable @typescript-eslint/no-explicit-any */
import PasswordInput from '@/components/shared/PasswordInput'
import { Field, Form, Formik } from 'formik'
import Input from '@/components/ui/Input'
import * as Yup from 'yup'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Button, Notification, toast } from '@/components/ui'
import useAuth from '@/utils/hooks/useAuth'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'

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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
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
                {({ touched, errors, isSubmitting, values }) => (
                    <Form>
                        <FormContainer>
                            <motion.div variants={itemVariants}>
                                <FormItem
                                    label="Email"
                                    invalid={
                                        (errors.email &&
                                            touched.email) as boolean
                                    }
                                    errorMessage={errors.email}
                                    className="mb-3"
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Enter Email"
                                        prefix={
                                            <Mail
                                                className="text-gray-400"
                                                size={18}
                                            />
                                        }
                                        className="focus:ring-primary-text focus:border-primary-text transition-all duration-300 rounded-xl"
                                        component={Input}
                                    />
                                </FormItem>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FormItem
                                    label="Password"
                                    invalid={
                                        (errors.password &&
                                            touched.password) as boolean
                                    }
                                    errorMessage={errors.password}
                                    className="mb-3"
                                >
                                    <Field
                                        autoComplete="off"
                                        name="password"
                                        placeholder="Enter Password"
                                        prefix={
                                            <Lock
                                                className="text-gray-400"
                                                size={18}
                                            />
                                        }
                                        className="[&>input]:focus-within:!ring-primary-text [&>input]:focus-within:!border-primary-text transition-all duration-300 rounded-xl"
                                        component={PasswordInput}
                                    />
                                </FormItem>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex items-center justify-end mb-5"
                            >
                                <a
                                    href="/forgot-password"
                                    className="text-sm font-semibold text-primary-text hover:text-red-700 transition-colors"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Forgot password?
                                </a>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    variant="solid"
                                    className="w-full h-12 bg-primary-text hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 rounded-xl text-lg font-bold"
                                    disabled={
                                        isSubmitting ||
                                        values.password === '' ||
                                        values.email === ''
                                    }
                                >
                                    Sign In
                                </Button>
                            </motion.div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}

export default SignInForm
