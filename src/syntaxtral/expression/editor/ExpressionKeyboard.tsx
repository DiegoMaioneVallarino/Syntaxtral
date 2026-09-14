import "./ExpressionKeyboard.css";


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
            "clear";
    }
    | {
        type: "function";
        value:
            "sin" |
            "cos" |
            "tan" |
            "log";
    };


type ExpressionKeyboardProps = {

    disabled?:
        boolean;

    onAction: (
        action: ExpressionKeyboardAction
    ) => void;

};


export function ExpressionKeyboard({
    disabled = false,
    onAction
}: ExpressionKeyboardProps) {

    return (
        <div className="expressionKeyboard">

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
                                type: "digit",
                                value: digit
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
                            type: "decimal"
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
                            type: "clear"
                        });
                    }}
                >
                    ⌫
                </button>

            </div>


            <div className="expressionKeyboardSection">

                {[
                    "x",
                    "y",
                    "z",
                    "t",
                    "n"
                ].map(symbol => (

                    <button
                        key={symbol}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                            onAction({
                                type: "symbol",
                                value: symbol
                            });
                        }}
                    >
                        {symbol}
                    </button>

                ))}


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "constant",
                            value: "pi"
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
                            type: "constant",
                            value: "e"
                        });
                    }}
                >
                    e
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "constant",
                            value: "i"
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
                            type: "constant",
                            value: "infinity"
                        });
                    }}
                >
                    ∞
                </button>

            </div>


            <div className="expressionKeyboardSection">

                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "addition"
                        });
                    }}
                >
                    +
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "negation"
                        });
                    }}
                >
                    −
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "multiplication"
                        });
                    }}
                >
                    ×
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "fraction"
                        });
                    }}
                >
                    a⁄b
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "power"
                        });
                    }}
                >
                    xʸ
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "factorial"
                        });
                    }}
                >
                    x!
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "square-root"
                        });
                    }}
                >
                    √x
                </button>


                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        onAction({
                            type: "group"
                        });
                    }}
                >
                    ( )
                </button>

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
                                type: "function",
                                value:
                                    functionName as
                                        "sin" |
                                        "cos" |
                                        "tan" |
                                        "log"
                            });
                        }}
                    >
                        {functionName}
                    </button>

                ))}

            </div>

        </div>
    );

}


export default ExpressionKeyboard;