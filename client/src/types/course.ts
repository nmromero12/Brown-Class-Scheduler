export type Course = {
    id: number;
    courseCode: string;
    courseName: string;
    examTime: string;
    section: string;
    classTime: string;
    crn: string;
}

export type CartItem = {
    userName: string;
    courseCode: string;
    courseName: string;
    examTime: string;
    section: string;
    classTime: string;
    crn: string;
}


export type parsedCartItem = {
    startTime: string;
    endTime: string;
    days: string[];
    location: string;
    description: string;
    recurrence: string;

}