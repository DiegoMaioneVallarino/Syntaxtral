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
    summationNode,
    symbolNode
} from "../../syntaxtral/expression";

import type {
    ExpressionKeyboardAction,
    ExpressionNode
} from "../../syntaxtral/expression";

import "./Calculator.css";

import GraphCanvas from "../../components/GraphCanvas/GraphCanvas";
import Graph3DCanvas from "../../components/Graph3DCanvas/Graph3DCanvas";

import type {
    GraphExpression
} from "./models/GraphExpression";


type GraphMode =
    | "2d"
    | "3d";


type FormulaBlock = {

    readonly id:
        string;

    readonly type:
        "formula";

    expression:
        ExpressionNode;

    color:
        string;

    visible:
        boolean;

    is3D:
        boolean;
    coordinateSystem:
    | "cartesian"
    | "polar";
  
};


type NoteBlock = {

    readonly id:
        string;

    readonly type:
        "note";

    content:
        string;

};

type VariableBlock = {

    readonly id:
        string;

    readonly type:
        "variable";

    name:
        string;

    value:
        number;

    min:
        number;

    max:
        number;

    step:
        number;

};

type CalculatorBlock =
    | FormulaBlock
    | VariableBlock
    | NoteBlock;


const formulaColors = [
    "#a855f7",
    "#22d3ee",
    "#f59e0b",
    "#ef476f",
    "#84cc16",
    "#f472b6"
];

const suggestedVariableNames = [
    "a",
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "k",
    "m",
    "p",
    "q",
    "r",
    "s",
    "u",
    "v",
    "w"
];
const initialFormulaBlock:
    FormulaBlock = {

    id:
        crypto.randomUUID(),

    type:
        "formula",

    expression:
        exampleExpression,

    color:
        formulaColors[0],

    visible:
    true,

is3D:
    false,

coordinateSystem:
    "cartesian"

};


function trySerializeExpression(
    expression: ExpressionNode
): string | null {

    try {

        return expressionToMathJs(
            expression
        );

    } catch {

        return null;

    }

}


