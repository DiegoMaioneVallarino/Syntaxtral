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

        super(
            message
        );

        this.name =
            "ExpressionSerializationError";

        this.nodeId =
            nodeId;

    }

}


function constantToPlainText(
    constant: MathematicalConstant
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

function comparisonRelationToSymbol(
    relation:
        "less" |
        "less-or-equal" |
        "greater" |
        "greater-or-equal"
): string {

    switch (relation) {

        case "less":
            return "<";

        case "less-or-equal":
            return "≤";

        case "greater":
            return ">";

        case "greater-or-equal":
            return "≥";

    }

}


function comparisonRelationToMathJs(
    relation:
        "less" |
        "less-or-equal" |
        "greater" |
        "greater-or-equal"
): string {

    switch (relation) {

        case "less":
            return "<";

        case "less-or-equal":
            return "<=";

        case "greater":
            return ">";

        case "greater-or-equal":
            return ">=";

    }

}
function constantToMathJs(
    constant: MathematicalConstant
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

            return (
                `(${expressionToPlainText(expression.numerator)})` +
                " / " +
                `(${expressionToPlainText(expression.denominator)})`
            );


        case "power":

            return (
                `(${expressionToPlainText(expression.base)})` +
                "^" +
                `(${expressionToPlainText(expression.exponent)})`
            );


        case "factorial":

            return (
                `(${expressionToPlainText(expression.operand)})!`
            );


        case "negation":

            return (
                `−(${expressionToPlainText(expression.operand)})`
            );


        case "equality":

            return (
                `${expressionToPlainText(expression.left)} = ` +
                expressionToPlainText(
                    expression.right
                )
            );


        case "function-call":

            return (
                `${expression.name}(` +
                expression.arguments
                    .map(
                        expressionToPlainText
                    )
                    .join(", ") +
                ")"
            );

case "comparison":

    return (
        `${expressionToPlainText(expression.left)} ` +
        `${comparisonRelationToSymbol(expression.relation)} ` +
        expressionToPlainText(
            expression.right
        )
    );
        case "function-definition":

            return (
                `${expressionToPlainText(expression.name)}` +
                `(${
                    expression.parameters
                        .map(
                            expressionToPlainText
                        )
                        .join(", ")
                }) = ` +
                expressionToPlainText(
                    expression.body
                )
            );
case "vector":

    return (
        "⟨" +
        expression.components
            .map(
                expressionToPlainText
            )
            .join(", ") +
        "⟩"
    );

        case "summation":

            return (
                "sum(" +
                `${expressionToPlainText(expression.body)}, ` +
                `${expressionToPlainText(expression.index)} = ` +
                `${expressionToPlainText(expression.lowerBound)}..` +
                `${expressionToPlainText(expression.upperBound)}` +
                ")"
            );


        case "group":

            return (
                `(${expressionToPlainText(expression.expression)})`
            );


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
                .map(
                    term =>
                        `(${expressionToMathJs(term)})`
                )
                .join(" + ");


        case "multiplication":

            return expression.factors
                .map(
                    factor =>
                        `(${expressionToMathJs(factor)})`
                )
                .join(" * ");


        case "fraction":

            return (
                `(${expressionToMathJs(expression.numerator)})` +
                " / " +
                `(${expressionToMathJs(expression.denominator)})`
            );


        case "power":

            return (
                `(${expressionToMathJs(expression.base)})` +
                " ^ " +
                `(${expressionToMathJs(expression.exponent)})`
            );


        case "factorial":

            return (
                `factorial(${expressionToMathJs(expression.operand)})`
            );


        case "negation":

            return (
                `-(${expressionToMathJs(expression.operand)})`
            );


        case "equality":

            return (
                `(${expressionToMathJs(expression.left)}) = ` +
                `(${expressionToMathJs(expression.right)})`
            );


        case "function-call":

            return (
                `${expression.name}(` +
                expression.arguments
                    .map(
                        expressionToMathJs
                    )
                    .join(", ") +
                ")"
            );
            
case "comparison":

    return (
        `(${expressionToMathJs(expression.left)}) ` +
        `${comparisonRelationToMathJs(expression.relation)} ` +
        `(${expressionToMathJs(expression.right)})`
    );
        case "function-definition": {

            if (
                expression.name.type !== "symbol"
            ) {

                throw new ExpressionSerializationError(
                    expression.name.id,
                    "El nombre de una función debe ser un símbolo"
                );

            }


            const parameters =
                expression.parameters.map(
                    parameter => {

                        if (
                            parameter.type !== "symbol"
                        ) {

                            throw new ExpressionSerializationError(
                                parameter.id,
                                "Los parámetros deben ser símbolos"
                            );

                        }


                        return parameter.name;

                    }
                );


            return (
                `${expression.name.name}` +
                `(${parameters.join(", ")}) = ` +
                expressionToMathJs(
                    expression.body
                )
            );

        }

        case "vector":

    return (
        "[" +
        expression.components
            .map(
                expressionToMathJs
            )
            .join(", ") +
        "]"
    );
        case "summation": {

            const indexName =

                expression.index.type === "symbol"

                    ? expression.index.name

                    : "";


            const serializedBody =
                expressionToMathJs(
                    expression.body
                );


            return (
                "syntaxtralSum(" +
                `${JSON.stringify(serializedBody)}, ` +
                `${JSON.stringify(indexName)}, ` +
                `${expressionToMathJs(expression.lowerBound)}, ` +
                `${expressionToMathJs(expression.upperBound)}` +
                ")"
            );

        }


        case "group":

            return (
                `(${expressionToMathJs(expression.expression)})`
            );


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