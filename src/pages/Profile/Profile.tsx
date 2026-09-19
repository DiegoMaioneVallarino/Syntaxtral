import {
    useState
} from "react";

import {
    Link,
    useSearchParams
} from "react-router-dom";

import {
    articles
} from "../../data/articles";

import {
    mockQuestions
} from "../Questions/questions.mock";

import {
    readSavedShaders
} from "../Shaders/shaderStore";

import {
    readProfile,
    writeProfile,
    safeSocialUrl
} from "./profileStore";

import type {
    CredentialKind,
    LocalProfile
} from "./profileStore";

import "./Profile.css";

type ProfileTab =
    | "publications"
    | "projects"
    | "articles"
    | "shaders"
    | "answers"
    | "saved";

const tabs: {
    value: ProfileTab;
    label: string;
}[] = [
    { value: "publications", label: "Publicaciones" },
    { value: "projects", label: "Proyectos" },
    { value: "articles", label: "Artículos" },
    { value: "shaders", label: "Shaders" },
    { value: "answers", label: "Respuestas" },
    { value: "saved", label: "Guardados" }
];

const credentialLabels: Record<CredentialKind, string> = {
    degree: "Formación académica",
    outreach: "Divulgación científica",
    award: "Reconocimiento"
};

const credentialSymbols: Record<CredentialKind, string> = {
    degree: "▤",
    outreach: "✦",
    award: "✧"
};

// Conservamos tus proyectos actuales como ejemplos visuales.
// Todavía no son documentos guardados de Calculator.
const demoProjects = [
    {
        id: "product-table",
        title: "Product table (mod 10)",
        category: "Álgebra",
        color: "#a855f7"
    },
    {
        id: "modular-curves",
        title: "Modular curve explorer",
        category: "Teoría de números",
        color: "#22d3ee"
    },
    {
        id: "newton-fractal",
        title: "Newton fractal",
        category: "Análisis complejo",
        color: "#f59e0b"
    },
    {
        id: "lorenz-attractor",
        title: "Lorenz attractor",
        category: "Sistemas dinámicos",
        color: "#ef476f"
    }
];

function EmptySection({
    message
}: {
    message: string;
}) {
    return (
        <div className="profileEmptySection">
            <span aria-hidden="true">∅</span>
            <p>{message}</p>
        </div>
    );
}

