export type ArticleStatus =
    | "published"
    | "preprint"
    | "draft";


export type ArticleStatusFilter =
    | "all"
    | ArticleStatus;


export type Article = {

    id: string;

    title: string;
    author: string;

    publicationDate: string;
    readingTime: number;

    status: ArticleStatus;

    categories: string[];

    abstract: string;

    imagePath?: string;

};