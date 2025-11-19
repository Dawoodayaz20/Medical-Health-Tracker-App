type Note = {
    id: string,
    userId: string,
    title: string,
    date: string,
    med_note: string
}

type Profile = {
    docId: string
    name: string,
    age: string,
    gender: string
    email: string
}

type Reminder = {
    id: string,
    userID: string,
    title: string,
    description: string,
    reminderId: any,
    hour: number,
    minute: number
}

type Medicines = {
    id: string,
    userID: string,
    name: string,
    illness: string,
    dosage: string,
    time: string,
    detail: string
}