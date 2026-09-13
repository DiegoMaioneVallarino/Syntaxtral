import type {
    MathematicalModel
} from "../models/MathematicalModel";


export const mathematicalModels: MathematicalModel[] = [

    {
        id: "maione-number-path",

        title: "Maione number path",
        author: "Elena Ruiz",

        category: "number-theory",
        categoryLabel: "Number theory",

        topics: [
            "Dynamics",
            "Modular arithmetic"
        ],

        likes: 521,
        forks: 102,

        imagePath:
            "/models/maione-number-path.png"
    },

    {
        id: "riemann-zeta-function",

        title: "Riemann zeta function",
        author: "Kai Nakamura",

        category: "analysis",
        categoryLabel: "Complex analysis",

        topics: [
            "Analytic number theory"
        ],

        likes: 1200,
        forks: 276,

        imagePath:
            "/models/riemann-zeta.png"
    },

    {
        id: "product-table-mod-10",

        title: "Product table (mod 10)",
        author: "Dmitry Rybalkin",

        category: "algebra",
        categoryLabel: "Algebra",

        topics: [
            "Finite structures"
        ],

        likes: 342,
        forks: 87,

        imagePath:
            "/models/product-table.png"
    },

    {
        id: "trefoil-knot",

        title: "Trefoil knot",
        author: "Amara Chen",

        category: "topology",
        categoryLabel: "Topology",

        topics: [
            "Knot theory"
        ],

        likes: 698,
        forks: 134,

        imagePath:
            "/models/trefoil-knot.png"
    },

    {
        id: "lorenz-attractor",

        title: "Lorenz attractor",
        author: "Noor Haddad",

        category: "dynamics",
        categoryLabel: "Dynamics",

        topics: [
            "Chaos theory"
        ],

        likes: 389,
        forks: 64,

        imagePath:
            "/models/lorenz-attractor.png"
    },

    {
        id: "modular-surface",

        title: "Modular surface",
        author: "Sofia Laurent",

        category: "geometry",
        categoryLabel: "Geometry",

        topics: [
            "Modular forms"
        ],

        likes: 918,
        forks: 221,

        imagePath:
            "/models/modular-surface.png"
    }

];