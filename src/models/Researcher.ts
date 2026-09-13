export type ResearchField =
    | "number-theory"
    | "geometry"
    | "topology"
    | "analysis"
    | "dynamics"
    | "algebra";


export type Researcher = {

    id: string;

    name: string;
    username: string;

    location: string;
    biography: string;

    primaryField: ResearchField;
    fieldLabel: string;

    specialties: string[];

    projects: number;
    publications: number;
    followers: number;

    featured: boolean;

};