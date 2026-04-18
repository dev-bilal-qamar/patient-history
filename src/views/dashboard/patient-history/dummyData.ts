export type PatientVisitRow = {
    id: string
    patientCode: string
    patientName: string
    gender: string
    age: number
    mobileNo: string
    provider: string
}

export const dummyPatientVisits: PatientVisitRow[] = [
    {
        id: '1',
        patientCode: 'PH-24001',
        patientName: 'Ahmed Khan',
        gender: 'Male',
        age: 34,
        mobileNo: '+971 50 123 4567',
        provider: 'Dr. Sarah Ali',
    },
    {
        id: '2',
        patientCode: 'PH-24002',
        patientName: 'Fatima Al Mansoori',
        gender: 'Female',
        age: 29,
        mobileNo: '+971 55 987 6543',
        provider: 'Dr. Omar Hassan',
    },
    {
        id: '3',
        patientCode: 'PH-24003',
        patientName: 'James Wilson',
        gender: 'Male',
        age: 52,
        mobileNo: '+971 52 456 7890',
        provider: 'Dr. Sarah Ali',
    },
    {
        id: '4',
        patientCode: 'PH-24004',
        patientName: 'Priya Sharma',
        gender: 'Female',
        age: 41,
        mobileNo: '+971 56 321 0987',
        provider: 'Dr. Layla Rahman',
    },
    {
        id: '5',
        patientCode: 'PH-24005',
        patientName: 'Omar Siddiqui',
        gender: 'Male',
        age: 19,
        mobileNo: '+971 54 888 1122',
        provider: 'Dr. Omar Hassan',
    },
    {
        id: '6',
        patientCode: 'PH-24006',
        patientName: 'Aisha Noor',
        gender: 'Female',
        age: 63,
        mobileNo: '+971 50 765 4321',
        provider: 'Dr. Layla Rahman',
    },
]
