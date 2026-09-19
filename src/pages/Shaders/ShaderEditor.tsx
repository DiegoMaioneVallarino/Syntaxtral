import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import ShaderCanvas from "./ShaderCanvas";

import {
    exampleShaders,
    readSavedShaders,
    saveShader,
    starterShader
} from "./shaderStore";

import type {
    ShaderProject
} from "./shaderStore";

import "./Shaders.css";

export default function ShaderEditor() {
    const { shaderId } = useParams();

    // Reinicia el estado cuando cambia el proyecto de la URL.
    return (
        <ShaderEditorSession
            key={shaderId ?? "new"}
            shaderId={shaderId}
        />
    );
}

function ShaderEditorSession({
    shaderId
}: {
    shaderId: string | undefined;
}) {
    const navigate = useNavigate();

    const [initialProject] = useState<ShaderProject | undefined>(
        () => {
            if (!shaderId || shaderId === "new") {
                return undefined;
            }

            return [
                ...readSavedShaders(),
                ...exampleShaders
            ].find(project => project.id === shaderId);
        }
    );

    const [title, setTitle] = useState(
        initialProject?.title ?? "Mi nuevo shader"
    );

    const [code, setCode] = useState(
        initialProject?.code ?? starterShader
    );

    const [compiledCode, setCompiledCode] = useState(code);
    const [automatic, setAutomatic] = useState(true);
    const [playing, setPlaying] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState("");

    const isExample =
        initialProject?.id.startsWith("example-") ?? false;

    const notFound =
        Boolean(shaderId) &&
        shaderId !== "new" &&
        !initialProject;

    useEffect(() => {
        if (!automatic) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setCompiledCode(code);
        }, 600);

        return () => window.clearTimeout(timeout);
    }, [code, automatic]);

    function handleSave(): void {
        if (!title.trim()) {
            setSaveMessage("Añade un nombre al shader.");
            return;
        }

        const id =
            initialProject && !isExample
                ? initialProject.id
                : crypto.randomUUID();

        try {
            saveShader({
                id,
                title: title.trim(),
                code
            });

            if (id !== shaderId) {
                navigate(`/shaders/${id}`, {
                    replace: true
                });
            } else {
                setSaveMessage("Guardado en este navegador.");
            }
        } catch {
            setSaveMessage(
                "No se pudo guardar. Revisa el espacio o los permisos del navegador."
            );
        }
    }

    if (notFound) {
        return (
            <section className="shadersPage">
                <h1>No encontramos ese shader.</h1>
                <Link to="/shaders">← Volver a la galería</Link>
            </section>
        );
    }

    return (
        <section className="shaderEditorPage">
            <header className="shaderEditorHeader">
                <Link
                    to="/shaders"
                    className="shaderBackLink"
                >
                    ← Shaders
                </Link>

                <input
                    className="shaderTitleInput"
                    aria-label="Nombre del shader"
                    maxLength={100}
                    value={title}
                    onChange={event => {
                        setTitle(event.target.value);
                        setSaveMessage("");
                    }}
                />

                <button
                    type="button"
                    className="shaderPrimaryButton"
                    onClick={handleSave}
                >
                    {isExample ? "Guardar copia" : "Guardar"}
                </button>
            </header>

            <div className="shaderEditorColumns">
                <section
                    className="shaderCodePanel"
                    aria-label="Editor de código"
                >
                    <header className="shaderPanelHeader">
                        <span>fragment.glsl</span>

                        <div className="shaderPanelActions">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={automatic}
                                    onChange={event =>
                                        setAutomatic(event.target.checked)
                                    }
                                />
                                Auto
                            </label>

                            <button
                                type="button"
                                onClick={() => setCompiledCode(code)}
                            >
                                Ejecutar
                            </button>
                        </div>
                    </header>

                    <textarea
                        className="shaderCodeInput"
                        aria-label="Código GLSL del fragment shader"
                        value={code}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoCorrect="off"
                        wrap="off"
                        onChange={event => {
                            setCode(event.target.value);
                            setSaveMessage("");
                        }}
                        onKeyDown={event => {
                            if (
                                (event.ctrlKey || event.metaKey) &&
                                event.key === "Enter"
                            ) {
                                event.preventDefault();
                                setCompiledCode(code);
                            }
                        }}
                    />

                    <div
                        className={`shaderCompilerStatus ${
                            error ? "shaderCompilerError" : ""
                        }`}
                        role="status"
                    >
                        {error ? (
                            <pre>{error}</pre>
                        ) : (
                            <span>
                                {code !== compiledCode
                                    ? "Cambios pendientes de compilar"
                                    : "Sin errores de compilación"}
                            </span>
                        )}
                    </div>
                </section>

                <section
                    className="shaderPreviewPanel"
                    aria-label="Vista previa"
                >
                    <header className="shaderPanelHeader">
                        <span>Vista previa</span>

                        <button
                            type="button"
                            aria-pressed={!playing}
                            onClick={() =>
                                setPlaying(previous => !previous)
                            }
                        >
                            {playing ? "Pausar tiempo" : "Reanudar"}
                        </button>
                    </header>

                    <div className="shaderPreviewViewport">
                        <ShaderCanvas
                            code={compiledCode}
                            playing={playing}
                            onError={setError}
                        />
                    </div>
                </section>
            </div>

            <footer className="shaderEditorFooter">
                <span>
                    GLSL · WebGL 1 · u_time: segundos ·
                    u_resolution: tamaño en píxeles
                </span>

                <span role="status">
                    {saveMessage ||
                        "Guardado local. Guarda antes de salir."}
                </span>
            </footer>
        </section>
    );
}