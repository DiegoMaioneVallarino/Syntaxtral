import {
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import ShaderCanvas from "./ShaderCanvas";

import {
    exampleShaders,
    readSavedShaders
} from "./shaderStore";

import "./Shaders.css";

export default function Shaders() {
    const [savedShaders] = useState(readSavedShaders);

    const projects = [
        ...savedShaders,
        ...exampleShaders
    ];

    return (
        <section className="shadersPage">
            <header className="shadersHeader">
                <div>
                    <span className="shadersEyebrow">
                        SYNTAXTRAL LAB
                    </span>

                    <h1>Matemáticas hechas luz.</h1>

                    <p>
                        Explora, modifica y construye imágenes
                        mediante código.
                    </p>
                </div>

                <Link
                    to="/shaders/new"
                    className="shaderPrimaryButton"
                >
                    + Nuevo shader
                </Link>
            </header>

            <div className="shadersGalleryHeading">
                <h2>Explora los shaders</h2>

                <span>
                    {projects.length} experimentos
                </span>
            </div>

            <div className="shadersGrid">
                {projects.map(project => (
                    <Link
                        key={project.id}
                        to={`/shaders/${project.id}`}
                        className="shaderCard"
                    >
                        <div className="shaderThumbnail">
                            <ShaderCanvas
                                code={project.code}
                                preview
                            />
                        </div>

                        <div className="shaderCardInfo">
                            <div>
                                <small>
                                    {project.id.startsWith("example-")
                                        ? "EJEMPLO"
                                        : "GUARDADO EN ESTE NAVEGADOR"}
                                </small>

                                <h3>{project.title}</h3>
                            </div>

                            <span aria-hidden="true">
                                ↗
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}