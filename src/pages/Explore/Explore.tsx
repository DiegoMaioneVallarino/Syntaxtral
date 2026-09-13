import {
    useMemo,
    useState
} from "react";

import "./Explore.css";

import ModelCard from "../../components/ModelCard/ModelCard";

import {
    mathematicalModels
} from "../../data/mathematicalModels";

import type {
    MathematicalCategory
} from "../../models/MathematicalModel";


type CategoryFilter =
    | "all"
    | MathematicalCategory;


type CategoryOption = {

    value: CategoryFilter;
    label: string;

};


const categoryOptions: CategoryOption[] = [

    {
        value: "all",
        label: "Todos"
    },

    {
        value: "number-theory",
        label: "Teoría de números"
    },

    {
        value: "geometry",
        label: "Geometría"
    },

    {
        value: "topology",
        label: "Topología"
    },

    {
        value: "analysis",
        label: "Análisis"
    },

    {
        value: "dynamics",
        label: "Dinámica"
    },

    {
        value: "algebra",
        label: "Álgebra"
    }

];


function Explore() {

    const [
        selectedCategory,
        setSelectedCategory
    ] = useState<CategoryFilter>("all");


    const [
        searchValue,
        setSearchValue
    ] = useState("");


    const filteredModels = useMemo(() => {

        const normalizedSearch =
            searchValue
                .trim()
                .toLowerCase();


        return mathematicalModels.filter(model => {

            const matchesCategory =

                selectedCategory === "all" ||

                model.category === selectedCategory;


            const searchableText = `

                ${model.title}

                ${model.author}

                ${model.categoryLabel}

                ${model.topics.join(" ")}

            `.toLowerCase();


            const matchesSearch =

                normalizedSearch.length === 0 ||

                searchableText.includes(
                    normalizedSearch
                );


            return (
                matchesCategory &&
                matchesSearch
            );

        });

    }, [
        selectedCategory,
        searchValue
    ]);


    return (
        <section className="explorePage">

            <header className="exploreHeader">

                <div>

                    <span className="exploreEyebrow">
                        Laboratorio público
                    </span>

                    <h1>
                        Explora
                    </h1>

                    <p>
                        Modelos, experimentos y estructuras
                        creadas por matemáticos de todo el mundo.
                    </p>

                </div>


                <label className="exploreSearch">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="search"
                        value={searchValue}
                        placeholder="Buscar modelos o autores..."
                        onChange={event => {
                            setSearchValue(
                                event.target.value
                            );
                        }}
                    />

                </label>

            </header>


            <div className="exploreFilters">

                {categoryOptions.map(option => (

                    <button
                        type="button"
                        key={option.value}
                        className={
                            selectedCategory === option.value
                                ? "exploreFilter exploreFilterActive"
                                : "exploreFilter"
                        }
                        onClick={() => {
                            setSelectedCategory(
                                option.value
                            );
                        }}
                    >
                        {option.label}
                    </button>

                ))}


                <button
                    type="button"
                    className="exploreSortButton"
                >
                    Ordenar

                    <span>
                        ↓
                    </span>
                </button>

            </div>


            <div className="exploreResultsHeader">

                <span>
                    {filteredModels.length}
                    {" "}
                    estructuras
                </span>

                <span>
                    Actualizado recientemente
                </span>

            </div>


            {filteredModels.length > 0 ? (

                <div className="exploreGrid">

                    {filteredModels.map(model => (

                        <ModelCard
                            key={model.id}
                            model={model}
                        />

                    ))}

                </div>

            ) : (

                <div className="exploreEmpty">

                    <span className="exploreEmptySymbol">
                        ∅
                    </span>

                    <h2>
                        No encontramos estructuras
                    </h2>

                    <p>
                        Prueba con otra categoría
                        o con una búsqueda más amplia.
                    </p>

                </div>

            )}

        </section>
    );
}


export default Explore;