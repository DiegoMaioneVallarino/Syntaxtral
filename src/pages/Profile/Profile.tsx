import {
    useSearchParams
} from "react-router-dom";

import "./Profile.css";


type ProfileTab =
    | "projects"
    | "publications"
    | "articles"
    | "saved";


const validTabs:
    ProfileTab[] = [
        "projects",
        "publications",
        "articles",
        "saved"
    ];


const projects = [
    {
        id: "product-table",
        title: "Product table (mod 10)",
        category: "Álgebra",
        color: "#a855f7",
        likes: 342
    },
    {
        id: "modular-curves",
        title: "Modular curve explorer",
        category: "Teoría de números",
        color: "#22d3ee",
        likes: 918
    },
    {
        id: "newton-fractal",
        title: "Newton fractal",
        category: "Análisis complejo",
        color: "#f59e0b",
        likes: 476
    },
    {
        id: "lorenz-attractor",
        title: "Lorenz attractor",
        category: "Sistemas dinámicos",
        color: "#ef476f",
        likes: 389
    }
];


function Profile() {

    const [
        searchParams,
        setSearchParams
    ] = useSearchParams();


    const requestedTab =
        searchParams.get(
            "tab"
        );


    const activeTab:
        ProfileTab =

        requestedTab &&
        validTabs.includes(
            requestedTab as ProfileTab
        )

            ? requestedTab as ProfileTab

            : "projects";


    function selectTab(
        tab: ProfileTab
    ): void {

        setSearchParams(
            tab === "projects"
                ? {}
                : {
                    tab
                }
        );

    }


    return (
        <section className="profilePage">

            <div className="profileCover" />


            <header className="profileHeader">

                <div className="profileMainInformation">

                    <div className="profileLargeAvatar">
                        DM
                    </div>


                    <div className="profileIdentity">

                        <h1>
                            Dmitry Rybalkin
                        </h1>

                        <span>
                            @dmitry
                        </span>

                        <p>
                            Exploring algebraic structures,
                            mathematical visualization and the
                            hidden patterns inside simple rules.
                        </p>

                        <div className="profileMetadata">
                            <span>⌖ Buenos Aires</span>
                            <span>⌁ dmitry.dev</span>
                            <span>◷ Unido en enero de 2024</span>
                        </div>

                    </div>

                </div>


                <div className="profileHeaderRight">

                    <button
                        type="button"
                        className="profileEditButton"
                    >
                        Editar perfil
                    </button>


                    <div className="profileStatistics">

                        <div>
                            <strong>42</strong>
                            <span>Proyectos</span>
                        </div>

                        <div>
                            <strong>17</strong>
                            <span>Publicaciones</span>
                        </div>

                        <div>
                            <strong>2.3K</strong>
                            <span>Seguidores</span>
                        </div>

                        <div>
                            <strong>186</strong>
                            <span>Siguiendo</span>
                        </div>

                    </div>

                </div>

            </header>


            <nav className="profileTabs">

                <button
                    type="button"
                    className={
                        activeTab === "projects"
                            ? "profileTabActive"
                            : ""
                    }
                    onClick={() =>
                        selectTab(
                            "projects"
                        )
                    }
                >
                    Proyectos
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "publications"
                            ? "profileTabActive"
                            : ""
                    }
                    onClick={() =>
                        selectTab(
                            "publications"
                        )
                    }
                >
                    Publicaciones
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "articles"
                            ? "profileTabActive"
                            : ""
                    }
                    onClick={() =>
                        selectTab(
                            "articles"
                        )
                    }
                >
                    Artículos
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "saved"
                            ? "profileTabActive"
                            : ""
                    }
                    onClick={() =>
                        selectTab(
                            "saved"
                        )
                    }
                >
                    Guardados
                </button>

            </nav>


            <div className="profileContent">

                {activeTab === "projects" && (

                    <div className="profileProjectGrid">

                        {projects.map(project => (

                            <article
                                key={project.id}
                                className="profileProjectCard"
                            >

                                <div
                                    className="profileProjectPreview"
                                    style={{
                                        background: `
                                            radial-gradient(
                                                circle at 50% 45%,
                                                ${project.color}99,
                                                ${project.color}22 35%,
                                                #08090d 72%
                                            )
                                        `
                                    }}
                                >
                                    <span>
                                        ƒ
                                    </span>
                                </div>


                                <div className="profileProjectDetails">

                                    <strong>
                                        {project.title}
                                    </strong>

                                    <span>
                                        {project.category}
                                    </span>

                                    <small>
                                        ♡ {project.likes}
                                    </small>

                                </div>

                            </article>

                        ))}

                    </div>

                )}


                {activeTab !== "projects" && (

                    <div className="profileEmptySection">

                        <span>∑</span>

                        <h2>
                            {activeTab}
                        </h2>

                        <p>
                            Esta sección quedará conectada con
                            el contenido real del usuario.
                        </p>

                    </div>

                )}

            </div>

        </section>
    );

}


export default Profile;