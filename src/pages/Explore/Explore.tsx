import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import ModelCard from "../../components/ModelCard/ModelCard";

import {
    mathematicalModels
} from "../../data/mathematicalModels";

import {
    articles
} from "../../data/articles";

import {
    mockQuestions
} from "../Questions/questions.mock";

import {
    exampleShaders,
    readSavedShaders
} from "../Shaders/shaderStore";

import type {
    ShaderProject
} from "../Shaders/shaderStore";

import ShaderCanvas from "../Shaders/ShaderCanvas";

import "./Explore.css";

type Model = (typeof mathematicalModels)[number];
type Article = (typeof articles)[number];
type Question = (typeof mockQuestions)[number];

type ExplorePost =
    | {
        kind: "project";
        id: string;
        title: string;
        author: string;
        tags: string[];
        data: Model;
    }
    | {
        kind: "article";
        id: string;
        title: string;
        author: string;
        tags: string[];
        data: Article;
    }
    | {
        kind: "shader";
        id: string;
        title: string;
        author: string;
        tags: string[];
        data: ShaderProject;
    }
    | {
        kind: "question";
        id: string;
        title: string;
        author: string;
        tags: string[];
        data: Question;
    };

type PostFilter = "all" | ExplorePost["kind"];
type SortMode = "mixed" | "title";

const typeOptions: {
    value: PostFilter;
    label: string;
}[] = [
    { value: "all", label: "Todo" },
    { value: "project", label: "Proyectos" },
    { value: "article", label: "Artículos" },
    { value: "shader", label: "Shaders" },
    { value: "question", label: "Preguntas" }
];

const typeLabels: Record<ExplorePost["kind"], string> = {
    project: "Proyecto",
    article: "Artículo",
    shader: "Shader",
    question: "Pregunta"
};

function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function interleave(
    groups: ExplorePost[][]
): ExplorePost[] {
    const result: ExplorePost[] = [];

    const maximumLength = Math.max(
        0,
        ...groups.map(group => group.length)
    );

    for (let index = 0; index < maximumLength; index += 1) {
        for (const group of groups) {
            const post = group[index];

            if (post) {
                result.push(post);
            }
        }
    }

    return result;
}

