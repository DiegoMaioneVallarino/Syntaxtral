import {
    useState
} from "react";

import "./ExpressionKeyboard.css";


export type KeyboardFunctionItem = {

    readonly name:
        string;

    readonly parameters:
        readonly string[];

};


export type ExpressionKeyboardAction =
    | {
        type: "digit";
        value: string;
    }
    | {
        type: "decimal";
    }
    | {
        type: "symbol";
        value: string;
    }
    | {
        type: "constant";
        value:
            "pi" |
            "e" |
            "i" |
            "infinity";
    }
    | {
        type:
            "addition" |
            "multiplication" |
            "fraction" |
            "power" |
            "factorial" |
            "negation" |
            "square-root" |
            "group" |
            "equality" |
            "clear";
    }
    | {
        type: "function";
        value: string;
    }
    | {
        type: "summation";
    }
    | {
        type: "function-definition";
    };


type KeyboardCatalog =
    | "functions"
    | "variables"
    | "sets"
    | null;


type ExpressionKeyboardProps = {

    disabled?:
        boolean;

    functions?:
        readonly KeyboardFunctionItem[];

    variables?:
        readonly string[];

    sets?:
        readonly string[];

    onAction: (
        action: ExpressionKeyboardAction
    ) => void;

};


const letters =
    "abcdefghijklmnopqrstuvwxyz"
        .split("");


