import {
    useMemo,
    useState
} from "react";

import "./Articles.css";

import {
    articles
} from "../../data/articles";

import type {
    ArticleStatus,
    ArticleStatusFilter
} from "../../models/Article";


type StatusOption = {

    value: ArticleStatusFilter;
    label: string;

};


const statusOptions: StatusOption[] = [

    {
        value: "all",
        label: "Todos"
    },

    {
        value: "published",
        label: "Published"
    },

    {
        value: "preprint",
        label: "Preprint"
    },

    {
        value: "draft",
        label: "Draft"
    }

];


const statusLabels: Record<
    ArticleStatus,
    string
> = {

    published:
        "Published",

    preprint:
        "Preprint",

    draft:
        "Draft"

};


function Articles() {

    const [
        searchValue,
        setSearchValue
    ] = useState("");


    const [
        selectedStatus,
        setSelectedStatus
    ] = useState<ArticleStatusFilter>("all");


    const [
        selectedArticleId,
        setSelectedArticleId
    ] = useState(
        articles[0].id
    );


    const filteredArticles = useMemo(() => {

        const normalizedSearch =
            searchValue
                .trim()
                .toLowerCase();


        return articles.filter(article => {

            const searchableText = `

                ${article.title}

                ${article.author}

                ${article.categories.join(" ")}

            `.toLowerCase();


            const matchesSearch =

                normalizedSearch.length === 0 ||

                searchableText.includes(
                    normalizedSearch
                );


            const matchesStatus =

                selectedStatus === "all" ||

                article.status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        searchValue,
        selectedStatus
    ]);


    const selectedArticle =

        articles.find(article => (
            article.id === selectedArticleId
        ))

        ?? articles[0];


    return (
        <section className="articlesPage">

            <header className="articlesHeader">

                <div>

                    <span className="articlesEyebrow">
                        Investigación, notas y pruebas
                    </span>

                    <h1>
                        Artículos
                    </h1>

                    <p>
                        Publica y explora investigación
                        matemática desde una perspectiva
                        visual y experimental.
                    </p>

                </div>


                <button
                    type="button"
                    className="uploadArticleButton"
                >
                    <span>
                        ↑
                    </span>

                    Subir artículo
                </button>

            </header>


            <div className="articlesToolbar">

                <label className="articlesSearch">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="search"
                        value={searchValue}
                        placeholder="Buscar artículos, autores o temas..."
                        onChange={event => {
                            setSearchValue(
                                event.target.value
                            );
                        }}
                    />

                </label>


                <div className="articleStatusFilters">

                    {statusOptions.map(option => (

                        <button
                            type="button"
                            key={option.value}
                            className={
                                selectedStatus === option.value
                                    ? "statusFilter statusFilterActive"
                                    : "statusFilter"
                            }
                            onClick={() => {
                                setSelectedStatus(
                                    option.value
                                );
                            }}
                        >
                            {option.label}
                        </button>

                    ))}

                </div>


                <button
                    type="button"
                    className="articleSortButton"
                >
                    Más recientes

                    <span>
                        ↓
                    </span>
                </button>

            </div>


            <div className="articlesWorkspace">

                <section className="articlesList">

                    <header className="articlesListHeader">

                        <span>
                            {filteredArticles.length}
                            {" "}
                            artículos
                        </span>

                        <span>
                            Última actualización
                        </span>

                    </header>


                    {filteredArticles.map(article => (

                        <button
                            type="button"
                            key={article.id}
                            className={
                                selectedArticle.id === article.id
                                    ? "articleListItem articleListItemActive"
                                    : "articleListItem"
                            }
                            onClick={() => {
                                setSelectedArticleId(
                                    article.id
                                );
                            }}
                        >

                            <span className="articleDocumentIcon">
                                ▤
                            </span>


                            <span className="articleListInformation">

                                <strong>
                                    {article.title}
                                </strong>

                                <small>
                                    {article.author}
                                </small>

                            </span>


                            <span className="articleListCategory">

                                {article.categories[0]}

                            </span>


                            <time>
                                {article.publicationDate}
                            </time>


                            <span
                                className={`
                                    articleStatus
                                    articleStatus-${article.status}
                                `}
                            >
                                {statusLabels[article.status]}
                            </span>

                        </button>

                    ))}


                    {filteredArticles.length === 0 && (

                        <div className="articlesEmpty">

                            <span>
                                ∅
                            </span>

                            <strong>
                                No encontramos artículos
                            </strong>

                            <p>
                                Prueba modificando la búsqueda
                                o el estado seleccionado.
                            </p>

                        </div>

                    )}

                </section>


                <article className="articleReader">

                    <div className="articleReaderTop">

                        <span
                            className={`
                                articleStatus
                                articleStatus-${selectedArticle.status}
                            `}
                        >
                            {statusLabels[selectedArticle.status]}
                        </span>

                        <button
                            type="button"
                            className="articleOptionsButton"
                            aria-label="Opciones del artículo"
                        >
                            •••
                        </button>

                    </div>


                    <h2>
                        {selectedArticle.title}
                    </h2>


                    <div className="articleAuthor">

                        <span className="articleAuthorAvatar">

                            {selectedArticle.author
                                .split(" ")
                                .map(word => word[0])
                                .join("")
                            }

                        </span>


                        <div>

                            <strong>
                                {selectedArticle.author}
                            </strong>

                            <span>
                                {selectedArticle.publicationDate}

                                {" · "}

                                {selectedArticle.readingTime}
                                {" "}
                                min de lectura
                            </span>

                        </div>

                    </div>


                    <div className="articleReaderCategories">

                        {selectedArticle.categories.map(
                            category => (

                                <span key={category}>
                                    {category}
                                </span>

                            )
                        )}

                    </div>


                    <p className="articleAbstract">

                        {selectedArticle.abstract}

                    </p>


                    <div
                        className="articleCover"
                        style={{
                            backgroundImage: `
                                linear-gradient(
                                    135deg,
                                    rgba(13, 7, 30, 0.15),
                                    rgba(4, 4, 8, 0.7)
                                ),
                                url("${selectedArticle.imagePath}")
                            `
                        }}
                    >

                        <div className="articleCoverGrid" />

                        <span className="articleCoverFormula">
                            ℳ(τ)
                        </span>

                        <span className="articleCoverEquation">
                            H / SL(2, ℤ)
                        </span>

                    </div>


                    <button
                        type="button"
                        className="openArticleButton"
                    >
                        Abrir artículo completo

                        <span>
                            ↗
                        </span>
                    </button>

                </article>

            </div>

        </section>
    );
}


export default Articles;