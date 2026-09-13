import {
    Link
} from "react-router-dom";

import "./Home.css";

import ModelCard from "../../components/ModelCard/ModelCard";

import {
    mathematicalModels
} from "../../data/mathematicalModels";


function Home() {

    const featuredModels =
        mathematicalModels.slice(
            0,
            4
        );


    return (
        <section className="homePage">

            <section className="homeHero">

                <div className="homeHeroContent">

                    <span className="homeEyebrow">
                        A living atlas of mathematics
                    </span>

                    <h1>
                        Explore mathematics
                        <br />

                        <em>
                            as a living structure
                        </em>
                    </h1>

                    <p>
                        Una comunidad para explorar, visualizar
                        y compartir ideas matemáticas mediante
                        artículos, modelos y experimentos
                        interactivos.
                    </p>


                    <div className="homeHeroActions">

                        <Link
                            to="/explore"
                            className="homePrimaryButton"
                        >
                            Empezar a explorar

                            <span>
                                →
                            </span>
                        </Link>

                        <Link
                            to="/create"
                            className="homeSecondaryButton"
                        >
                            Publicar un modelo
                        </Link>

                    </div>


                    <blockquote>
                        “No solamente fórmulas,
                        <br />
                        sino mundos.”
                    </blockquote>

                </div>


                <div className="homeHeroVisual">

                    <div className="homeVisualGrid" />

                    <div className="homeVisualGlow" />

                    <div className="homeVisualSurface">

                        <div className="surfaceRing surfaceRingOne" />

                        <div className="surfaceRing surfaceRingTwo" />

                        <div className="surfaceRing surfaceRingThree" />

                        <div className="surfaceRing surfaceRingFour" />

                    </div>


                    <div className="homeFormula homeFormulaOne">
                        ℳ(τ)
                    </div>

                    <div className="homeFormula homeFormulaTwo">
                        τ = x + iy
                    </div>

                    <div className="homeFormula homeFormulaThree">
                        mod 10
                    </div>

                    <div className="homeFormula homeFormulaFour">
                        H / SL(2, ℤ)
                    </div>

                </div>

            </section>


            <section className="featuredSection">

                <header className="featuredHeader">

                    <div>

                        <span className="homeEyebrow">
                            Seleccionados por la comunidad
                        </span>

                        <h2>
                            Modelos destacados
                        </h2>

                    </div>


                    <Link to="/explore">

                        Ver todos

                        <span>
                            →
                        </span>

                    </Link>

                </header>


                <div className="featuredModelsGrid">

                    {featuredModels.map(model => (

                        <ModelCard
                            key={model.id}
                            model={model}
                        />

                    ))}

                </div>

            </section>


            <section className="homeManifesto">

                <span className="manifestoNumber">
                    01
                </span>


                <h2>
                    Publica la idea.

                    <em>
                        Deja que otros la toquen.
                    </em>
                </h2>


                <p>
                    Syntaxtral conecta artículos, pruebas,
                    visualizaciones y experimentos computacionales
                    dentro de una misma estructura matemática.
                </p>

            </section>

        </section>
    );
}


export default Home;