import React from 'react'
import { getTemplateResultVerify } from '@/@types/adminPanelApi'
import CardInfo from './card-info'

interface Props {
    template: getTemplateResultVerify
}

const PatientInformationCard: React.FC<Props> = ({ template }) => {
    return (
        <div className="flex items-center w-full gap-4 md:justify-end justify-center">
            <img
                className="w-16 h-16 rounded-full object-fill border border-slate-300 bg-black/10"
                src={
                    template.patient.sex.toLowerCase() === 'f'
                        ? '/img/avatars/girl.png'
                        : '/img/avatars/men.png'
                }
                alt=""
            />
            <CardInfo patient={template.patient} />
        </div>
    )
}

export default PatientInformationCard
