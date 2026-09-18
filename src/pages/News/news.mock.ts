export type NewsCategory =
    | "Matemáticas"
    | "Ciencia"
    | "Tecnología"
    | "Comunidad";

export type NewsArticle = {
    id: string;
    title: string;
    summary: string;
    category: NewsCategory;
    author: string;
    publishedAt: string;
    readingMinutes: number;
    symbol: string;
    accent: string;
    featured: boolean;
    paragraphs: string[];
};

export const newsCategories: NewsCategory[] = [
    "Matemáticas",
    "Ciencia",
    "Tecnología",
    "Comunidad"
];

export const mockNews: NewsArticle[] = [
    {
        id: "geometry-lab",
        title: "Un laboratorio para explorar las matemáticas con los ojos",
        summary:
            "Imagina un espacio donde una ecuación se convierte en una " +
            "superficie que puedes recorrer, modificar y compartir.",
        category: "Matemáticas",
        author: "Redacción de demostración",
        publishedAt: "2026-09-18T12:00:00Z",
        readingMinutes: 3,
        symbol: "∑",
        accent: "#af83ff",
        featured: true,
        paragraphs: [
            "Esta publicación es un ejemplo ficticio para mostrar el portal " +
            "de noticias de Syntaxtral. No anuncia un lanzamiento real.",

            "El laboratorio imaginado reúne curvas, superficies y controles " +
            "interactivos en una misma interfaz. Cambiar un parámetro permite " +
            "observar cómo se modifica la geometría de una expresión.",

            "La propuesta editorial consiste en acompañar cada explicación " +
            "con un experimento reproducible: una pregunta inicial, una " +
            "construcción y varias maneras de explorar sus resultados.",

            "En una futura versión, este espacio podría conectar las noticias " +
            "con proyectos públicos creados por la comunidad."
        ]
    },
    {
        id: "patterns",
        title: "Del movimiento a los patrones: una historia visual",
        summary:
            "Una propuesta de divulgación para explorar cómo reglas " +
            "sencillas pueden producir comportamientos complejos.",
        category: "Ciencia",
        author: "Redacción de demostración",
        publishedAt: "2026-09-18T10:00:00Z",
        readingMinutes: 2,
        symbol: "∞",
        accent: "#75d9c0",
        featured: false,
        paragraphs: [
            "Este artículo ficticio presenta una posible sección de " +
            "divulgación científica del portal.",

            "La experiencia propuesta comienza con partículas que siguen " +
            "unas pocas reglas de movimiento. El lector puede modificar " +
            "esas reglas y comparar los patrones resultantes.",

            "Cada visualización estaría acompañada por una explicación de " +
            "sus supuestos. Observar un patrón sugerente sería el comienzo " +
            "de una investigación, no una demostración de su validez."
        ]
    },
    {
        id: "graphics",
        title: "Cuando una fórmula se convierte en una imagen",
        summary:
            "Un recorrido editorial por las herramientas que conectan " +
            "programación, geometría y representación visual.",
        category: "Tecnología",
        author: "Redacción de demostración",
        publishedAt: "2026-09-17T18:00:00Z",
        readingMinutes: 3,
        symbol: "⌘",
        accent: "#79b8ff",
        featured: false,
        paragraphs: [
            "Esta pieza de demostración imagina una serie dedicada a la " +
            "programación de gráficos matemáticos.",

            "Un primer capítulo podría mostrar cómo muestrear una curva. " +
            "Después se introducirían superficies, materiales e iluminación, " +
            "manteniendo visible la relación entre la fórmula y su imagen.",

            "Los ejemplos incluirían también las limitaciones del dibujo: " +
            "una resolución insuficiente puede ocultar detalles o representar " +
            "de forma incorrecta una discontinuidad."
        ]
    },
    {
        id: "community-challenge",
        title: "Un reto imaginario: una ecuación, muchas interpretaciones",
        summary:
            "Así podría verse una convocatoria para compartir " +
            "experimentos y discutir distintas soluciones.",
        category: "Comunidad",
        author: "Redacción de demostración",
        publishedAt: "2026-09-17T15:00:00Z",
        readingMinutes: 2,
        symbol: "↗",
        accent: "#ffc780",
        featured: false,
        paragraphs: [
            "Esta convocatoria es ficticia y forma parte de la maqueta. " +
            "No hay inscripciones ni fechas de participación reales.",

            "El formato propuesto invita a explorar una misma expresión " +
            "desde perspectivas diferentes: una interpretación geométrica, " +
            "una simulación o una explicación para principiantes.",

            "El objetivo sería compartir el proceso además del resultado, " +
            "incluyendo intentos fallidos y preguntas todavía abiertas."
        ]
    },
    {
        id: "surfaces",
        title: "Tres maneras de describir una superficie",
        summary:
            "Explícitas, implícitas y paramétricas: distintas " +
            "perspectivas sobre un mismo objeto geométrico.",
        category: "Matemáticas",
        author: "Redacción de demostración",
        publishedAt: "2026-09-16T16:00:00Z",
        readingMinutes: 4,
        symbol: "∂",
        accent: "#f29bcc",
        featured: false,
        paragraphs: [
            "Este texto de ejemplo ilustra el formato de un artículo " +
            "explicativo dentro del portal.",

            "Una representación explícita expresa una coordenada como " +
            "función de las otras dos. Una representación implícita establece " +
            "una condición que deben cumplir los puntos de la superficie.",

            "Una representación paramétrica describe las coordenadas " +
            "mediante parámetros. Cada enfoque facilita ciertas operaciones " +
            "y presenta sus propias limitaciones.",

            "Una futura publicación podría incluir modelos interactivos " +
            "para comparar estas representaciones."
        ]
    },
    {
        id: "reading-group",
        title: "Aprender juntos: el formato de un círculo de lectura",
        summary:
            "Una idea para conectar estudiantes, docentes y aficionados " +
            "alrededor de un tema compartido.",
        category: "Comunidad",
        author: "Redacción de demostración",
        publishedAt: "2026-09-16T10:00:00Z",
        readingMinutes: 2,
        symbol: "π",
        accent: "#b5ce85",
        featured: false,
        paragraphs: [
            "Este ejemplo no corresponde a un evento real. Presenta una " +
            "posible actividad para la comunidad de Syntaxtral.",

            "Cada encuentro podría partir de un texto breve y una lista " +
            "de preguntas. Los participantes compartirían sus interpretaciones " +
            "y construirían ejemplos para aclarar los conceptos.",

            "Las notas finales permitirían a otras personas retomar la " +
            "conversación y proponer nuevas líneas de estudio."
        ]
    }
];