import {
    useMemo,
    useState
} from "react";

import "./Community.css";

import ResearcherCard from "../../components/ResearcherCard/ResearcherCard";

import {
    researchers
} from "../../data/researchers";

import type {
    ResearchField
} from "../../models/Researcher";


type FieldFilter =
    | "all"
    | ResearchField;


type FieldOption = {

    value: FieldFilter;
    label: string;

};


const fieldOptions: FieldOption[] = [

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


function Community() {

    const [
        searchValue,
        setSearchValue
    ] = useState("");


    const [
        selectedField,
        setSelectedField
    ] = useState<FieldFilter>("all");


    const [
        followedResearchers,
        setFollowedResearchers
    ] = useState<Set<string>>(
        new Set()
    );


    const filteredResearchers = useMemo(() => {

        const normalizedSearch =
            searchValue
                .trim()
                .toLowerCase();


        return researchers.filter(researcher => {

            const matchesField =

                selectedField === "all" ||

                researcher.primaryField === selectedField;


            const searchableText = `

                ${researcher.name}

                ${researcher.username}

                ${researcher.location}

                ${researcher.fieldLabel}

                ${researcher.specialties.join(" ")}

            `.toLowerCase();


            const matchesSearch =

                normalizedSearch.length === 0 ||

                searchableText.includes(
                    normalizedSearch
                );


            return (
                matchesField &&
                matchesSearch
            );

        });

    }, [
        searchValue,
        selectedField
    ]);


    function toggleFollow(
        researcherId: string
    ) {

        setFollowedResearchers(
            previousResearchers => {

                const nextResearchers =
                    new Set(
                        previousResearchers
                    );


                if (
                    nextResearchers.has(
                        researcherId
                    )
                ) {

                    nextResearchers.delete(
                        researcherId
                    );

                } else {

                    nextResearchers.add(
                        researcherId
                    );

                }


                return nextResearchers;

            }
        );

    }


    const featuredResearcher =
        researchers.find(
            researcher => researcher.featured
        );


    return (
        <section className="communityPage">

            <header className="communityHeader">

                <div>

                    <span className="communityEyebrow">
                        La red matemática
                    </span>

                    <h1>
                        Comunidad
                    </h1>

                    <p>
                        Encuentra investigadores, creadores
                        y exploradores construyendo nuevas
                        formas de comprender las matemáticas.
                    </p>

                </div>


                <label className="communitySearch">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="search"
                        value={searchValue}
                        placeholder="Buscar matemáticos o especialidades..."
                        onChange={event => {
                            setSearchValue(
                                event.target.value
                            );
                        }}
                    />

                </label>

            </header>


            {featuredResearcher && (
                <section className="featuredResearcher">

                    <div className="featuredResearcherVisual">

                        <div className="featuredResearcherGrid" />

                        <div className="featuredResearcherShape">

                            <div />

                            <div />

                            <div />

                        </div>

                    </div>


                    <div className="featuredResearcherContent">

                        <span className="communityEyebrow">
                            Investigador destacado
                        </span>

                        <h2>
                            {featuredResearcher.name}
                        </h2>

                        <span className="featuredUsername">

                            {featuredResearcher.username}

                        </span>

                        <p>
                            {featuredResearcher.biography}
                        </p>


                        <div className="featuredSpecialties">

                            {featuredResearcher.specialties.map(
                                specialty => (

                                    <span key={specialty}>
                                        {specialty}
                                    </span>

                                )
                            )}

                        </div>

                    </div>


                    <div className="featuredResearcherActions">

                        <button
                            type="button"
                            className={
                                followedResearchers.has(
                                    featuredResearcher.id
                                )
                                    ? "featuredFollowButton featuredFollowButtonActive"
                                    : "featuredFollowButton"
                            }
                            onClick={() => {
                                toggleFollow(
                                    featuredResearcher.id
                                );
                            }}
                        >
                            {followedResearchers.has(
                                featuredResearcher.id
                            )
                                ? "Siguiendo"
                                : "Seguir"
                            }
                        </button>

                        <button
                            type="button"
                            className="viewProfileButton"
                        >
                            Ver perfil
                        </button>

                    </div>

                </section>
            )}


            <div className="communityFilters">

                {fieldOptions.map(option => (

                    <button
                        type="button"
                        key={option.value}
                        className={
                            selectedField === option.value
                                ? "communityFilter communityFilterActive"
                                : "communityFilter"
                        }
                        onClick={() => {
                            setSelectedField(
                                option.value
                            );
                        }}
                    >
                        {option.label}
                    </button>

                ))}

            </div>


            <div className="communityResults">

                <span>
                    {filteredResearchers.length}
                    {" "}
                    investigadores
                </span>

                <span>
                    Ordenados por actividad
                </span>

            </div>


            {filteredResearchers.length > 0 ? (

                <div className="communityGrid">

                    {filteredResearchers.map(
                        researcher => (

                            <ResearcherCard
                                key={researcher.id}
                                researcher={researcher}
                                isFollowing={
                                    followedResearchers.has(
                                        researcher.id
                                    )
                                }
                                onToggleFollow={
                                    toggleFollow
                                }
                            />

                        )
                    )}

                </div>

            ) : (

                <div className="communityEmpty">

                    <span>
                        ∅
                    </span>

                    <h2>
                        No encontramos investigadores
                    </h2>

                    <p>
                        Prueba buscando otra especialidad.
                    </p>

                </div>

            )}

        </section>
    );
}


export default Community;