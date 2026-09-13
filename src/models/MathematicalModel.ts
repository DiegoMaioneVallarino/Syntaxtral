export type MathematicalCategory =
    | "number-theory"
    | "geometry"
    | "topology"
    | "analysis"
    | "dynamics"
    | "algebra";


export type MathematicalModel = {

    id: string;

    title: string;
    author: string;

    category: MathematicalCategory;
    categoryLabel: string;

    topics: string[];

    likes: number;
    forks: number;

    imagePath?: string;

};