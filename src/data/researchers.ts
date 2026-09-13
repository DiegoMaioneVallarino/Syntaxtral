import type {
    Researcher
} from "../models/Researcher";


export const researchers: Researcher[] = [

    {
        id: "dmitry-rybalkin",

        name: "Dmitry Rybalkin",
        username: "@dmitry",

        location: "Buenos Aires",

        biography:
            `
                Explora estructuras algebraicas,
                visualización y patrones ocultos
                dentro de reglas aparentemente simples.
            `,

        primaryField: "algebra",
        fieldLabel: "Álgebra",

        specialties: [
            "Finite structures",
            "Modular arithmetic"
        ],

        projects: 42,
        publications: 17,
        followers: 2300,

        featured: true
    },

    {
        id: "elena-ruiz",

        name: "Elena Ruiz",
        username: "@elena",

        location: "Madrid",

        biography:
            `
                Investiga curvas modulares,
                teoría de números y métodos
                geométricos de visualización.
            `,

        primaryField: "number-theory",
        fieldLabel: "Teoría de números",

        specialties: [
            "Modular curves",
            "Geometry"
        ],

        projects: 31,
        publications: 22,
        followers: 1800,

        featured: false
    },

    {
        id: "kai-nakamura",

        name: "Kai Nakamura",
        username: "@kai",

        location: "Tokyo",

        biography:
            `
                Trabaja con análisis complejo,
                la función zeta de Riemann
                y estructuras computacionales.
            `,

        primaryField: "analysis",
        fieldLabel: "Análisis",

        specialties: [
            "Riemann zeta",
            "Complex analysis"
        ],

        projects: 27,
        publications: 19,
        followers: 3200,

        featured: false
    },

    {
        id: "amara-chen",

        name: "Amara Chen",
        username: "@amara",

        location: "Singapore",

        biography:
            `
                Estudia topología computacional,
                teoría de nudos y representación
                geométrica de invariantes.
            `,

        primaryField: "topology",
        fieldLabel: "Topología",

        specialties: [
            "Knot theory",
            "Invariants"
        ],

        projects: 38,
        publications: 14,
        followers: 1700,

        featured: false
    },

    {
        id: "sofia-laurent",

        name: "Sofia Laurent",
        username: "@sofia",

        location: "Paris",

        biography:
            `
                Construye visualizaciones de
                superficies, variedades y
                transformaciones geométricas.
            `,

        primaryField: "geometry",
        fieldLabel: "Geometría",

        specialties: [
            "Surfaces",
            "Manifolds"
        ],

        projects: 46,
        publications: 11,
        followers: 2900,

        featured: false
    },

    {
        id: "noor-haddad",

        name: "Noor Haddad",
        username: "@noor",

        location: "Beirut",

        biography:
            `
                Explora sistemas dinámicos,
                caos determinista y modelos
                matemáticos emergentes.
            `,

        primaryField: "dynamics",
        fieldLabel: "Dinámica",

        specialties: [
            "Chaos theory",
            "Attractors"
        ],

        projects: 34,
        publications: 16,
        followers: 2100,

        featured: false
    }

];