import {
    useMemo,
    useState
} from "react";

import {
    additionNode,
    constantNode,
    exampleExpression,
    ExpressionKeyboard,
    ExpressionRenderer,
    expressionToMathJs,
    factorialNode,
    findExpressionNodeById,
    fractionNode,
    functionCallNode,
    groupNode,
    multiplicationNode,
    negationNode,
    numberNode,
    placeholderNode,
    powerNode,
    replaceExpressionNodeById,
    symbolNode
} from "../../syntaxtral/expression";

import type {
    ExpressionKeyboardAction,
    ExpressionNode
} from "../../syntaxtral/expression";

import {
    compile
} from "mathjs";

import "./Calculator.css";

import GraphCanvas from "../../components/GraphCanvas/GraphCanvas";
import Graph3DCanvas from "../../components/Graph3DCanvas/Graph3DCanvas";
import type {
    GraphExpression
} from "./models/GraphExpression";

type GraphMode =
    | "2d"
    | "3d";
const expressionColors = [
    "#22d3ee",
    "#f59e0b",
    "#ef476f",
    "#84cc16",
    "#f472b6"
];


const initialExpressions: GraphExpression[] = [
    {
        id: crypto.randomUUID(),
        expression: "sin(x)",
        color: expressionColors[0],
        visible: true
    },
    {
        id: crypto.randomUUID(),
        expression: "x^2 / 5",
        color: expressionColors[1],
        visible: true
    }
];


