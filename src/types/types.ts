export interface Data {
    startYear: number,
    endYear: number,
    title: string;
    events: {
        year: number,
        description: string,
    }[]
}