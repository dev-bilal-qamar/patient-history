import type { LazyExoticComponent } from 'react'

export type DocRouteNav = {
    path: string
    label: string
    component: LazyExoticComponent<() => JSX.Element>
}

export type DocumentationRoute = {
    groupName: string
    nav: DocRouteNav[]
}

export type GetDoctorByEmailApiResponse = {
    status: string
    message: string
    data: {
        results: Doctor[]
    }
}

export type Doctor = {
    UserId: number
    UserName: string
    Password: string
    Email: string
    PhoneNumber: string
    GradingId: number
    GradingTitle: string
    ClinicCode: number
    ClinicName: string
    ServerName: string
    frontendUpdated: string
}

export type GetAllAppoinmentsApiResponse = {
    status: string
    message: string
    data: Appointment[]
}

export type GetAppointmentByIdResponse = {
    status: string
    message: string
    data: Appointment[]
}

export type Appointment = {
    apptid: number
    patientCode: number
    patientName: string
    email: string
    mobile: string
    dob: string // Consider converting this to Date if needed
    gender: string
    drCode: number
    doctorName: string
    appttype: string
    transactiondate: string // Consider converting this to Date if needed
    age: number
    is_pres_created: number
    iscanceled: number
    apptflag: number
    prescriptionId: number
    hasSavedPrescription: boolean
    savedPrescription?: {
        _id: string
        clinicId: string
        apptId: number
        __v: number
        createdAt: string
        prescription: {
            apptId: number
            patientId: number
            patientName: string
            doctorId: number
            doctorName: string
            diagnosis: string[]
            instructions: string
        }
        prescriptionDetails: {
            dosage: number
            drug: string
            drugId: 8437
            duration: number
            frequency: string
            frequencyId: number
            route: string
            routeId: number
            instructions: string
            quantity: number | string
            calculate: number
        }[]

        updatedAt: string
    }
}