function ShaderFeedPreview({
    code,
    active
}: {
    code: string;
    active: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const observer = new IntersectionObserver(entries => {
            setVisible(
                entries[0]?.isIntersecting ?? false
            );
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="exploreShaderPreview"
        >
            {active && visible ? (
                <ShaderCanvas
                    code={code}
                    preview
                />
            ) : (
                <div className="exploreShaderPlaceholder">
                    <span aria-hidden="true">✧</span>
                    <small>
                        Pasa el cursor para reproducir
                    </small>
                </div>
            )}
        </div>
    );
}

function PostTags({
    tags
}: {
    tags: string[];
}) {
    return (
        <div className="explorePostTags">
            {tags.slice(0, 3).map(tag => (
                <span key={tag}>{tag}</span>
            ))}
        </div>
    );
}

function ExplorePostCard({
    post,
    shaderActive,
    onShaderActivate,
    onShaderDeactivate
}: {
    post: ExplorePost;
    shaderActive: boolean;
    onShaderActivate: () => void;
    onShaderDeactivate: () => void;
}) {
    if (post.kind === "project") {
        return (
            <div className="exploreProjectPost">
                <span className="explorePostType">
                    ◇ Proyecto
                </span>

                <ModelCard model={post.data} />
            </div>
        );
    }

    if (post.kind === "shader") {
        return (
            <Link
                className="explorePostCard"
                to={`/shaders/${encodeURIComponent(post.data.id)}`}
                onMouseEnter={onShaderActivate}
                onMouseLeave={onShaderDeactivate}
                onFocus={onShaderActivate}
                onBlur={onShaderDeactivate}
            >
                <ShaderFeedPreview
                    code={post.data.code}
                    active={shaderActive}
                />

                <div className="explorePostContent">
                    <span className="explorePostType">
                        ✧ Shader
                    </span>

                    <h2>{post.title}</h2>

                    <p className="explorePostExcerpt">
                        Abre el código, modifica sus fórmulas
                        y explora el resultado en tiempo real.
                    </p>

                    <PostTags tags={post.tags} />

                    <footer className="explorePostFooter">
                        <span>{post.author}</span>
                        <span>Abrir editor ↗</span>
                    </footer>
                </div>
            </Link>
        );
    }

    if (post.kind === "article") {
        return (
            <Link
                className="explorePostCard"
                to={
                    "/articles?article=" +
                    encodeURIComponent(String(post.data.id))
                }
            >
                <img
                    className="exploreArticleImage"
                    src={post.data.imagePath}
                    alt=""
                    loading="lazy"
                />

                <div className="explorePostContent">
                    <span className="explorePostType">
                        ▤ Artículo
                    </span>

                    <h2>{post.title}</h2>

                    <p className="explorePostExcerpt">
                        {post.data.abstract}
                    </p>

                    <PostTags tags={post.tags} />

                    <footer className="explorePostFooter">
                        <span>{post.author}</span>
                        <span>{post.data.publicationDate}</span>
                    </footer>
                </div>
            </Link>
        );
    }

    const answered = post.data.answers.some(
        answer => answer.accepted
    );

    return (
        <Link
            className="explorePostCard exploreQuestionPost"
            to={
                "/questions?question=" +
                encodeURIComponent(post.data.id)
            }
        >
            <div className="explorePostContent">
                <div className="exploreQuestionHeading">
                    <span className="explorePostType">
                        ? Pregunta
                    </span>

                    {answered && (
                        <span className="exploreQuestionSolved">
                            ✓ Resuelta
                        </span>
                    )}
                </div>

                <span
                    className="exploreQuestionSymbol"
                    aria-hidden="true"
                >
                    ?
                </span>

                <h2>{post.title}</h2>

                <p className="explorePostExcerpt">
                    {post.data.body}
                </p>

                <PostTags tags={post.tags} />

                <div className="exploreQuestionStats">
                    <span>
                        {post.data.votes} votos
                    </span>

                    <span>
                        {post.data.answers.length} respuestas
                    </span>
                </div>

                <footer className="explorePostFooter">
                    <span>{post.author}</span>

                    <span>
                        {new Date(
                            post.data.createdAt
                        ).toLocaleDateString("es-MX")}
                    </span>
                </footer>
            </div>
        </Link>
    );
}

export default function Explore() {
    const [selectedType, setSelectedType] =
        useState<PostFilter>("all");

    const [selectedTopic, setSelectedTopic] =
        useState("");

    const [searchValue, setSearchValue] =
        useState("");

    const [sortMode, setSortMode] =
        useState<SortMode>("mixed");

    const [savedShaders] = useState(readSavedShaders);

    const [activeShaderId, setActiveShaderId] =
        useState<string | null>(null);

    const posts = useMemo(() => {
        const projects: ExplorePost[] =
            mathematicalModels.map(model => ({
                kind: "project",
                id: `project:${model.id}`,
                title: model.title,
                author: model.author,
                tags: Array.from(new Set([
                    model.categoryLabel,
                    ...model.topics
                ])),
                data: model
            }));

        const articlePosts: ExplorePost[] =
            articles
                .filter(article => article.status !== "draft")
                .map(article => ({
                    kind: "article",
                    id: `article:${article.id}`,
                    title: article.title,
                    author: article.author,
                    tags: [...article.categories],
                    data: article
                }));

        const shaderPosts: ExplorePost[] = [
            ...savedShaders,
            ...exampleShaders
        ].map(shader => ({
            kind: "shader",
            id: `shader:${shader.id}`,
            title: shader.title,
            author: shader.id.startsWith("example-")
                ? "Ejemplo de Syntaxtral"
                : "Tú · guardado local",
            tags: ["GLSL", "Gráficos"],
            data: shader
        }));

        const questionPosts: ExplorePost[] =
            mockQuestions.map(question => ({
                kind: "question",
                id: `question:${question.id}`,
                title: question.title,
                author: question.author,
                tags: [...question.tags],
                data: question
            }));

        return interleave([
            projects,
            articlePosts,
            shaderPosts,
            questionPosts
        ]);
    }, [savedShaders]);

    const topics = useMemo(() => {
        return Array.from(
            new Set(posts.flatMap(post => post.tags))
        ).sort((a, b) => a.localeCompare(b, "es"));
    }, [posts]);

    const filteredPosts = useMemo(() => {
        const query = normalizeText(searchValue.trim());

        const result = posts.filter(post => {
            const matchesType =
                selectedType === "all" ||
                post.kind === selectedType;

            const matchesTopic =
                selectedTopic === "" ||
                post.tags.includes(selectedTopic);

            const searchableText = [
                post.title,
                post.author,
                typeLabels[post.kind],
                ...post.tags,
                post.kind === "article"
                    ? post.data.abstract
                    : post.kind === "question"
                        ? post.data.body
                        : ""
            ].join(" ");

            return (
                matchesType &&
                matchesTopic &&
                normalizeText(searchableText).includes(query)
            );
        });

        if (sortMode === "title") {
            result.sort((a, b) =>
                a.title.localeCompare(b.title, "es")
            );
        }

        return result;
    }, [
        posts,
        selectedType,
        selectedTopic,
        searchValue,
        sortMode
    ]);

    return (
        <section className="explorePage">
            <header className="exploreHeader">
                <div>
                    <span className="exploreEyebrow">
                        Laboratorio público
                    </span>

                    <h1>Explora</h1>

                    <p>
                        Proyectos, artículos, shaders y preguntas:
                        distintas maneras de explorar las matemáticas.
                    </p>
                </div>

                <label className="exploreSearch">
                    <span aria-hidden="true">⌕</span>

                    <input
                        type="search"
                        aria-label="Buscar publicaciones"
                        value={searchValue}
                        placeholder="Buscar publicaciones, autores o temas..."
                        onChange={event =>
                            setSearchValue(event.target.value)
                        }
                    />
                </label>
            </header>

            <div
                className="exploreFilters"
                role="group"
                aria-label="Tipo de publicación"
            >
                {typeOptions.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        className={
                            selectedType === option.value
                                ? "exploreFilter exploreFilterActive"
                                : "exploreFilter"
                        }
                        aria-pressed={selectedType === option.value}
                        onClick={() => {
                            setSelectedType(option.value);
                            setActiveShaderId(null);
                        }}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="exploreSecondaryFilters">
                <label>
                    Tema

                    <select
                        value={selectedTopic}
                        onChange={event =>
                            setSelectedTopic(event.target.value)
                        }
                    >
                        <option value="">Todos los temas</option>

                        {topics.map(topic => (
                            <option key={topic} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Orden

                    <select
                        value={sortMode}
                        onChange={event =>
                            setSortMode(
                                event.target.value === "title"
                                    ? "title"
                                    : "mixed"
                            )
                        }
                    >
                        <option value="mixed">Contenido variado</option>
                        <option value="title">Título A–Z</option>
                    </select>
                </label>
            </div>

            <div className="exploreResultsHeader">
                <span role="status">
                    {filteredPosts.length} publicaciones
                </span>

                <span>
                    Ejemplos y contenido local
                </span>
            </div>

            {filteredPosts.length > 0 ? (
                <div className="exploreGrid">
                    {filteredPosts.map(post => (
                        <ExplorePostCard
                            key={post.id}
                            post={post}
                            shaderActive={activeShaderId === post.id}
                            onShaderActivate={() =>
                                setActiveShaderId(post.id)
                            }
                            onShaderDeactivate={() =>
                                setActiveShaderId(current =>
                                    current === post.id ? null : current
                                )
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className="exploreEmpty">
                    <span className="exploreEmptySymbol">∅</span>

                    <h2>No encontramos publicaciones</h2>

                    <p>
                        Prueba con otro tema o una búsqueda más amplia.
                    </p>

                    <button
                        type="button"
                        className="exploreFilter"
                        onClick={() => {
                            setSelectedType("all");
                            setSelectedTopic("");
                            setSearchValue("");
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}
        </section>
    );
}