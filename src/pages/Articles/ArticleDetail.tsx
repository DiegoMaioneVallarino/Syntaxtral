import {
    Link,
    useParams
} from "react-router-dom";

import {
    articles
} from "../../data/articles";

import type {
    ArticleStatus
} from "../../models/Article";

import "./ArticleDetail.css";


const statusLabels: Record<ArticleStatus, string> = {
    published: "Publicado",
    preprint: "Preprint",
    draft: "Borrador"
};


export default function ArticleDetail() {
    const { articleId } = useParams<{
        articleId: string;
    }>();

    const article = articles.find(
        item => item.id === articleId
    );

    if (!article) {
        return (
            <section className="articleDetailPage">
                <div className="articleDetailNotFound">
                    <span aria-hidden="true">∅</span>

                    <h1>Artículo no encontrado</h1>

                    <p>
                        El enlace no corresponde a un artículo
                        disponible.
                    </p>

                    <Link to="/articles">
                        Volver a artículos
                    </Link>
                </div>
            </section>
        );
    }

    const sections = article.sections ?? [];
    const references = article.references ?? [];

    return (
        <section
            key={article.id}
            className="articleDetailPage"
        >
            <div className="articleDetailContainer">
                <Link
                    to="/articles"
                    className="articleDetailBack"
                >
                    ← Todos los artículos
                </Link>

                <header className="articleDetailHeader">
                    <div className="articleDetailLabels">
                        <span className="articleDetailEyebrow">
                            SYNTAXTRAL JOURNAL
                        </span>

                        <span
                            className={`
                                articleDetailStatus
                                articleDetailStatus--${article.status}
                            `}
                        >
                            {statusLabels[article.status]}
                        </span>
                    </div>

                    <h1>{article.title}</h1>

                    <div className="articleDetailMetadata">
                        <span className="articleDetailAuthor">
                            {article.author}
                        </span>

                        <span>{article.publicationDate}</span>

                        <span>
                            {article.readingTime} min de lectura
                        </span>
                    </div>

                    <div className="articleDetailCategories">
                        {article.categories.map(category => (
                            <span key={category}>
                                {category}
                            </span>
                        ))}
                    </div>
                </header>

                {article.status === "draft" && (
                    <p className="articleDetailNotice">
                        Vista previa de un borrador.
                    </p>
                )}

                {article.imagePath && (
                    <figure className="articleDetailCover">
                        <img
                            src={article.imagePath}
                            alt={`Ilustración de ${article.title}`}
                            onError={event => {
                                event.currentTarget.hidden = true;
                            }}
                        />
                    </figure>
                )}

                <div className="articleDetailLayout">
                    <aside className="articleDetailSidebar">
                        <nav aria-label="Contenido del artículo">
                            <span className="articleDetailEyebrow">
                                EN ESTE ARTÍCULO
                            </span>

                            <a href="#article-abstract">
                                Resumen
                            </a>

                            {sections.map((section, index) => (
                                <a
                                    key={index}
                                    href={`#article-section-${index}`}
                                >
                                    <span>{index + 1}.</span>
                                    {section.title}
                                </a>
                            ))}

                            {references.length > 0 && (
                                <a href="#article-references">
                                    Referencias
                                </a>
                            )}
                        </nav>

                        <div className="articleDetailAuthorPanel">
                            <span className="articleDetailEyebrow">
                                AUTORÍA
                            </span>

                            <strong>{article.author}</strong>

                            <p>
                                Una contribución al conocimiento
                                compartido de la comunidad.
                            </p>
                        </div>
                    </aside>

                    <article className="articleDetailBody">
                        <section
                            id="article-abstract"
                            className="articleDetailAbstract"
                        >
                            <h2>Resumen</h2>

                            <p>{article.abstract.trim()}</p>
                        </section>

                        {sections.length === 0 ? (
                            <div className="articleDetailPending">
                                <h2>Contenido completo pendiente</h2>

                                <p>
                                    Este artículo tiene un resumen.
                                    Sus secciones aparecerán aquí
                                    cuando se añada el texto completo.
                                </p>
                            </div>
                        ) : (
                            sections.map((section, index) => (
                                <section
                                    key={index}
                                    id={`article-section-${index}`}
                                    className="articleDetailSection"
                                >
                                    <h2>
                                        <span>{index + 1}.</span>
                                        {section.title}
                                    </h2>

                                    {section.paragraphs.map(
                                        (paragraph, paragraphIndex) => (
                                            <p key={paragraphIndex}>
                                                {paragraph}
                                            </p>
                                        )
                                    )}
                                </section>
                            ))
                        )}

                        {references.length > 0 && (
                            <section
                                id="article-references"
                                className="articleDetailSection"
                            >
                                <h2>Referencias</h2>

                                <ol className="articleDetailReferences">
                                    {references.map((reference, index) => (
                                        <li key={index}>
                                            {reference.url &&
                                            /^https?:\/\//i.test(
                                                reference.url
                                            ) ? (
                                                <a
                                                    href={reference.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {reference.title} ↗
                                                </a>
                                            ) : (
                                                reference.title
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        )}

                        <footer className="articleDetailFooter">
                            <span>
                                {article.author}
                                {" · "}
                                {article.publicationDate}
                            </span>

                            <Link to="/articles">
                                Seguir explorando →
                            </Link>
                        </footer>
                    </article>
                </div>
            </div>
        </section>
    );
}