export default function Profile() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [profile, setProfile] = useState(readProfile);
    const [draft, setDraft] = useState(profile);
    const [editing, setEditing] = useState(false);
    const [status, setStatus] = useState("");
    const [postBody, setPostBody] = useState("");

    const [credentialKind, setCredentialKind] =
        useState<CredentialKind>("degree");
    const [credentialTitle, setCredentialTitle] = useState("");
    const [institution, setInstitution] = useState("");
    const [year, setYear] = useState("");

    const [socialLabel, setSocialLabel] = useState("");
    const [socialUrl, setSocialUrl] = useState("");

    const [messageOpen, setMessageOpen] = useState(false);
    const [messageDraft, setMessageDraft] = useState("");

    const [savedShaders] = useState(readSavedShaders);

    // Simulación visual; no constituye autenticación.
    const visitor = searchParams.get("view") === "visitor";

    const activeTab =
        tabs.find(tab => tab.value === searchParams.get("tab"))
            ?.value ?? "publications";

    const displayedTab =
        visitor && activeTab === "saved"
            ? "publications"
            : activeTab;

    const initials = profile.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0] ?? "")
        .join("")
        .toUpperCase();

    /*
     * Identidad provisional de los datos de ejemplo.
     * Editar el nombre visible no cambia la atribución.
     * En el backend esto debe convertirse en authorId.
     */
    const authorName = "Dmitry Rybalkin";

    const ownArticles = articles.filter(
        article =>
            article.author === authorName &&
            (!visitor || article.status !== "draft")
    );

    const ownAnswers = mockQuestions.flatMap(question =>
        question.answers
            .filter(answer => answer.author === authorName)
            .map(answer => ({
                questionId: question.id,
                questionTitle: question.title,
                answer
            }))
    );

    function selectTab(tab: ProfileTab): void {
        setSearchParams(previous => {
            const next = new URLSearchParams(previous);
            next.set("tab", tab);
            return next;
        });
    }

    function persist(next: LocalProfile): boolean {
        try {
            writeProfile(next);
            setProfile(next);
            setStatus("Guardado en este navegador.");
            return true;
        } catch {
            setStatus(
                "No se pudo guardar. Revisa el almacenamiento del navegador."
            );
            return false;
        }
    }

    return (
        <section className="profilePage">
            <div className="profileCover" />

            <header className="profileHeader">
                <div className="profileMainInformation">
                    <div className="profileLargeAvatar">
                        {initials}
                    </div>

                    <div className="profileIdentity">
                        <h1>{profile.name}</h1>
                        <span>@{profile.handle}</span>
                        <p>{profile.bio}</p>

                        <div className="profileMetadata">
                            <span>⌖ {profile.location}</span>
                            <span>Perfil de demostración</span>
                        </div>
                    </div>
                </div>

                <div className="profileHeaderRight">
                    <div className="profileActionGroup">
                        {visitor ? (
                            <button
                                type="button"
                                className="profileEditButton"
                                onClick={() =>
                                    setMessageOpen(value => !value)
                                }
                            >
                                Mensaje
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="profileEditButton"
                                onClick={() => {
                                    setDraft(profile);
                                    setEditing(true);
                                    setStatus("");
                                }}
                            >
                                Editar perfil
                            </button>
                        )}

                        <button
                            type="button"
                            className="profileSecondaryButton"
                            onClick={() => {
                                setEditing(false);
                                setMessageOpen(false);

                                setSearchParams(previous => {
                                    const next =
                                        new URLSearchParams(previous);

                                    if (visitor) {
                                        next.delete("view");
                                    } else {
                                        next.set("view", "visitor");
                                        next.set("tab", "publications");
                                    }

                                    return next;
                                });
                            }}
                        >
                            {visitor
                                ? "Volver a mi vista"
                                : "Vista de visitante"}
                        </button>
                    </div>

                    <div className="profileStatistics">
                        <div>
                            <strong>{profile.posts.length}</strong>
                            <span>Posts</span>
                        </div>
                        <div>
                            <strong>{ownArticles.length}</strong>
                            <span>Artículos</span>
                        </div>
                        <div>
                            <strong>{savedShaders.length}</strong>
                            <span>Shaders locales</span>
                        </div>
                        <div>
                            <strong>{ownAnswers.length}</strong>
                            <span>Respuestas</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="profileStatus" role="status">
                {status}
            </div>

            {messageOpen && visitor && (
                <section className="profileMessageBox">
                    <h2>Mensaje para {profile.name}</h2>

                    <p>
                        Vista de demostración: este borrador no se envía
                        y se pierde al salir de la página.
                    </p>

                    <textarea
                        aria-label="Borrador del mensaje"
                        rows={4}
                        value={messageDraft}
                        onChange={event =>
                            setMessageDraft(event.target.value)
                        }
                        placeholder="Escribe un mensaje..."
                    />

                    <button
                        type="button"
                        className="profileSecondaryButton"
                        onClick={() => setMessageOpen(false)}
                    >
                        Cerrar
                    </button>
                </section>
            )}

            {editing && !visitor && (
                <section className="profileEditPanel">
                    <h2>Editar perfil</h2>

                    <div className="profileEditFields">
                        <label>
                            Nombre
                            <input
                                value={draft.name}
                                maxLength={100}
                                onChange={event =>
                                    setDraft({
                                        ...draft,
                                        name: event.target.value
                                    })
                                }
                            />
                        </label>

                        <label>
                            Ubicación
                            <input
                                value={draft.location}
                                maxLength={100}
                                onChange={event =>
                                    setDraft({
                                        ...draft,
                                        location: event.target.value
                                    })
                                }
                            />
                        </label>

                        <label className="profileFullWidth">
                            Biografía
                            <textarea
                                rows={3}
                                maxLength={600}
                                value={draft.bio}
                                onChange={event =>
                                    setDraft({
                                        ...draft,
                                        bio: event.target.value
                                    })
                                }
                            />
                        </label>
                    </div>

                    <h3>Añadir una placa</h3>

                    <p className="profileHelp">
                        Las credenciales añadidas aquí son declaraciones
                        del usuario y no están verificadas.
                    </p>

                    <div className="profileEditFields">
                        <label>
                            Tipo
                            <select
                                value={credentialKind}
                                onChange={event => {
                                    const kind = event.target.value;

                                    if (
                                        kind === "degree" ||
                                        kind === "outreach" ||
                                        kind === "award"
                                    ) {
                                        setCredentialKind(kind);
                                    }
                                }}
                            >
                                <option value="degree">Título académico</option>
                                <option value="outreach">Divulgador científico</option>
                                <option value="award">Premio o medalla</option>
                            </select>
                        </label>

                        <label>
                            Título o reconocimiento
                            <input
                                value={credentialTitle}
                                maxLength={150}
                                placeholder="Doctorado en Matemáticas"
                                onChange={event =>
                                    setCredentialTitle(event.target.value)
                                }
                            />
                        </label>

                        <label>
                            Escuela, institución o canal
                            <input
                                value={institution}
                                maxLength={150}
                                placeholder="Nombre de la institución"
                                onChange={event =>
                                    setInstitution(event.target.value)
                                }
                            />
                        </label>

                        <label>
                            Año
                            <input
                                value={year}
                                maxLength={4}
                                inputMode="numeric"
                                onChange={event =>
                                    setYear(
                                        event.target.value.replace(/\D/g, "")
                                    )
                                }
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        className="profileSecondaryButton"
                        disabled={!credentialTitle.trim()}
                        onClick={() => {
                            setDraft(current => ({
                                ...current,
                                credentials: [
                                    ...current.credentials,
                                    {
                                        id: crypto.randomUUID(),
                                        kind: credentialKind,
                                        title: credentialTitle.trim(),
                                        institution: institution.trim(),
                                        year
                                    }
                                ]
                            }));

                            setCredentialTitle("");
                            setInstitution("");
                            setYear("");
                        }}
                    >
                        + Añadir placa al perfil
                    </button>

                    {draft.credentials.map(credential => (
                        <div
                            key={credential.id}
                            className="profileEditableItem"
                        >
                            <span>{credential.title}</span>

                            <button
                                type="button"
                                aria-label={`Quitar ${credential.title}`}
                                onClick={() =>
                                    setDraft(current => ({
                                        ...current,
                                        credentials:
                                            current.credentials.filter(
                                                item => item.id !== credential.id
                                            )
                                    }))
                                }
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <h3>Redes y enlaces</h3>

                    <div className="profileEditFields">
                        <label>
                            Nombre
                            <input
                                value={socialLabel}
                                maxLength={50}
                                placeholder="GitHub, YouTube, sitio web..."
                                onChange={event =>
                                    setSocialLabel(event.target.value)
                                }
                            />
                        </label>

                        <label>
                            Dirección
                            <input
                                type="url"
                                value={socialUrl}
                                placeholder="https://..."
                                onChange={event =>
                                    setSocialUrl(event.target.value)
                                }
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        className="profileSecondaryButton"
                        disabled={
                            !socialLabel.trim() ||
                            !safeSocialUrl(socialUrl)
                        }
                        onClick={() => {
                            const url = safeSocialUrl(socialUrl);

                            if (!url) {
                                return;
                            }

                            setDraft(current => ({
                                ...current,
                                socials: [
                                    ...current.socials,
                                    {
                                        id: crypto.randomUUID(),
                                        label: socialLabel.trim(),
                                        url
                                    }
                                ]
                            }));

                            setSocialLabel("");
                            setSocialUrl("");
                        }}
                    >
                        + Añadir enlace
                    </button>

                    {draft.socials.map(social => (
                        <div
                            key={social.id}
                            className="profileEditableItem"
                        >
                            <span>{social.label}: {social.url}</span>

                            <button
                                type="button"
                                aria-label={`Quitar ${social.label}`}
                                onClick={() =>
                                    setDraft(current => ({
                                        ...current,
                                        socials: current.socials.filter(
                                            item => item.id !== social.id
                                        )
                                    }))
                                }
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <div className="profileActionGroup">
                        <button
                            type="button"
                            className="profileSecondaryButton"
                            onClick={() => setEditing(false)}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className="profileEditButton"
                            disabled={!draft.name.trim()}
                            onClick={() => {
                                if (persist({
                                    ...draft,
                                    name: draft.name.trim(),
                                    posts: profile.posts
                                })) {
                                    setEditing(false);
                                }
                            }}
                        >
                            Guardar cambios
                        </button>
                    </div>
                </section>
            )}

            <div className="profileWorkspace">
                <aside className="profileSidebar">
                    <section className="profileSidebarCard">
                        <h2>Trayectoria</h2>

                        {profile.credentials.length === 0 && (
                            <p className="profileHelp">
                                Sin credenciales añadidas.
                            </p>
                        )}

                        {profile.credentials.map(credential => (
                            <details
                                key={credential.id}
                                className={`profileCredential profileCredential-${credential.kind}`}
                            >
                                <summary>
                                    <span aria-hidden="true">
                                        {credentialSymbols[credential.kind]}
                                    </span>

                                    <span>
                                        <strong>{credential.title}</strong>
                                        <small>Declarada · sin verificar</small>
                                    </span>
                                </summary>

                                <p>{credentialLabels[credential.kind]}</p>
                                <p>{credential.institution || "Sin institución indicada"}</p>

                                {credential.year && (
                                    <p>Año: {credential.year}</p>
                                )}
                            </details>
                        ))}
                    </section>

                    <section className="profileSidebarCard">
                        <h2>Encuéntrame en</h2>

                        {profile.socials.length === 0 && (
                            <p className="profileHelp">
                                Sin redes añadidas.
                            </p>
                        )}

                        {profile.socials.map(social => {
                            const url = safeSocialUrl(social.url);

                            return url ? (
                                <a
                                    key={social.id}
                                    className="profileSocialLink"
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.label}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            ) : null;
                        })}
                    </section>
                </aside>

                <div className="profileMainColumn">
                    <nav className="profileTabs" aria-label="Contenido del perfil">
                        {tabs
                            .filter(tab => !visitor || tab.value !== "saved")
                            .map(tab => (
                                <button
                                    key={tab.value}
                                    type="button"
                                    aria-pressed={displayedTab === tab.value}
                                    className={
                                        displayedTab === tab.value
                                            ? "profileTabActive"
                                            : ""
                                    }
                                    onClick={() => selectTab(tab.value)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                    </nav>

                    <div className="profileContent">
                        {displayedTab === "publications" && (
                            <>
                                {!visitor && !editing && (
                                    <form
                                        className="profileComposer"
                                        onSubmit={event => {
                                            event.preventDefault();

                                            if (!postBody.trim()) {
                                                return;
                                            }

                                            if (persist({
                                                ...profile,
                                                posts: [
                                                    {
                                                        id: crypto.randomUUID(),
                                                        body: postBody.trim(),
                                                        createdAt: Date.now()
                                                    },
                                                    ...profile.posts
                                                ]
                                            })) {
                                                setPostBody("");
                                            }
                                        }}
                                    >
                                        <label htmlFor="profile-post">
                                            Comparte una idea
                                        </label>

                                        <textarea
                                            id="profile-post"
                                            rows={4}
                                            maxLength={5000}
                                            value={postBody}
                                            onChange={event =>
                                                setPostBody(event.target.value)
                                            }
                                            placeholder="Un descubrimiento, una duda, algo que estás explorando..."
                                        />

                                        <button
                                            type="submit"
                                            className="profileEditButton"
                                            disabled={!postBody.trim()}
                                        >
                                            Publicar en este perfil local
                                        </button>
                                    </form>
                                )}

                                {profile.posts.length === 0 && (
                                    <EmptySection message="Todavía no hay publicaciones." />
                                )}

                                {profile.posts.map(post => (
                                    <article key={post.id} className="profileFeedCard">
                                        <header>
                                            <strong>{profile.name}</strong>
                                            <time dateTime={new Date(post.createdAt).toISOString()}>
                                                {new Date(post.createdAt).toLocaleString("es-MX")}
                                            </time>
                                        </header>

                                        <p className="profilePostBody">{post.body}</p>
                                    </article>
                                ))}
                            </>
                        )}

                        {displayedTab === "projects" && (
                            <>
                                <p className="profileHelp">
                                    Proyectos de ejemplo. La carga de documentos
                                    guardados de Calculator aún está pendiente.
                                </p>

                                <div className="profileProjectGrid">
                                    {demoProjects.map(project => (
                                        <article key={project.id} className="profileProjectCard">
                                            <div
                                                className="profileProjectPreview"
                                                style={{
                                                    background:
                                                        `radial-gradient(circle, ${project.color}88, #08090d 75%)`
                                                }}
                                            >
                                                <span>ƒ</span>
                                            </div>

                                            <div className="profileProjectDetails">
                                                <strong>{project.title}</strong>
                                                <span>{project.category}</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {!visitor && (
                                    <Link className="profileTextLink" to="/calculator">
                                        Abrir Calculator →
                                    </Link>
                                )}
                            </>
                        )}

                        {displayedTab === "articles" && (
                            <>
                                {ownArticles.length === 0 && (
                                    <EmptySection message="No hay artículos atribuidos a este usuario en los datos actuales." />
                                )}

                                {ownArticles.map(article => (
                                    <Link
                                        key={article.id}
                                        className="profileFeedCard"
                                        to={`/articles?article=${encodeURIComponent(String(article.id))}`}
                                    >
                                        <small>ARTÍCULO · {article.status}</small>
                                        <h2>{article.title}</h2>
                                        <p>{article.abstract}</p>
                                    </Link>
                                ))}
                            </>
                        )}

                        {displayedTab === "shaders" && (
                            <>
                                <p className="profileHelp">
                                    Shaders guardados en este navegador,
                                    asociados provisionalmente al perfil local.
                                </p>

                                {savedShaders.length === 0 && (
                                    <EmptySection message="Todavía no tienes shaders guardados." />
                                )}

                                {savedShaders.map(shader => (
                                    <Link
                                        key={shader.id}
                                        className="profileFeedCard"
                                        to={`/shaders/${encodeURIComponent(shader.id)}`}
                                    >
                                        <small>SHADER</small>
                                        <h2>{shader.title}</h2>
                                        <span>Abrir editor →</span>
                                    </Link>
                                ))}
                            </>
                        )}

                        {displayedTab === "answers" && (
                            <>
                                {ownAnswers.length === 0 && (
                                    <EmptySection message="No hay respuestas atribuidas a este usuario en los datos actuales." />
                                )}

                                {ownAnswers.map(({ questionId, questionTitle, answer }) => (
                                    <Link
                                        key={`${questionId}:${answer.id}`}
                                        className="profileFeedCard"
                                        to={
                                            `/questions?question=${encodeURIComponent(questionId)}` +
                                            `#answer-${encodeURIComponent(answer.id)}`
                                        }
                                    >
                                        <small>
                                            {answer.accepted
                                                ? "✓ RESPUESTA ACEPTADA"
                                                : "RESPUESTA"}
                                        </small>

                                        <h2>{questionTitle}</h2>
                                        <p>{answer.body}</p>
                                    </Link>
                                ))}
                            </>
                        )}

                        {displayedTab === "saved" && (
                            <EmptySection message="Aquí aparecerá tu contenido guardado cuando conectemos los favoritos." />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}