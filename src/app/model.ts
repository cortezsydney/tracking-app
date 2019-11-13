export class Model { 
    description: string;
    hour: number;
    hashtag: string;
    activities: string[];
    date: string;

    constructor(description: string, hour: number, hashtag:string, activities:string[], date: string){
        this.description = description;
        this.hour = hour;
        this.hashtag = hashtag;
        this.activities = [...activities];
        this.date = date;
    }
}