/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTemplateResult } from '@/@types/adminPanelApi'

// Drag styles for field reordering
export const dragStyles = `
    .dragging-field {
        opacity: 0.6;
        border: 2px dashed #666;
        transform: scale(1.02);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .drag-over {
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: rgba(0, 0, 0, 0.03);
        transition: all 0.3s ease;
    }
    .field-card {
        transition: all 0.3s ease;
    }
    .drag-handle {
        cursor: grab;
        color: #888;
        transition: color 0.2s ease;
        position: absolute;
        left: 10px;
        top: 10px;
    }
    .drag-handle:hover {
        color: #333;
    }
    .drag-handle:active {
        cursor: grabbing;
    }
`

export const initialForm: getTemplateResult = {
    name: '',
    body: {
        language: '',
        backend: '',
        category: '',
        sections: [],
    },
    _id: '',
    patientId: '',
    status: '',
    formId: '',
    clinicId: '',
    token: '',
    secretCode: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
}

export interface FormEditorProps {
    getFormById: (id: string) => Promise<any>
    updateForm: (form: any, id: string) => Promise<any>
    returnPath: string
}
