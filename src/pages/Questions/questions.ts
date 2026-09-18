export type QuestionAnswer = {
    id: string;
    author: string;
    body: string;
    accepted: boolean;
};

export type Question = {
    id: string;
    title: string;
    body: string;
    author: string;
    tags: string[];
    votes: number;
    createdAt: number;
    answers: QuestionAnswer[];
};

export const mockQuestions: Question[] = [
    {
        id: "polar-rose",
        title: "¿Por qué algunas rosas polares tienen el doble de pétalos?",
        body:
            "Estoy explorando r = cos(nθ). Para n = 3 aparecen tres " +
            "pétalos, pero para n = 4 aparecen ocho. ¿Cómo se explica " +
            "esta diferencia y qué papel juegan los radios negativos?",
        author: "Lucía Moreno",
        tags: ["Geometría", "Coordenadas polares"],
        votes: 24,
        createdAt: Date.parse("2026-09-18T09:00:00Z"),
        answers: [
            {
                id: "polar-answer",
                author: "Mateo Ruiz",
                body:
                    "Un radio negativo sitúa el punto en la dirección " +
                    "opuesta al ángulo indicado. Si n es impar, los puntos " +
                    "obtenidos al avanzar θ en π coinciden con puntos ya " +
                    "recorridos. Si n es par, ese recorrido añade los " +
                    "pétalos opuestos. Para n entero positivo, esto da " +
                    "n pétalos cuando n es impar y 2n cuando es par.",
                accepted: true
            }
        ]
    },
    {
        id: "torus",
        title: "¿Cómo elegir los dos radios de un toro paramétrico?",
        body:
            "Quiero construir un toro con dos parámetros. Entiendo que " +
            "uno recorre el anillo y otro la sección circular, pero no " +
            "tengo claro cuándo se cierra el agujero central.",
        author: "Sofía Vega",
        tags: ["Geometría", "Superficies"],
        votes: 18,
        createdAt: Date.parse("2026-09-18T08:00:00Z"),
        answers: [
            {
                id: "torus-answer",
                author: "Nicolás Pérez",
                body:
                    "Llama R a la distancia desde el eje hasta el centro " +
                    "de la sección circular y r al radio de esa sección. " +
                    "Con R > r > 0 tienes el toro habitual con agujero. " +
                    "Cuando R = r, la superficie alcanza el eje y el " +
                    "agujero se cierra.",
                accepted: false
            }
        ]
    },
    {
        id: "fourier",
        title: "¿Por dónde empezar para entender las series de Fourier?",
        body:
            "Conozco derivadas e integrales y me gustaría entender " +
            "cómo una suma de senos y cosenos puede representar otras " +
            "funciones. Busco una explicación geométrica para comenzar.",
        author: "Daniel Torres",
        tags: ["Análisis", "Fourier"],
        votes: 12,
        createdAt: Date.parse("2026-09-17T16:00:00Z"),
        answers: []
    },
    {
        id: "implicit",
        title: "¿Toda superficie implícita puede escribirse como z = f(x,y)?",
        body:
            "Una esfera tiene una ecuación implícita sencilla, pero al " +
            "despejar z obtengo dos expresiones. ¿Es una limitación de " +
            "la representación explícita?",
        author: "Elena Castro",
        tags: ["Análisis", "Superficies"],
        votes: 31,
        createdAt: Date.parse("2026-09-17T12:00:00Z"),
        answers: [
            {
                id: "implicit-answer",
                author: "Andrés Molina",
                body:
                    "Sí. Una función z = f(x,y) asigna una sola altura " +
                    "a cada par (x,y). En una esfera, muchos pares tienen " +
                    "dos alturas. Puedes representar los hemisferios " +
                    "por separado, pero no toda la esfera como una única " +
                    "función de esa forma.",
                accepted: true
            }
        ]
    }
];