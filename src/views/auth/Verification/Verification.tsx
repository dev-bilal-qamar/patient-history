import CustomBaseModal from '@/components/custom/base-modal'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

type VarificationFormSchema = {
    email: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your user name'),
})

const Verification = () => {
    const onSubmit = async (
        values: VarificationFormSchema,
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
                modalContentClassName="h-[422px]"
                onClose={() => {
                    // TODO: Implement close logic
                }}
            >
                <div className="w-full max-w-[374px] mx-auto flex justify-center h-full flex-col items-center">
                    <h1 className="mb-6 text-primary-text font-bold text-5xl font-comfortaa">
                        Verification
                    </h1>
                    <p className="text-xl leading-8 text-primary-200 mb-7 text-center max-w-[300px] mx-auto tracking-para">
                        Hello! To proceed to your form, please enter the code
                    </p>
                    <Formik
                        initialValues={{
                            email: '',
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
                                            className="focus:ring-primary-text focus:outline-none focus:border-0 w-full"
                                            component={Input}
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
                                            ? 'Verifying...'
                                            : 'Verify'}
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

export default Verification