function Calculator() {
    const [
        expressions,
        setExpressions
    ] = useState<GraphExpression[]>(
        initialExpressions
    );


    const [
        editableExpression,
        setEditableExpression
    ] = useState<ExpressionNode>(
        exampleExpression
    );


    const [
        selectedExpressionNodeId,
        setSelectedExpressionNodeId
    ] = useState<string | null>(
        exampleExpression.id
    );

    const [
    keyboardOpen,
    setKeyboardOpen
] = useState(false);
const [
    graphMode,
    setGraphMode
] = useState<GraphMode>(
    "2d"
);
    const editableMathJs =
        useMemo(() => {

            try {

                return expressionToMathJs(
                    editableExpression
                );

            } catch {

                return null;

            }

        }, [editableExpression]);


    const canvasExpressions =
        useMemo<GraphExpression[]>(() => {

            const structuralExpression:
                GraphExpression = {

                id:
                    "syntaxtral-structural-expression",

                expression:
                    editableMathJs ?? "",

                color:
                    "#a855f7",

                visible:
                    editableMathJs !== null

            };


            return [
                structuralExpression,
                ...expressions
            ];

        }, [
            editableMathJs,
            expressions
        ]);


    const expressionErrors =
        useMemo(() => {

            const errors =
                new Map<string, string>();


            for (
                const graphExpression
                of expressions
            ) {

                try {

                    const equalsPosition =
                        graphExpression.expression
                            .indexOf("=");


                    const normalized =
                        equalsPosition >= 0
                            ? graphExpression.expression.slice(
                                equalsPosition + 1
                            )
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


            return errors;

        }, [expressions]);


    function replaceSelectedNode(
        replacement: ExpressionNode,
        nextSelectedNodeId:
            string = replacement.id
    ): void {

        if (!selectedExpressionNodeId) {
            return;
        }


        setEditableExpression(
            previousExpression =>
                replaceExpressionNodeById(

                    previousExpression,
                    selectedExpressionNodeId,
                    replacement

                )
        );


        setSelectedExpressionNodeId(
            nextSelectedNodeId
        );

    }


    function getSelectedNode():
        ExpressionNode | null {

        if (!selectedExpressionNodeId) {
            return null;
        }


        return findExpressionNodeById(

            editableExpression,
            selectedExpressionNodeId

        );

    }


    function handleKeyboardAction(
        action: ExpressionKeyboardAction
    ): void {

        const selectedNode =
            getSelectedNode();


        if (!selectedNode) {
            return;
        }


        switch (action.type) {

            case "digit": {

                const value =
                    selectedNode.type === "number"

                        ? selectedNode.value === "0"
                            ? action.value
                            : selectedNode.value +
                                action.value

                        : action.value;


                replaceSelectedNode(
                    numberNode(value)
                );

                return;

            }


            case "decimal": {

                const value =
                    selectedNode.type === "number"

                        ? selectedNode.value.includes(".")
                            ? selectedNode.value
                            : `${selectedNode.value}.`

                        : "0.";


                replaceSelectedNode(
                    numberNode(value)
                );

                return;

            }


            case "symbol":

                replaceSelectedNode(
                    symbolNode(
                        action.value
                    )
                );

                return;


            case "constant":

                replaceSelectedNode(
                    constantNode(
                        action.value
                    )
                );

                return;


            case "addition": {

                const rightTerm =
                    placeholderNode(
                        "término"
                    );


                const addition =
                    additionNode([

                        selectedNode,
                        rightTerm

                    ]);


                replaceSelectedNode(
                    addition,
                    rightTerm.id
                );

                return;

            }


            case "multiplication": {

                const rightFactor =
                    placeholderNode(
                        "factor"
                    );


                const multiplication =
                    multiplicationNode([

                        selectedNode,
                        rightFactor

                    ]);


                replaceSelectedNode(
                    multiplication,
                    rightFactor.id
                );

                return;

            }


            case "fraction": {

                const denominator =
                    placeholderNode(
                        "denominador"
                    );


                const fraction =
                    fractionNode(

                        selectedNode,
                        denominator

                    );


                replaceSelectedNode(
                    fraction,
                    denominator.id
                );

                return;

            }


            case "power": {

                const exponent =
                    placeholderNode(
                        "exponente"
                    );


                const power =
                    powerNode(

                        selectedNode,
                        exponent

                    );


                replaceSelectedNode(
                    power,
                    exponent.id
                );

                return;

            }


            case "factorial": {

                const factorial =
                    factorialNode(
                        selectedNode
                    );


                replaceSelectedNode(
                    factorial,
                    factorial.id
                );

                return;

            }


            case "negation": {

                const negation =
                    negationNode(
                        selectedNode
                    );


                replaceSelectedNode(
                    negation,
                    negation.id
                );

                return;

            }


            case "square-root": {

                const squareRoot =
                    functionCallNode(

                        "sqrt",

                        [
                            selectedNode
                        ]

                    );


                replaceSelectedNode(
                    squareRoot,
                    squareRoot.id
                );

                return;

            }


            case "group": {

                const group =
                    groupNode(
                        selectedNode
                    );


                replaceSelectedNode(
                    group,
                    group.id
                );

                return;

            }


            case "function": {

                const argument =
                    selectedNode.type === "placeholder"

                        ? placeholderNode(
                            "argumento"
                        )

                        : selectedNode;


                const functionExpression =
                    functionCallNode(

                        action.value,

                        [
                            argument
                        ]

                    );


                replaceSelectedNode(

                    functionExpression,

                    argument.id

                );

                return;

            }


            case "clear": {

                const placeholder =
                    placeholderNode();


                replaceSelectedNode(
                    placeholder,
                    placeholder.id
                );

                return;

            }

        }

    }


    function addExpression(): void {
        const color =
            expressionColors[
                expressions.length %
                expressionColors.length
            ];


        setExpressions(previous => [
            ...previous,

            {
                id: crypto.randomUUID(),
                expression: "",
                color,
                visible: true
            }
        ]);
    }


    function updateExpression(
        expressionId: string,
        value: string
    ): void {

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
                    expression: value
                };

            })
        );

    }


    function toggleExpression(
        expressionId: string
    ): void {

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
    ): void {

        setExpressions(previous =>
            previous.filter(expression =>
                expression.id !==
                expressionId
            )
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


                   <div className="calculatorHeaderActions">

    <button
        type="button"
        className={`
            calculatorKeyboardButton
            ${
                keyboardOpen
                    ? "calculatorKeyboardButtonActive"
                    : ""
            }
        `}
        aria-label="Abrir teclado matemático"
        aria-expanded={keyboardOpen}
        onClick={() => {
            setKeyboardOpen(
                previous => !previous
            );
        }}
    >
        ∑
    </button>


    <button
        type="button"
        className="calculatorMenuButton"
        aria-label="Opciones"
    >
        •••
    </button>

</div>

                </header>


                <div className="expressionCorePreview">

                    <span className="expressionCorePreviewLabel">
                        Syntaxtral Expression v0.4
                    </span>


                    <div className="expressionCorePreviewFormula">

                        <ExpressionRenderer
                            expression={
                                editableExpression
                            }
                            selectedNodeId={
                                selectedExpressionNodeId
                            }
                            onNodeSelect={node => {

    setSelectedExpressionNodeId(
        node.id
    );

    setKeyboardOpen(
        true
    );

}}
                        />

                    </div>


                    <div className="expressionGraphStatus">

                        {editableMathJs !== null
                            ? (
                                <>
                                    <span>
                                        ● Graficando
                                    </span>

                                    <code>
                                        {editableMathJs}
                                    </code>
                                </>
                            )
                            : (
                                <span>
                                    Completa los espacios para graficar
                                </span>
                            )
                        }

                    </div>


                    

                </div>


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
                                        {expressionErrors.get(
                                            graphExpression.id
                                        )}
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


<div
    className={`
        expressionKeyboardDrawer
        ${
            keyboardOpen
                ? "expressionKeyboardDrawerOpen"
                : ""
        }
    `}
    aria-hidden={!keyboardOpen}
>

    <header className="expressionKeyboardDrawerHeader">

        <div>

            <span>
                Syntaxtral
            </span>

            <strong>
                Mathematical keyboard
            </strong>

        </div>


        <button
            type="button"
            aria-label="Cerrar teclado matemático"
            onClick={() => {

                setKeyboardOpen(
                    false
                );

            }}
        >
            ×
        </button>

    </header>


    <ExpressionKeyboard
        disabled={
            !selectedExpressionNodeId
        }
        onAction={
            handleKeyboardAction
        }
    />

</div>

</aside>


            <div className="calculatorWorkspace">

    <div className="graphModeSwitch">

        <button
            type="button"
            className={
                graphMode === "2d"
                    ? "graphModeButtonActive"
                    : ""
            }
            onClick={() => {
                setGraphMode(
                    "2d"
                );
            }}
        >
            2D
        </button>


        <button
            type="button"
            className={
                graphMode === "3d"
                    ? "graphModeButtonActive"
                    : ""
            }
            onClick={() => {
                setGraphMode(
                    "3d"
                );
            }}
        >
            3D
        </button>

    </div>


    {graphMode === "2d"
        ? (
            <GraphCanvas
                expressions={
                    canvasExpressions
                }
            />
        )
        : (
            <Graph3DCanvas
                expressions={
                    canvasExpressions
                }
            />
        )
    }

</div>

        </section>
    );

}


export default Calculator;