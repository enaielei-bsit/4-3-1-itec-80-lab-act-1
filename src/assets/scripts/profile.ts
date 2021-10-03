import Qty from "js-quantities";

export interface Quote {
    text: string;
    author: string;
}

export interface IProfile {
    get fullName(): string;

    image: string;
    familyName: string;
    givenName: string;
    middleName: string;
    birthdate: Date;
    sex: string;
    religion: string;
    civilStatus: string;
    height: string;
    labels: string[];
    quote: Quote;

    education: IEducation[];
    mastery: IMastery[];
    recognition: IRecognition[];
    presence: IPresence[];

}

export interface IEducation {
    date: RangedDate;
    school: string;
    specialty: string;

}

export interface IMastery {
    label: string;
    color: string;
    percentage: number;

}

export interface IExperience {
    date: RangedDate;
    workplace: string;
    position: string;

}

export interface RangedDate {
    from: Date;
    to: Date;

}

export interface IRecognition {
    label: string;
    date: Date;

}

export interface IPresence {
    image: string;
    label: string;
    alias: string;
    address: string;

}

export interface ISeminar {
    date: Date;
    event: string;
    venue: string;

}

export default class Profile implements IProfile {
    get fullName(): string {
        let fn = `${this.givenName} ${this.middleName} ${this.familyName}`;
        return fn.replace("  ", " ");

    }

    image: string;
    religion: string;
    civilStatus: string;
    height: string;
    familyName: string;
    givenName: string;
    middleName: string;
    birthdate: Date;
    sex: string;
    labels: string[];
    quote: Quote;

    education: IEducation[];
    mastery: IMastery[];
    recognition: IRecognition[];
    presence: IPresence[];
    seminar: ISeminar[];
    experience: IExperience[];

    constructor(data: any) {
        Profile._normalizeData(data);

        this.image = data.image;
        this.religion = data.religion;
        this.civilStatus = data.civilStatus;
        this.height = data.height;
        this.familyName = data.familyName;
        this.givenName = data.givenName;
        this.middleName = data.middleName;
        this.birthdate = data.birthdate;
        this.sex = data.sex;
        this.labels = data.labels;
        this.quote = data.quote;
    
        this.education = data.education;
        this.mastery = data.mastery;
        this.recognition = data.recognition;
        this.presence = data.presence;
        this.seminar = data.seminar;
        this.experience = data.experience;

    }

    static _normalizeData(data: any) {
        data.birthdate = new Date(data.birthdate ?? null);
        data.height = new Qty(data.height ?? 0);
        
        if(data.education && data.experience) {
            let entries = data.education.concat(data.experience);
            for(let entry of entries) {
                entry.date.from = new Date(entry.date.from);
                if(entry.date.to !== null) entry.date.to = new Date(entry.date.to);
    
            }

        }
        
        data.middleName ??= "";

    }

}