import {
    useState
} from "react";

import type {
    CSSProperties
} from "react";

import {
    Link,
    useSearchParams
} from "react-router-dom";

import {
    mockNews,
    newsCategories
} from "./news.mock";

import type {
    NewsArticle,
    NewsCategory
} from "./news.mock";

import "./News.css";

type NewsArtworkStyle = CSSProperties & {
    "--news-accent": string;
};

function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
    });
}

function articleLink(id: string): string {
    return `/news?article=${encodeURIComponent(id)}`;
}

function NewsArtwork({
    article
}: {
    article: NewsArticle;
}) {
    const style: NewsArtworkStyle = {
        "--news-accent": article.accent
    };

    return (
        <div
            className="newsArtwork"
            style={style}
            aria-hidden="true"
        >
            <span className="newsArtworkOrbit newsArtworkOrbitOne" />
            <span className="newsArtworkOrbit newsArtworkOrbitTwo" />
            <span className="newsArtworkSymbol">
                {article.symbol}
            </span>

            <span className="newsArtworkLabel">
                SYNTAXTRAL / IDEAS
            </span>
        </div>
    );
}

export default function News() {
    const [search, setSearch] = useState("");

    const [category, setCategory] =
        useState<NewsCategory | "Todas">("Todas");

    const [searchParams] = useSearchParams();

    const selectedId = searchParams.get("article");

    const selectedArticle = mockNews.find(
        article => article.id === selectedId
    );

    const sortedArticles = [...mockNews].sort(
        (a, b) =>
            Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
    );

    const featuredArticle =
        sortedArticles.find(article => article.featured) ??
        sortedArticles[0];

    const headlines = sortedArticles
        .filter(article => article.id !== featuredArticle?.id)
        .slice(0, 3);

    const query = normalizeText(search.trim());

    const visibleArticles = sortedArticles.filter(article => {
        const matchesCategory =
            category === "Todas" ||
            article.category === category;

        const matchesSearch = normalizeText(
            [
                article.title,
                article.summary,
                article.author,
                article.category
            ].join(" ")
        ).includes(query);

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="newsPage">
            <div className="newsContainer">
                <header className="newsHeader">
                    <div>
                        <span className="newsEyebrow">
                            SYNTAXTRAL JOURNAL
                        </span>

                        <h1>Noticias e ideas</h1>

                        <p>
                            Matemáticas, ciencia y las personas
                            que hacen nuevas preguntas.
                        </p>
                    </div>

                    <span className="newsDemoBadge">
                        Contenido de demostración
                    </span>
                </header>

                {selectedId !== null ? (
                    selectedArticle ? (
                        <article className="newsReader">
                            <Link
                                to="/news"
                                className="newsBackLink"
                            >
                                ← Volver a noticias
                            </Link>

                            <div className="newsReaderHeading">
                                <span className="newsCategory">
                                    {selectedArticle.category}
                                </span>

                                <h2>{selectedArticle.title}</h2>

                                <p className="newsReaderSummary">
                                    {selectedArticle.summary}
                                </p>

                                <div className="newsMetadata">
                                    <span>{selectedArticle.author}</span>

                                    <time dateTime={selectedArticle.publishedAt}>
                                        {formatDate(selectedArticle.publishedAt)}
                                    </time>

                                    <span>
                                        {selectedArticle.readingMinutes} min
                                        de lectura
                                    </span>
                                </div>
                            </div>

                            <NewsArtwork article={selectedArticle} />

                            <div className="newsReaderBody">
                                <p className="newsDemoNotice">
                                    Artículo ficticio de demostración.
                                    No corresponde a una noticia verificada
                                    ni tiene una fuente periodística externa.
                                </p>

                                {selectedArticle.paragraphs.map(
                                    (paragraph, index) => (
                                        <p key={`${selectedArticle.id}-${index}`}>
                                            {paragraph}
                                        </p>
                                    )
                                )}

                                <Link
                                    to="/news"
                                    className="newsBackLink"
                                >
                                    ← Seguir explorando
                                </Link>
                            </div>
                        </article>
                    ) : (
                        <div className="newsEmpty">
                            <h2>No encontramos ese artículo.</h2>

                            <Link to="/news" className="newsBackLink">
                                Volver a noticias
                            </Link>
                        </div>
                    )
                ) : (
                    <>
                        {featuredArticle && (
                            <section
                                className="newsFrontPage"
                                aria-label="Noticias destacadas"
                            >
                                <Link
                                    to={articleLink(featuredArticle.id)}
                                    className="newsFeatured"
                                >
                                    <NewsArtwork article={featuredArticle} />

                                    <div className="newsFeaturedContent">
                                        <span className="newsEyebrow">
                                            EN PORTADA / {featuredArticle.category}
                                        </span>

                                        <h2>{featuredArticle.title}</h2>

                                        <p>{featuredArticle.summary}</p>

                                        <div className="newsMetadata">
                                            <time
                                                dateTime={featuredArticle.publishedAt}
                                            >
                                                {formatDate(
                                                    featuredArticle.publishedAt
                                                )}
                                            </time>

                                            <span>
                                                {featuredArticle.readingMinutes}
                                                {" min de lectura"}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <aside className="newsHeadlines">
                                    <h2>En el radar</h2>

                                    {headlines.map((article, index) => (
                                        <Link
                                            key={article.id}
                                            to={articleLink(article.id)}
                                            className="newsHeadline"
                                        >
                                            <span className="newsHeadlineNumber">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <div>
                                                <span className="newsCategory">
                                                    {article.category}
                                                </span>

                                                <h3>{article.title}</h3>

                                                <span className="newsMetadata">
                                                    {article.readingMinutes}
                                                    {" min de lectura"}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </aside>
                            </section>
                        )}

                        <section
                            className="newsLatest"
                            aria-labelledby="newsLatestTitle"
                        >
                            <div className="newsLatestHeader">
                                <h2 id="newsLatestTitle">
                                    Últimas publicaciones
                                </h2>

                                <input
                                    type="search"
                                    className="newsSearch"
                                    placeholder="Buscar noticias..."
                                    aria-label="Buscar noticias"
                                    value={search}
                                    onChange={event =>
                                        setSearch(event.target.value)
                                    }
                                />
                            </div>

                            <div
                                className="newsFilters"
                                role="group"
                                aria-label="Filtrar por categoría"
                            >
                                <button
                                    type="button"
                                    aria-pressed={category === "Todas"}
                                    onClick={() => setCategory("Todas")}
                                >
                                    Todas
                                </button>

                                {newsCategories.map(item => (
                                    <button
                                        key={item}
                                        type="button"
                                        aria-pressed={category === item}
                                        onClick={() => setCategory(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            <p className="newsResultCount" role="status">
                                {visibleArticles.length} publicaciones
                            </p>

                            <div className="newsGrid">
                                {visibleArticles.map(article => (
                                    <Link
                                        key={article.id}
                                        to={articleLink(article.id)}
                                        className="newsCard"
                                    >
                                        <NewsArtwork article={article} />

                                        <div className="newsCardContent">
                                            <span className="newsCategory">
                                                {article.category}
                                            </span>

                                            <h3>{article.title}</h3>

                                            <p>{article.summary}</p>

                                            <div className="newsMetadata">
                                                <time dateTime={article.publishedAt}>
                                                    {formatDate(article.publishedAt)}
                                                </time>

                                                <span>
                                                    {article.readingMinutes} min
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {visibleArticles.length === 0 && (
                                <div className="newsEmpty">
                                    <p>
                                        No hay publicaciones que coincidan
                                        con tu búsqueda.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setCategory("Todas");
                                        }}
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}