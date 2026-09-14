import type {

    ExpressionNode,
    MathematicalConstant

} from "./types";


export class ExpressionSerializationError
    extends Error {

    public readonly nodeId:
        string;


    public constructor(
        nodeId: string,
        message: string
    ) {

        super(message);

        this.name =
            "ExpressionSerializationError";

        this.nodeId =
            nodeId;

    }

}


function constantToPlainText(
    constant:
        MathematicalConstant
): string {

    switch (constant) {

        case "pi":

            return "π";


        case "e":

            return "e";


        case "i":

            return "i";


        case "infinity":

            return "∞";

    }

}


function constantToMathJs(
    constant:
        MathematicalConstant
): string {

    switch (constant) {

        case "pi":

            return "pi";


        case "e":

            return "e";


        case "i":

            return "i";


        case "infinity":

            return "Infinity";

    }

}


export function expressionToPlainText(
    expression: ExpressionNode
): string {

    switch (expression.type) {

        case "number":

            return expression.value;


        case "symbol":

            return expression.name;


        case "constant":

            return constantToPlainText(
                expression.name
            );


        case "addition":

            return expression.terms
                .map(
                    expressionToPlainText
                )
                .join(" + ");


        case "multiplication":

            return expression.factors
                .map(
                    expressionToPlainText
                )
                .join(" · ");


        case "fraction":

            return `(${
                expressionToPlainText(
                    expression.numerator
                )
            }) / (${
                expressionToPlainText(
                    expression.denominator
                )
            })`;


        case "power":

            return `(${
                expressionToPlainText(
                    expression.base
                )
            })^(${
                expressionToPlainText(
                    expression.exponent
                )
            })`;


        case "factorial":

            return `(${
                expressionToPlainText(
                    expression.operand
                )
            })!`;


        case "negation":

            return `−(${
                expressionToPlainText(
                    expression.operand
                )
            })`;


        case "function-call":

            return `${expression.name}(${
                expression.arguments
                    .map(
                        expressionToPlainText
                    )
                    .join(", ")
            })`;


        case "group":

            return `(${
                expressionToPlainText(
                    expression.expression
                )
            })`;


        case "placeholder":

            return expression.label ??
                "□";

    }

}


export function expressionToMathJs(
    expression: ExpressionNode
): string {

    switch (expression.type) {

        case "number":

            return expression.value;


        case "symbol":

            return expression.name;


        case "constant":

            return constantToMathJs(
                expression.name
            );


        case "addition":

            return expression.terms
                .map(term => (
                    `(${
                        expressionToMathJs(
                            term
                        )
                    })`
                ))
                .join(" + ");


        case "multiplication":

            return expression.factors
                .map(factor => (
                    `(${
                        expressionToMathJs(
                            factor
                        )
                    })`
                ))
                .join(" * ");


        case "fraction":

            return `(${
                expressionToMathJs(
                    expression.numerator
                )
            }) / (${
                expressionToMathJs(
                    expression.denominator
                )
            })`;


        case "power":

            return `(${
                expressionToMathJs(
                    expression.base
                )
            }) ^ (${
                expressionToMathJs(
                    expression.exponent
                )
            })`;


        case "factorial":

            return `factorial(${
                expressionToMathJs(
                    expression.operand
                )
            })`;


        case "negation":

            return `-(${
                expressionToMathJs(
                    expression.operand
                )
            })`;


        case "function-call":

            return `${expression.name}(${
                expression.arguments
                    .map(
                        expressionToMathJs
                    )
                    .join(", ")
            })`;


        case "group":

            return `(${
                expressionToMathJs(
                    expression.expression
                )
            })`;


        case "placeholder":

            throw new ExpressionSerializationError(

                expression.id,

                "No se puede convertir un placeholder incompleto a MathJS"

            );

    }

}


export function expressionToJSON(
    expression: ExpressionNode
): string {

    try {

        return JSON.stringify(

            expression,

            null,

            2

        );

    } catch {

        throw new ExpressionSerializationError(

            expression.id,

            "No fue posible convertir la expresión a JSON"

        );

    }

}