export function ExpressionKeyboard({
    disabled = false,
    functions = [],
    variables = [],
    sets = [],
    onAction
}: ExpressionKeyboardProps) {

    const [
        uppercase,
        setUppercase
    ] = useState(
        false
    );


    const [
        activeCatalog,
        setActiveCatalog
    ] = useState<KeyboardCatalog>(
        null
    );


    function toggleCatalog(
        catalog: Exclude<KeyboardCatalog, null>
    ): void {

        setActiveCatalog(previous =>
            previous === catalog
                ? null
                : catalog
        );

    }


    return (
        <div className="expressionKeyboard">

            <div className="expressionKeyboardCatalogTabs">

                <button
                    type="button"
                    className={
                        activeCatalog === "functions"
                            ? "expressionKeyboardCatalogActive"
                            : ""
                    }
                    onClick={() => {
                        toggleCatalog(
                            "functions"
                        );
                    }}
                >
                    fxs
                </button>

                <button
                    type="button"
                    className={
                        activeCatalog === "variables"
                            ? "expressionKeyboardCatalogActive"
                            : ""
                    }
                    onClick={() => {
                        toggleCatalog(
                            "variables"
                        );
                    }}
                >
                    vars
                </button>

                <button
                    type="button"
                    className={
                        activeCatalog === "sets"
                            ? "expressionKeyboardCatalogActive"
                            : ""
                    }
                    onClick={() => {
                        toggleCatalog(
                            "sets"
                        );
                    }}
                >
                    sets
                </button>

            </div>


            {activeCatalog && (

                <div className="expressionKeyboardCatalog">

                    {activeCatalog === "functions" && (

                        functions.length > 0
                            ? functions.map(
                                functionItem => (

                                    <button
                                        key={functionItem.name}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => {

                                            onAction({
                                                type:
                                                    "function",

                                                value:
                                                    functionItem.name
                                            });

                                        }}
                                    >
                                        {functionItem.name}
                                        (
                                        {functionItem.parameters.join(", ")}
                                        )
                                    </button>

                                )
                            )
                            : (
                                <span>
                                    No hay funciones creadas
                                </span>
                            )

                    )}


                    {activeCatalog === "variables" && (

                        variables.length > 0
                            ? variables.map(
                                variable => (

                                    <button
                                        key={variable}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => {

                                            onAction({
                                                type:
                                                    "symbol",

                                                value:
                                                    variable
                                            });

                                        }}
                                    >
                                        {variable}
                                    </button>

                                )
                            )
                            : (
                                <span>
                                    No hay variables creadas
                                </span>
                            )

                    )}


                    {activeCatalog === "sets" && (

                        sets.length > 0
                            ? sets.map(setName => (

                                <button
                                    key={setName}
                                    type="button"
                                    disabled
                                >
                                    {setName}
                                </button>

                            ))
                            : (
                                <span>
                                    Los sets vienen en la siguiente mutación
                                </span>
                            )

                    )}

                </div>

            )}


            <div className="expressionKeyboardSection">

                {[
                    "7",
                    "8",
                    "9",
                    "4",
                    "5",
                    "6",
                    "1",
                    "2",
                    "3",
                    "0"
                ].map(digit => (

                    <button
                        key={digit}
                        type="button"
                        disabled={disabled}
                        onClick={() => {

                            onAction({
                                type:
                                    "digit",

                                value:
                                    digit
                            });

                        }}
                    >
                        {digit}
                    </button>

                ))}


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "decimal"
                        });

                    }}
                >
                    .
                </button>


                <button
                    type="button"
                    className="expressionKeyboardDanger"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "clear"
                        });

                    }}
                >
                    ⌫
                </button>

            </div>


            <div className="
                expressionKeyboardSection
                expressionKeyboardAlphabet
            ">

                <button
                    type="button"
                    className={
                        uppercase
                            ? "expressionKeyboardShiftActive"
                            : ""
                    }
                    aria-pressed={uppercase}
                    onClick={() => {

                        setUppercase(previous =>
                            !previous
                        );

                    }}
                >
                    ⇧
                </button>


                {letters.map(letter => {

                    const value =
                        uppercase
                            ? letter.toUpperCase()
                            : letter;


                    return (
                        <button
                            key={letter}
                            type="button"
                            disabled={disabled}
                            onClick={() => {

                                onAction({
                                    type:
                                        "symbol",

                                    value
                                });

                            }}
                        >
                            {value}
                        </button>
                    );

                })}

            </div>


            <div className="expressionKeyboardSection">

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "symbol",

                            value:
                                "theta"
                        });

                    }}
                >
                    θ
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "constant",

                            value:
                                "pi"
                        });

                    }}
                >
                    π
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "constant",

                            value:
                                "e"
                        });

                    }}
                >
                    ℯ
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "constant",

                            value:
                                "i"
                        });

                    }}
                >
                    i
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "constant",

                            value:
                                "infinity"
                        });

                    }}
                >
                    ∞
                </button>

            </div>


            <div className="expressionKeyboardSection">

                {[
                    ["+", "addition"],
                    ["−", "negation"],
                    ["×", "multiplication"],
                    ["a⁄b", "fraction"],
                    ["xʸ", "power"],
                    ["x!", "factorial"],
                    ["√x", "square-root"],
                    ["( )", "group"],
                    ["=", "equality"]
                ].map(([label, type]) => (

                    <button
                        key={type}
                        type="button"
                        disabled={disabled}
                        onClick={() => {

                            onAction({
                                type:
                                    type as
                                        | "addition"
                                        | "negation"
                                        | "multiplication"
                                        | "fraction"
                                        | "power"
                                        | "factorial"
                                        | "square-root"
                                        | "group"
                                        | "equality"
                            });

                        }}
                    >
                        {label}
                    </button>

                ))}

            </div>


            <div className="expressionKeyboardSection">

                {[
                    "sin",
                    "cos",
                    "tan",
                    "log"
                ].map(functionName => (

                    <button
                        key={functionName}
                        type="button"
                        disabled={disabled}
                        onClick={() => {

                            onAction({
                                type:
                                    "function",

                                value:
                                    functionName
                            });

                        }}
                    >
                        {functionName}
                    </button>

                ))}

            </div>


            <div className="expressionKeyboardStructural">

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {

                        onAction({
                            type:
                                "summation"
                        });

                    }}
                >
                    ∑
                </button>

                <button
                    type="button"
                    disabled={disabled}
                    title="Convertir en definición de función"
                    onClick={() => {

                        onAction({
                            type:
                                "function-definition"
                        });

                    }}
                >
                    f(x)=
                </button>

            </div>

        </div>
    );

}


export default ExpressionKeyboard;