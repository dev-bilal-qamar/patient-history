/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, Notification, toast } from '@/components/ui'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { getTemplateResult } from '@/@types/adminPanelApi'
import CustomPagination from '@/components/custom/custom-pagination'
import { SectionType } from '@/views/dashboard/smart-forms/edit-form/components'
import FieldSectionEdit from '@/views/dashboard/smart-forms/edit-form/components/field-section-edit'
import FieldSection from '@/views/dashboard/smart-forms/edit-form/components/field-section'
import { Breadcrums } from '@/components/shared/breadcrums'
import { dragStyles, initialForm, FormEditorProps } from './form-editor-utils'

const FormEditor = ({
    getFormById,
    updateForm,
    returnPath,
}: FormEditorProps) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const id = searchParams.get('id')
    const index = searchParams.get('sectionIndex')
    const [template, setTemplate] = useState<getTemplateResult>(initialForm)
    const [section, setSection] = useState<SectionType>({
        section: index ? parseInt(index) : 0,
        name: '',
        fields: [],
    })
    const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null)

    // Fetch form data by ID
    const fetchFormById = useCallback(async () => {
        try {
            const response = await getFormById(id || '')
            if (response.data.data.body.sections.length > 0) {
                setSection(
                    response.data.data.body.sections[parseInt(index || '0')]
                )
            }

            setTemplate(response.data.data)
        } catch (err) {
            console.error(err)
        }
    }, [id, index, getFormById])

    // Handle form updates
    const memoizedHandleUpdate = useCallback(
        async (redirect = false) => {
            if (section.name === '') {
                toast.push(
                    <Notification type="danger" duration={2000}>
                        Please fill all fields
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )

                return
            }
            try {
                const isAppendingNewSection =
                    template.body.sections.length > 0 &&
                    (index === null ||
                        parseInt(index || '0') >= template.body.sections.length)

                let updatedSections
                if (isAppendingNewSection) {
                    // Append a new section
                    updatedSections = [...template.body.sections, section]
                } else if (template.body.sections.length > 0) {
                    // Update existing section
                    updatedSections = template.body.sections.map((sec, i) => {
                        if (i === parseInt(index || '0')) {
                            return section
                        }
                        return sec
                    })
                } else {
                    // First section
                    updatedSections = [section]
                }

                const res = await updateForm(
                    {
                        name: template.name,
                        body: {
                            language: template.body.language,
                            backend: template.body.backend,
                            category: template.body.category,
                            disclaimer: template.body.disclaimer
                                ? template.body.disclaimer
                                : undefined,
                            sections: updatedSections,
                        },
                    },
                    template._id
                )
                if (res.data.status === 'success') {
                    toast.push(
                        <Notification type="success" duration={2000}>
                            Form Entry Updated successfully
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )

                    // Update template with new sections
                    setTemplate((prev) => ({
                        ...prev,
                        body: {
                            ...prev.body,
                            sections: updatedSections,
                        },
                    }))

                    // If adding a new section, move to that section
                    if (isAppendingNewSection) {
                        const newSectionIndex = updatedSections.length - 1
                        searchParams.set(
                            'sectionIndex',
                            newSectionIndex.toString()
                        )
                        navigate({ search: searchParams.toString() })
                    }
                }
                if (redirect) {
                    navigate(returnPath)
                }
            } catch (err) {
                console.error(err)
            }
        },
        [
            section,
            template,
            index,
            navigate,
            searchParams,
            updateForm,
            returnPath,
        ]
    )

    // Handle field reordering via drag and drop
    const handleReorderFields = useCallback(
        (fromIndex: number, toIndex: number) => {
            setSection((prevSection) => {
                const newFields = [...prevSection.fields]
                const [movedField] = newFields.splice(fromIndex, 1)
                newFields.splice(toIndex, 0, movedField)
                return { ...prevSection, fields: newFields }
            })
            // Update the form after reordering
            setTimeout(() => {
                memoizedHandleUpdate(false)
            }, 300)
        },
        [memoizedHandleUpdate]
    )

    // Navigation handlers
    function handleNextsection() {
        if (index !== null) {
            searchParams.set(
                'sectionIndex',
                index ? (parseInt(index) + 1).toString() : index
            )
            navigate({ search: searchParams.toString() })
        }
    }

    function handlePrevsection() {
        if (index !== null) {
            searchParams.set(
                'sectionIndex',
                index ? (parseInt(index) - 1).toString() : index
            )
            navigate({ search: searchParams.toString() })
        }
    }

    function handleNewsection() {
        // Clear the section state for a new section
        setSection({
            section: template.body.sections.length,
            name: '',
            fields: [],
        })

        // Update the URL parameter
        searchParams.set(
            'sectionIndex',
            template.body.sections.length.toString()
        )
        navigate({ search: searchParams.toString() })
    }

    // Delete section handler
    const handleDelete = async () => {
        try {
            const res = await updateForm(
                {
                    name: template.name,
                    body: {
                        language: template.body.language,
                        backend: template.body.backend,
                        category: template.body.category,
                        sections: template.body.sections.filter((sec, i) => {
                            if (i !== parseInt(index || '0')) {
                                return sec
                            }
                        }),
                        disclaimer: template.body.disclaimer
                            ? template.body.disclaimer
                            : undefined,
                    },
                },
                template._id
            )
            if (res.data.status === 'success') {
                toast.push(
                    <Notification type="success" duration={2000}>
                        Form Section Deleted successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate(returnPath)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchFormById()
    }, [fetchFormById])

    return (
        <Breadcrums>
            <div className="relative h-full">
                {/* Add CSS styles for drag effects */}
                <style>{dragStyles}</style>

                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1">
                            Section {index ? parseInt(index) + 1 : 1}
                        </h2>
                        <Button
                            variant="solid"
                            className="uppercase"
                            onClick={handleDelete}
                        >
                            Delete Section
                        </Button>
                    </div>
                    <div className="mt-5 flex flex-col gap-5">
                        <Input
                            value={section?.name || ''}
                            placeholder="Enter Section Title"
                            onChange={(e) => {
                                setSection((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }}
                        />
                    </div>
                </div>
                <div className="w-full mt-5">
                    <h2 className="text-2xl font-bold font-comfortaa text-black-shade-1 mb-5">
                        Field
                    </h2>
                    {section && section.fields && section.fields.length ? (
                        <div className="flex flex-col gap-5 mb-10">
                            {section?.fields.map((field, index) => (
                                <FieldSectionEdit
                                    key={index}
                                    setSection={setSection}
                                    field={field}
                                    index={index}
                                    activeEditIndex={activeEditIndex}
                                    setActiveEditIndex={setActiveEditIndex}
                                    handleUpdate={() =>
                                        memoizedHandleUpdate(false)
                                    }
                                    section={section}
                                    onReorder={handleReorderFields}
                                />
                            ))}
                        </div>
                    ) : null}
                    <FieldSection section={section} setSection={setSection} />
                </div>
                <div className="flex justify-center items-center w-full mt-10">
                    <CustomPagination
                        index={parseInt(index || '0')}
                        totalPages={template.body.sections.length}
                        onNext={() => handleNextsection()}
                        onBack={() => handlePrevsection()}
                    />
                </div>
                <div className="flex items-center gap-3 justify-end mt-8">
                    <Button
                        variant="twoTone"
                        className="uppercase "
                        disabled={section?.name === ''}
                        onClick={() => memoizedHandleUpdate(false)}
                    >
                        Update Section
                    </Button>
                    <Button
                        variant="solid"
                        className="uppercase"
                        onClick={() => handleNewsection()}
                    >
                        Add Section
                    </Button>
                </div>
            </div>
        </Breadcrums>
    )
}

export default FormEditor
