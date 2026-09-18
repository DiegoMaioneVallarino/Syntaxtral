import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    mockQuestions
} from "./questions.mock";

import type {
    Question,
    QuestionAnswer
} from "./questions.mock";

import "./Questions.css";

type QuestionFilter =
    | "recent"
    | "unanswered"
    | "popular";

const filters: {
    value: QuestionFilter;
    label: string;
}[] = [
    { value: "recent", label: "Recientes" },
    { value: "unanswered", label: "Sin responder" },
    { value: "popular", label: "Más votadas" }
];

function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function formatDate(value: number): string {
    return new Date(value).toLocaleDateString("es", {
        day: "numeric",
        month: "short"
    });
}

export default function Questions() {
    const [questions, setQuestions] =
        useState<Question[]>(mockQuestions);

    const [search, setSearch] = useState("");
    const [filter, setFilter] =
        useState<QuestionFilter>("recent");
    const [selectedTag, setSelectedTag] =
        useState<string | null>(null);
    const [selectedId, setSelectedId] =
        useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tagInput, setTagInput] = useState("");

    const selectedQuestion = questions.find(
        question => question.id === selectedId
    );

    const tags = Array.from(
        new Set(questions.flatMap(question => question.tags))
    ).sort();

    const query = normalizeText(search.trim());

    const visibleQuestions = questions
        .filter(question => {
            const matchesSearch = normalizeText(
                [
                    question.title,
                    question.body,
                    question.author,
                    ...question.tags
                ].join(" ")
            ).includes(query);

            const matchesTag =
                selectedTag === null ||
                question.tags.includes(selectedTag);

            const matchesFilter =
                filter !== "unanswered" ||
                question.answers.length === 0;

            return matchesSearch && matchesTag && matchesFilter;
        })
        .sort((a, b) =>
            filter === "popular"
                ? b.votes - a.votes || b.createdAt - a.createdAt
                : b.createdAt - a.createdAt
        );

    function createQuestion(
        event: FormEvent<HTMLFormElement>
    ): void {
        event.preventDefault();

        if (!title.trim() || !body.trim()) {
            return;
        }

        const question: Question = {
            id: crypto.randomUUID(),
            title: title.trim(),
            body: body.trim(),
            author: "Tú",
            tags: Array.from(
                new Set(
                    tagInput
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(Boolean)
                )
            ).slice(0, 3),
            votes: 0,
            createdAt: Date.now(),
            answers: []
        };

        setQuestions(previous => [question, ...previous]);
        setSelectedId(question.id);
        setCreating(false);
        setTitle("");
        setBody("");
        setTagInput("");
    }

    return (
        <div className="questionsPage">
            <header className="questionsHero">
                <div>
                    <span className="questionsEyebrow">
                        SYNTAXTRAL COMMUNITY
                    </span>

                    <h1>Una buena pregunta abre otro mundo.</h1>

                    <p>
                        Comparte tus dudas, encuentra otras perspectivas
                        y construye conocimiento con la comunidad.
                    </p>
                </div>

                <button
                    type="button"
                    className="questionsPrimaryButton"
                    onClick={() => {
                        setSelectedId(null);
                        setCreating(true);
                    }}
                >
                    + Hacer una pregunta
                </button>
            </header>

            <div className="questionsLayout">
                <section
                    className="questionsContent"
                    aria-label="Preguntas y respuestas"
                >
                    {creating ? (
                        <form
                            className="questionsForm"
                            onSubmit={createQuestion}
                        >
                            <span className="questionsEyebrow">
                                NUEVA CONVERSACIÓN
                            </span>

                            <h2>¿Qué quieres entender?</h2>

                            <p className="questionsMuted">
                                Maqueta: tu pregunta solo se conservará
                                durante esta sesión de la página.
                            </p>

                            <label>
                                Título
                                <input
                                    autoFocus
                                    required
                                    maxLength={160}
                                    value={title}
                                    onChange={event =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="Escribe una pregunta concreta"
                                />
                            </label>

                            <label>
                                Contexto
                                <textarea
                                    required
                                    rows={7}
                                    maxLength={10000}
                                    value={body}
                                    onChange={event =>
                                        setBody(event.target.value)
                                    }
                                    placeholder="¿Qué has intentado? ¿Dónde aparece la duda?"
                                />
                            </label>

                            <label>
                                Etiquetas
                                <input
                                    value={tagInput}
                                    maxLength={120}
                                    onChange={event =>
                                        setTagInput(event.target.value)
                                    }
                                    placeholder="Geometría, Análisis"
                                />
                                <small>
                                    Hasta tres, separadas por comas.
                                </small>
                            </label>

                            <div className="questionsFormActions">
                                <button
                                    type="button"
                                    className="questionsSecondaryButton"
                                    onClick={() => setCreating(false)}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="questionsPrimaryButton"
                                    disabled={!title.trim() || !body.trim()}
                                >
                                    Añadir pregunta
                                </button>
                            </div>
                        </form>
                    ) : selectedQuestion ? (
                        <article className="questionsDetail">
                            <button
                                type="button"
                                className="questionsBackButton"
                                onClick={() => setSelectedId(null)}
                            >
                                ← Todas las preguntas
                            </button>

                            <div className="questionsTags">
                                {selectedQuestion.tags.map(tag => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>

                            <h2>{selectedQuestion.title}</h2>

                            <p className="questionsMetadata">
                                {selectedQuestion.author}
                                {" · "}
                                {formatDate(selectedQuestion.createdAt)}
                                {" · "}
                                {selectedQuestion.votes} votos
                            </p>

                            <p className="questionsBody">
                                {selectedQuestion.body}
                            </p>

                            <h3>
                                {selectedQuestion.answers.length} respuestas
                            </h3>

                            {selectedQuestion.answers.length === 0 && (
                                <p className="questionsEmpty">
                                    Esta pregunta todavía no tiene respuestas.
                                </p>
                            )}

                            {selectedQuestion.answers.map(answer => (
                                <section
                                    key={answer.id}
                                    className={`questionsAnswer ${
                                        answer.accepted
                                            ? "questionsAnswerAccepted"
                                            : ""
                                    }`}
                                >
                                    <header>
                                        <strong>{answer.author}</strong>

                                        {answer.accepted && (
                                            <span className="questionsSolved">
                                                ✓ Respuesta aceptada
                                            </span>
                                        )}
                                    </header>

                                    <p className="questionsBody">
                                        {answer.body}
                                    </p>
                                </section>
                            ))}
                        </article>
                    ) : (
                        <>
                            <div className="questionsControls">
                                <input
                                    type="search"
                                    className="questionsSearch"
                                    aria-label="Buscar preguntas"
                                    placeholder="Buscar una pregunta, tema o autor..."
                                    value={search}
                                    onChange={event =>
                                        setSearch(event.target.value)
                                    }
                                />

                                <div className="questionsFilters">
                                    {filters.map(item => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            aria-pressed={filter === item.value}
                                            onClick={() => setFilter(item.value)}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p
                                className="questionsResultCount"
                                role="status"
                            >
                                {visibleQuestions.length} preguntas
                                {selectedTag && ` en ${selectedTag}`}
                            </p>

                            <div className="questionsList">
                                {visibleQuestions.map(question => (
                                    <article
                                        key={question.id}
                                        className="questionsCard"
                                    >
                                        <div className="questionsStats">
                                            <strong>{question.votes}</strong>
                                            <span>votos</span>

                                            <strong>
                                                {question.answers.length}
                                            </strong>
                                            <span>respuestas</span>
                                        </div>

                                        <div className="questionsCardContent">
                                            {question.answers.some(
                                                answer => answer.accepted
                                            ) && (
                                                <span className="questionsSolved">
                                                    ✓ Resuelta
                                                </span>
                                            )}

                                            <h2>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedId(question.id)
                                                    }
                                                >
                                                    {question.title}
                                                </button>
                                            </h2>

                                            <p className="questionsExcerpt">
                                                {question.body}
                                            </p>

                                            <div className="questionsTags">
                                                {question.tags.map(tag => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        aria-pressed={
                                                            selectedTag === tag
                                                        }
                                                        onClick={() =>
                                                            setSelectedTag(
                                                                current =>
                                                                    current === tag
                                                                        ? null
                                                                        : tag
                                                            )
                                                        }
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>

                                            <p className="questionsMetadata">
                                                {question.author}
                                                {" · "}
                                                {formatDate(question.createdAt)}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {visibleQuestions.length === 0 && (
                                <div className="questionsEmpty">
                                    <p>
                                        No encontramos preguntas con esos filtros.
                                    </p>

                                    <button
                                        type="button"
                                        className="questionsSecondaryButton"
                                        onClick={() => {
                                            setSearch("");
                                            setFilter("recent");
                                            setSelectedTag(null);
                                        }}
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>

                <aside className="questionsSidebar">
                    <section className="questionsSidebarPanel">
                        <span className="questionsEyebrow">
                            EXPLORA
                        </span>

                        <h2>Encuentra tu tema</h2>

                        <div className="questionsTopics">
                            {[null, ...tags].map(tag => (
                                <button
                                    key={tag ?? "all"}
                                    type="button"
                                    aria-pressed={selectedTag === tag}
                                    onClick={() => {
                                        setSelectedTag(tag);
                                        setSelectedId(null);
                                        setCreating(false);
                                    }}
                                >
                                    {tag ?? "Todos los temas"}

                                    <span>
                                        {tag === null
                                            ? questions.length
                                            : questions.filter(question =>
                                                question.tags.includes(tag)
                                            ).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="questionsSidebarPanel">
                        <span className="questionsEyebrow">
                            LA CURIOSIDAD ES BIENVENIDA
                        </span>

                        <h2>No necesitas saberlo todo.</h2>

                        <p className="questionsMuted">
                            Cuenta qué estás intentando comprender,
                            comparte tus avances y pregunta con claridad.
                            Una duda básica también puede abrir
                            una gran conversación.
                        </p>
                    </section>
                </aside>
            </div>
        </div>
    );
}