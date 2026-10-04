import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    readShaderComments,
    writeShaderComments
} from "./shaderCommentsStore";

import type {
    ShaderComment
} from "./shaderCommentsStore";


type ShaderCommentsProps = {
    shaderId: string;
};

function formatDate(value: number): string {
    return new Date(value).toLocaleString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function ShaderComments({
    shaderId
}: ShaderCommentsProps) {
    const [comments, setComments] = useState(
        () => readShaderComments(shaderId)
    );

    const [body, setBody] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    function publishComment(
        event: FormEvent<HTMLFormElement>
    ): void {
        event.preventDefault();

        const text = body.trim();

        if (!text || text.length > 2000) {
            return;
        }

        const comment: ShaderComment = {
            id: crypto.randomUUID(),
            author: "Tú",
            body: text,
            createdAt: Date.now()
        };

        const nextComments = [
            comment,
            ...comments
        ];

        try {
            writeShaderComments(
                shaderId,
                nextComments
            );

            setComments(nextComments);
            setBody("");
            setError(false);
            setMessage("Comentario guardado en este navegador.");
        } catch {
            setError(true);
            setMessage(
                "No se pudo guardar el comentario. Tu texto sigue en el formulario."
            );
        }
    }

    return (
        <section
            className="shaderComments"
            aria-labelledby="shader-comments-title"
        >
            <header className="shaderCommentsHeader">
                <div>
                    <span className="shadersEyebrow">
                        CONVERSACIÓN
                    </span>

                    <h2 id="shader-comments-title">
                        Comentarios
                        <span>{comments.length}</span>
                    </h2>
                </div>

                <small>
                    Guardados en este navegador
                </small>
            </header>

            <form
                className="shaderCommentForm"
                onSubmit={publishComment}
            >
                <label htmlFor="shader-comment-body">
                    Comparte una idea o pregunta
                </label>

                <textarea
                    id="shader-comment-body"
                    rows={3}
                    maxLength={2000}
                    value={body}
                    placeholder="¿Cómo mejorarías este shader?"
                    onChange={event => {
                        setBody(event.target.value);
                        setMessage("");
                        setError(false);
                    }}
                />

                <div className="shaderCommentFormActions">
                    <small>
                        {body.length}/2000
                    </small>

                    <button
                        type="submit"
                        className="shaderPrimaryButton"
                        disabled={!body.trim()}
                    >
                        Comentar
                    </button>
                </div>

                {message && (
                    <p
                        className={
                            error
                                ? "shaderCommentMessage shaderCommentError"
                                : "shaderCommentMessage"
                        }
                        role={error ? "alert" : "status"}
                    >
                        {message}
                    </p>
                )}
            </form>

            {comments.length === 0 ? (
                <div className="shaderCommentsEmpty">
                    <span aria-hidden="true">✧</span>

                    <p>
                        Todavía no hay comentarios.
                        Comparte la primera idea.
                    </p>
                </div>
            ) : (
                <div className="shaderCommentsList">
                    {comments.map(comment => (
                        <article
                            key={comment.id}
                            className="shaderComment"
                        >
                            <div
                                className="shaderCommentAvatar"
                                aria-hidden="true"
                            >
                                {comment.author.slice(0, 1).toUpperCase()}
                            </div>

                            <div className="shaderCommentContent">
                                <header>
                                    <strong>
                                        {comment.author}
                                    </strong>

                                    <time
                                        dateTime={
                                            new Date(
                                                comment.createdAt
                                            ).toISOString()
                                        }
                                    >
                                        {formatDate(comment.createdAt)}
                                    </time>
                                </header>

                                <p>{comment.body}</p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}