function Calculator() {

    const [
        blocks,
        setBlocks
    ] = useState<CalculatorBlock[]>([
        initialFormulaBlock
    ]);


    const [
        activeFormulaBlockId,
        setActiveFormulaBlockId
    ] = useState<string | null>(
        initialFormulaBlock.id
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
    ] = useState(
        false
    );


    const [
        graphMode,
        setGraphMode
    ] = useState<GraphMode>(
        "2d"
    );


    const activeFormulaBlock =
        useMemo(() => {

            const block =
                blocks.find(
                    candidate =>
                        candidate.type === "formula" &&
                        candidate.id === activeFormulaBlockId
                );


            return block?.type === "formula"
                ? block
                : null;

        }, [
            blocks,
            activeFormulaBlockId
        ]);


     
const variableScope =
    useMemo<
        Record<string, number>
    >(() => {

        const scope:
            Record<string, number> = {};


        for (const block of blocks) {

            if (
                block.type !== "variable" ||
                block.name.length === 0
            ) {

                continue;

            }


            scope[block.name] =
                block.value;

        }


        return scope;

    }, [blocks]);

    const canvasExpressions =
        useMemo<GraphExpression[]>(() => {

            return blocks.flatMap(
                block => {

                    if (
                        block.type !== "formula"
                    ) {

                        return [];

                    }


                    const serialized =
                        trySerializeExpression(
                            block.expression
                        );


                    if (!serialized) {

                        return [];

                    }


                   return [
                            {
    id:
        block.id,

    expression:
        serialized,

    color:
        block.color,

    visible:
        block.visible,

    is3D:
        block.is3D,

    coordinateSystem:
        block.coordinateSystem,

    variables:
        variableScope
}
                        ];

                }
            );

        }, [
    blocks,
    variableScope
]);


    function replaceSelectedNode(
        replacement: ExpressionNode,
        nextSelectedNodeId:
            string = replacement.id
    ): void {

        if (
            !activeFormulaBlockId ||
            !selectedExpressionNodeId
        ) {

            return;

        }


        setBlocks(previous =>
            previous.map(block => {

                if (
                    block.type !== "formula" ||
                    block.id !== activeFormulaBlockId
                ) {

                    return block;

                }


                return {

                    ...block,

                    expression:
                        replaceExpressionNodeById(
                            block.expression,
                            selectedExpressionNodeId,
                            replacement
                        )

                };

            })
        );


        setSelectedExpressionNodeId(
            nextSelectedNodeId
        );

    }


    function getSelectedNode():
        ExpressionNode | null {

        if (
            !activeFormulaBlock ||
            !selectedExpressionNodeId
        ) {

            return null;

        }


        return findExpressionNodeById(
            activeFormulaBlock.expression,
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


                replaceSelectedNode(
                    additionNode([
                        selectedNode,
                        rightTerm
                    ]),
                    rightTerm.id
                );

                return;

            }


            case "multiplication": {

                const rightFactor =
                    placeholderNode(
                        "factor"
                    );


                replaceSelectedNode(
                    multiplicationNode([
                        selectedNode,
                        rightFactor
                    ]),
                    rightFactor.id
                );

                return;

            }


            case "fraction": {

                const denominator =
                    placeholderNode(
                        "denominador"
                    );


                replaceSelectedNode(
                    fractionNode(
                        selectedNode,
                        denominator
                    ),
                    denominator.id
                );

                return;

            }


            case "power": {

                const exponent =
                    placeholderNode(
                        "exponente"
                    );


                replaceSelectedNode(
                    powerNode(
                        selectedNode,
                        exponent
                    ),
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


                replaceSelectedNode(
                    functionCallNode(
                        action.value,
                        [
                            argument
                        ]
                    ),
                    argument.id
                );

                return;

            }

case "summation": {

    const index =
        symbolNode(
            "k"
        );


    const lowerBound =
        numberNode(
            "1"
        );


    const upperBound =
        placeholderNode(
            "límite"
        );


    const summation =
        summationNode(
            index,
            lowerBound,
            upperBound,
            selectedNode
        );


    replaceSelectedNode(
        summation,
        upperBound.id
    );


    return;

}
            case "clear": {

                const emptyNode =
                    placeholderNode();


                replaceSelectedNode(
                    emptyNode,
                    emptyNode.id
                );

                return;

            }

        }

    }


    function addFormulaBlock(): void {

        const expression =
            placeholderNode();


        const formulaCount =
            blocks.filter(
                block =>
                    block.type === "formula"
            ).length;


                    const block:
                FormulaBlock = {

                id:
                    crypto.randomUUID(),

                type:
                    "formula",

                expression,

                color:
                    formulaColors[
                        formulaCount %
                        formulaColors.length
                    ],

                visible:
                    true,

                is3D:
                    false,

                coordinateSystem:
                    "cartesian"

            };


        setBlocks(previous => [
            ...previous,
            block
        ]);


        setActiveFormulaBlockId(
            block.id
        );


        setSelectedExpressionNodeId(
            expression.id
        );


        setKeyboardOpen(
            true
        );

    }


    function addNoteBlock(): void {

        const note:
            NoteBlock = {

            id:
                crypto.randomUUID(),

            type:
                "note",

            content:
                ""

        };


        setBlocks(previous => [
            ...previous,
            note
        ]);

    }


    function updateNoteBlock(
        blockId: string,
        content: string
    ): void {

        setBlocks(previous =>
            previous.map(block => {

                if (
                    block.type !== "note" ||
                    block.id !== blockId
                ) {

                    return block;

                }


                return {

                    ...block,
                    content

                };

            })
        );

    }


    function removeBlock(
        blockId: string
    ): void {

        const remainingBlocks =
            blocks.filter(
                block =>
                    block.id !== blockId
            );


        setBlocks(
            remainingBlocks
        );


        if (
            blockId !== activeFormulaBlockId
        ) {

            return;

        }


        const nextFormula =
            remainingBlocks.find(
                block =>
                    block.type === "formula"
            );


        if (
            nextFormula?.type === "formula"
        ) {

            setActiveFormulaBlockId(
                nextFormula.id
            );

            setSelectedExpressionNodeId(
                nextFormula.expression.id
            );

        } else {

            setActiveFormulaBlockId(
                null
            );

            setSelectedExpressionNodeId(
                null
            );

            setKeyboardOpen(
                false
            );

        }

    }
function toggleFormulaVisibility(
    formulaId: string
): void {

    setBlocks(previous =>
        previous.map(block => {

            if (
                block.type !== "formula" ||
                block.id !== formulaId
            ) {

                return block;

            }


            return {

                ...block,

                visible:
                    !block.visible

            };

        })
    );

}


function toggleFormulaDimension(
    formulaId: string
): void {

    setBlocks(previous =>
        previous.map(block => {

            if (
                block.type !== "formula" ||
                block.id !== formulaId
            ) {

                return block;

            }


            return {

                ...block,

                is3D:
                    !block.is3D

            };

        })
    );

}
function addVariableBlock(): void {

    const usedNames =
        new Set(
            blocks.flatMap(block =>
                block.type === "variable"
                    ? [block.name]
                    : []
            )
        );


    const suggestedName =
        suggestedVariableNames.find(
            name =>
                !usedNames.has(name)
        );


    const variable:
        VariableBlock = {

        id:
            crypto.randomUUID(),

        type:
            "variable",

        name:
            suggestedName ??
            `v${usedNames.size + 1}`,

        value:
            1,

        min:
            -10,

        max:
            10,

        step:
            0.1

    };


    setBlocks(previous => [
        ...previous,
        variable
    ]);

}


function updateVariableBlock(
    blockId: string,
    changes:
        Partial<
            Pick<
                VariableBlock,
                | "name"
                | "value"
                | "min"
                | "max"
                | "step"
            >
        >
): void {

    setBlocks(previous =>
        previous.map(block => {

            if (
                block.type !== "variable" ||
                block.id !== blockId
            ) {

                return block;

            }


            const candidate = {
                ...block,
                ...changes
            };


            const minimum =
                Math.min(
                    candidate.min,
                    candidate.max
                );


            const maximum =
                Math.max(
                    candidate.min,
                    candidate.max
                );


            const step =

                Number.isFinite(
                    candidate.step
                ) &&
                candidate.step > 0

                    ? candidate.step

                    : 0.1;


            const value =
                Math.min(
                    maximum,
                    Math.max(
                        minimum,
                        candidate.value
                    )
                );


            return {
                ...candidate,
                min:
                    minimum,
                max:
                    maximum,
                step,
                value
            };

        })
    );

}


function updateVariableName(
    blockId: string,
    inputName: string
): void {

    const normalizedName =
        inputName
            .replace(
                /[^a-zA-Z0-9_]/g,
                ""
            )
            .slice(
                0,
                8
            );


    updateVariableBlock(
        blockId,
        {
            name:
                normalizedName
        }
    );

}


function insertVariableInFormula(
    variableName: string
): void {

    if (
        variableName.length === 0 ||
        !activeFormulaBlock ||
        !selectedExpressionNodeId
    ) {

        return;

    }


    replaceSelectedNode(
        symbolNode(
            variableName
        )
    );

}

function toggleFormulaCoordinateSystem(
    formulaId: string
): void {

    setBlocks(previous =>
        previous.map(block => {

            if (
                block.type !== "formula" ||
                block.id !== formulaId
            ) {

                return block;

            }


            return {

                ...block,

                coordinateSystem:
                    block.coordinateSystem ===
                    "cartesian"

                        ? "polar"
                        : "cartesian"

            };

        })
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
                            disabled={
                                !activeFormulaBlock
                            }
                            aria-label="Abrir teclado matemático"
                            onClick={() => {

                                setKeyboardOpen(
                                    previous =>
                                        !previous
                                );

                            }}
                        >
                            ∑
                        </button>


                        <button
                            type="button"
                            className="calculatorMenuButton"
                        >
                            •••
                        </button>

                    </div>

                </header>


                <div className="calculatorFlow">

                    {blocks.map((
                        block,
                        blockIndex
                    ) => {
if (
    block.type === "variable"
) {

    return (
        <article
            key={block.id}
            className="calculatorVariableBlock"
        >

            <header className="calculatorVariableHeader">

                <div>

                    <span>
                        Variable
                    </span>


                    <input
                        type="text"
                        value={
                            block.name
                        }
                        aria-label="Nombre de la variable"
                        onChange={event => {

                            updateVariableName(
                                block.id,
                                event.target.value
                            );

                        }}
                    />

                </div>


                <button
                    type="button"
                    aria-label="Eliminar variable"
                    onClick={() => {

                        removeBlock(
                            block.id
                        );

                    }}
                >
                    ×
                </button>

            </header>


            <div className="calculatorVariableValue">

                <strong>
                    {block.name || "?"}
                </strong>

                <span>
                    =
                </span>

                <output>
                    {
                        Number(
                            block.value.toFixed(
                                8
                            )
                        )
                    }
                </output>

            </div>


            <input
                className="calculatorVariableSlider"
                type="range"
                min={
                    block.min
                }
                max={
                    block.max
                }
                step={
                    block.step
                }
                value={
                    block.value
                }
                onChange={event => {

                    updateVariableBlock(
                        block.id,
                        {
                            value:
                                event.target
                                    .valueAsNumber
                        }
                    );

                }}
            />


            <div className="calculatorVariableRange">

                <label>

                    <span>
                        Min
                    </span>

                    <input
                        type="number"
                        value={
                            block.min
                        }
                        step={
                            block.step
                        }
                        onChange={event => {

                            const value =
                                event.target
                                    .valueAsNumber;


                            if (
                                Number.isFinite(
                                    value
                                )
                            ) {

                                updateVariableBlock(
                                    block.id,
                                    {
                                        min:
                                            value
                                    }
                                );

                            }

                        }}
                    />

                </label>


                <label>

                    <span>
                        Max
                    </span>

                    <input
                        type="number"
                        value={
                            block.max
                        }
                        step={
                            block.step
                        }
                        onChange={event => {

                            const value =
                                event.target
                                    .valueAsNumber;


                            if (
                                Number.isFinite(
                                    value
                                )
                            ) {

                                updateVariableBlock(
                                    block.id,
                                    {
                                        max:
                                            value
                                    }
                                );

                            }

                        }}
                    />

                </label>


                <label>

                    <span>
                        Step
                    </span>

                    <input
                        type="number"
                        value={
                            block.step
                        }
                        min="0.000001"
                        step="0.01"
                        onChange={event => {

                            const value =
                                event.target
                                    .valueAsNumber;


                            if (
                                Number.isFinite(
                                    value
                                ) &&
                                value > 0
                            ) {

                                updateVariableBlock(
                                    block.id,
                                    {
                                        step:
                                            value
                                    }
                                );

                            }

                        }}
                    />

                </label>

            </div>


            <button
                type="button"
                className="calculatorInsertVariableButton"
                disabled={
                    !block.name ||
                    !activeFormulaBlock ||
                    !selectedExpressionNodeId
                }
                onClick={() => {

                    insertVariableInFormula(
                        block.name
                    );

                }}
            >
                Insertar {block.name || "variable"} en la fórmula
            </button>

        </article>
    );

}
                        if (
                            block.type === "note"
                        ) {

                            return (
                                <article
                                    key={block.id}
                                    className="calculatorNote"
                                >

                                    <header className="calculatorNoteHeader">

                                        <span>
                                            Nota
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                removeBlock(
                                                    block.id
                                                );
                                            }}
                                        >
                                            ×
                                        </button>

                                    </header>


                                    <textarea
                                        value={
                                            block.content
                                        }
                                        placeholder="Escribe una observación, hipótesis o idea..."
                                        onChange={event => {

                                            updateNoteBlock(
                                                block.id,
                                                event.target.value
                                            );

                                        }}
                                    />

                                </article>
                            );

                        }


                        const serialized =
                            trySerializeExpression(
                                block.expression
                            );


                        const formulaNumber =
                            blocks
                                .slice(
                                    0,
                                    blockIndex + 1
                                )
                                .filter(
                                    candidate =>
                                        candidate.type ===
                                        "formula"
                                )
                                .length;


                        const active =
                            block.id ===
                            activeFormulaBlockId;


                        return (
                            <article
                                key={block.id}
                                className={`
                                    calculatorFormulaBlock
                                    ${
                                        active
                                            ? "calculatorFormulaBlockActive"
                                            : ""
                                    }
                                `}
                                onClick={() => {

                                    setActiveFormulaBlockId(
                                        block.id
                                    );

                                }}
                            >

                                <header className="calculatorFormulaHeader">

                                    <div>

                                        <span
                                            className="calculatorFormulaColor"
                                            style={{
                                                backgroundColor:
                                                    block.color
                                            }}
                                        />

                                        <strong>
                                            Fórmula {formulaNumber}
                                        </strong>
                                              
                                    </div>


                                    <button
                                        type="button"
                                        aria-label="Eliminar fórmula"
                                        onClick={event => {

                                            event.stopPropagation();

                                            removeBlock(
                                                block.id
                                            );

                                        }}
                                    >
                                        ×
                                    </button>

                                </header>


                                <div className="calculatorFormulaExpression">

                                    <ExpressionRenderer
                                        expression={
                                            block.expression
                                        }
                                        selectedNodeId={
                                            active
                                                ? selectedExpressionNodeId
                                                : null
                                        }
                                        onNodeSelect={node => {

                                            setActiveFormulaBlockId(
                                                block.id
                                            );

                                            setSelectedExpressionNodeId(
                                                node.id
                                            );

                                            setKeyboardOpen(
                                                true
                                            );

                                        }}
                                    />

                                </div>


                                <footer className="calculatorFormulaFooter">

    <div className="calculatorFormulaControls">

        <button
            type="button"
            className={`calculatorFormulaVisibilityButton ${
                block.visible
                    ? "calculatorFormulaControlActive"
                    : ""
            }`}
            aria-label={
                block.visible
                    ? "Ocultar función"
                    : "Mostrar función"
            }
            aria-pressed={
                block.visible
            }
            title={
                block.visible
                    ? "Ocultar función"
                    : "Mostrar función"
            }
            onClick={event => {

                event.stopPropagation();

                toggleFormulaVisibility(
                    block.id
                );

            }}
        >

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >

                <path
                    d="
                        M2.5 12
                        C4.8 7.7 8 5.5 12 5.5
                        C16 5.5 19.2 7.7 21.5 12
                        C19.2 16.3 16 18.5 12 18.5
                        C8 18.5 4.8 16.3 2.5 12
                        Z
                    "
                />

                <circle
                    cx="12"
                    cy="12"
                    r="3.2"
                />

                {!block.visible && (

                    <path
                        className="calculatorEyeSlash"
                        d="M4 4 L20 20"
                    />

                )}

            </svg>

        </button>


        <button
            type="button"
            className={`calculatorFormulaDimensionButton ${
                block.is3D
                    ? "calculatorFormulaControlActive"
                    : ""
            }`}
            aria-label={
                block.is3D
                    ? "Convertir en función plana"
                    : "Extruir función en 3D"
            }
            aria-pressed={
                block.is3D
            }
            title={
                block.is3D
                    ? "Mostrar como curva 2D"
                    : "Extruir continuamente"
            }
            onClick={event => {

                event.stopPropagation();

                toggleFormulaDimension(
                    block.id
                );

            }}
        >

            {block.is3D ? "3D" : "2D"}

        </button>
<button
    type="button"
    className={`calculatorFormulaCoordinateButton ${
        block.coordinateSystem === "polar"
            ? "calculatorFormulaControlActive"
            : ""
    }`}
    aria-label={
        block.coordinateSystem === "polar"
            ? "Usar coordenadas cartesianas"
            : "Usar coordenadas polares"
    }
    title={
        block.coordinateSystem === "polar"
            ? "Polar: r = f(θ)"
            : "Cartesiana: y = f(x)"
    }
    onClick={event => {

        event.stopPropagation();

        toggleFormulaCoordinateSystem(
            block.id
        );

    }}
>
    {
        block.coordinateSystem === "polar"
            ? "rθ"
            : "xy"
    }
</button>
    </div>


    <div className="expressionGraphStatus">

        {!block.visible
            ? (
                <span className="expressionGraphHiddenStatus">
                    ○ Oculta
                </span>
            )
            : serialized
                ? (
                    <>
                        <span>
                            ● Graficando
                        </span>

                        <code>
                            {serialized}
                        </code>
                    </>
                )
                : (
                    <span>
                        Completa la fórmula
                    </span>
                )
        }

    </div>


    <div className="calculatorFormulaFooterSpacer" />

</footer>

                            </article>
                        );

                    })}

                </div>


                <div className="calculatorBlockActions">

                    <button
                        type="button"
                        className="addFormulaButton"
                        onClick={
                            addFormulaBlock
                        }
                    >
                        <span>
                            +
                        </span>

                        Fórmula
                    </button>
<button
    type="button"
    className="addVariableButton"
    onClick={
        addVariableBlock
    }
>
    <span>
        +
    </span>

    Variable
</button>

                    <button
                        type="button"
                        className="addNoteButton"
                        onClick={
                            addNoteBlock
                        }
                    >
                        <span>
                            +
                        </span>

                        Nota
                    </button>

                </div>


                <div
                    className={`
                        expressionKeyboardDrawer
                        ${
                            keyboardOpen
                                ? "expressionKeyboardDrawerOpen"
                                : ""
                        }
                    `}
                    aria-hidden={
                        !keyboardOpen
                    }
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
                            !activeFormulaBlock ||
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