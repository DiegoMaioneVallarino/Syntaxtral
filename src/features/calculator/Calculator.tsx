import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    exampleExpression,
    expressionToJSON,
    expressionToMathJs,
    expressionToPlainText,
    validateExpression
} from "../../syntaxtral/expression/core";

import {
    compile
} from "mathjs";

import "./Calculator.css";

import GraphCanvas from "../../components/GraphCanvas/GraphCanvas";

import type {
    GraphExpression
} from "./models/GraphExpression";


const expressionColors = [

    "#a855f7",
    "#22d3ee",
    "#f59e0b",
    "#ef476f",
    "#84cc16",
    "#f472b6"

];


const initialExpressions: GraphExpression[] = [

    {
        id: crypto.randomUUID(),

        expression:
            "sin(x)",

        color:
            expressionColors[0],

        visible:
            true
    },

    {
        id: crypto.randomUUID(),

        expression:
            "x^2 / 5",

        color:
            expressionColors[1],

        visible:
            true
    }

];


function Calculator() {

    const [
        expressions,
        setExpressions
    ] = useState<GraphExpression[]>(
        initialExpressions
    );


    const expressionErrors = useMemo(() => {

        const errors =
            new Map<string, string>();


        for (
            const graphExpression
            of expressions
        ) {

            try {

                const normalized =
                    graphExpression.expression.includes("=")

                        ? graphExpression.expression.split("=")[1]

                        : graphExpression.expression;


                compile(
                    normalized
                );

            } catch {

                errors.set(
                    graphExpression.id,
                    "Expresión inválida"
                );

            }

        }
useEffect(() => {

    console.group(
        "Syntaxtral Expression Core v0.1"
    );


    console.log(
        "Texto:",
        expressionToPlainText(
            exampleExpression
        )
    );


    console.log(
        "MathJS:",
        expressionToMathJs(
            exampleExpression
        )
    );


    console.log(
        "Validación:",
        validateExpression(
            exampleExpression
        )
    );


    console.log(
        "JSON:",
        expressionToJSON(
            exampleExpression
        )
    );


    console.groupEnd();

}, []);

        return errors;

    }, [
        expressions
    ]);


    function addExpression() {

        const color =

            expressionColors[
                expressions.length %
                expressionColors.length
            ];


        setExpressions(previous => [

            ...previous,

            {
                id:
                    crypto.randomUUID(),

                expression:
                    "",

                color,

                visible:
                    true
            }

        ]);

    }


    function updateExpression(
        expressionId: string,
        value: string
    ) {

        setExpressions(previous =>

            previous.map(expression => {

                if (
                    expression.id !==
                    expressionId
                ) {
                    return expression;
                }


                return {

                    ...expression,

                    expression:
                        value

                };

            })

        );

    }


    function toggleExpression(
        expressionId: string
    ) {

        setExpressions(previous =>

            previous.map(expression => {

                if (
                    expression.id !==
                    expressionId
                ) {
                    return expression;
                }


                return {

                    ...expression,

                    visible:
                        !expression.visible

                };

            })

        );

    }


    function removeExpression(
        expressionId: string
    ) {

        setExpressions(previous =>

            previous.filter(expression => (
                expression.id !==
                expressionId
            ))

        );

    }


    return (
        <section className="calculatorPage">

            <aside className="calculatorPanel">

                <header className="calculatorPanelHeader">

                    <div>

                        <span>
                            Syntaxtral
                        </span>

                        <h1>
                            Calculator
                        </h1>

                    </div>


                    <button
                        type="button"
                        className="calculatorMenuButton"
                        aria-label="Opciones de la calculadora"
                    >
                        •••
                    </button>

                </header>


                <div className="calculatorExpressionList">

                    {expressions.map((
                        graphExpression,
                        index
                    ) => (

                        <article
                            key={graphExpression.id}
                            className={
                                graphExpression.visible
                                    ? "calculatorExpression"
                                    : "calculatorExpression expressionHidden"
                            }
                        >

                            <div className="expressionNumber">

                                {index + 1}

                            </div>


                            <button
                                type="button"
                                className="expressionColorButton"
                                style={{
                                    backgroundColor:
                                        graphExpression.color
                                }}
                                onClick={() => {
                                    toggleExpression(
                                        graphExpression.id
                                    );
                                }}
                                aria-label="Mostrar u ocultar expresión"
                            />


                            <div className="expressionInputArea">

                                <span>
                                    y =
                                </span>

                                <input
                                    type="text"
                                    value={
                                        graphExpression.expression
                                    }
                                    placeholder="Escribe una función..."
                                    onChange={event => {
                                        updateExpression(
                                            graphExpression.id,
                                            event.target.value
                                        );
                                    }}
                                />


                                {expressionErrors.has(
                                    graphExpression.id
                                ) && (

                                    <small>
                                        {
                                            expressionErrors.get(
                                                graphExpression.id
                                            )
                                        }
                                    </small>

                                )}

                            </div>


                            <button
                                type="button"
                                className="removeExpressionButton"
                                onClick={() => {
                                    removeExpression(
                                        graphExpression.id
                                    );
                                }}
                                aria-label="Eliminar expresión"
                            >
                                ×
                            </button>

                        </article>

                    ))}

                </div>


                <button
                    type="button"
                    className="addExpressionButton"
                    onClick={addExpression}
                >
                    <span>
                        +
                    </span>

                    Añadir expresión
                </button>


                <div className="calculatorHelp">

                    <span>
                        Ejemplos
                    </span>

                    <code>
                        sin(x)
                    </code>

                    <code>
                        x^2
                    </code>

                    <code>
                        sqrt(abs(x))
                    </code>

                    <code>
                        1 / x
                    </code>

                </div>


                <footer className="calculatorPanelFooter">

                    Rueda para acercar · Arrastra para mover

                </footer>

            </aside>


            <div className="calculatorWorkspace">

                <GraphCanvas
                    expressions={expressions}
                />

            </div>

        </section>
    );
}


export default Calculator;