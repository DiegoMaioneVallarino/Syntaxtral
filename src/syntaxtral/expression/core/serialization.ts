import type {
    ExpressionNode
} from "./types";

import {
    validateExpression
} from "./validation";


export class ExpressionSerializationError
    extends Error {

    constructor(
        message: string
    ) {

        super(message);

        this.name =
            "ExpressionSerializationError";

    }

}


export function expressionToPlainText(
    expression: ExpressionNode
): string {

    return serializeNode(
        expression,
        true
    );

}


export function expressionToMathJs(
    expression: ExpressionNode
): string {

    const validation =
        validateExpression(
            expression
        );


    if (!validation.valid) {

        const messages =
            validation.errors
                .map(error => error.message)
                .join(" ");


        throw new ExpressionSerializationError(
            messages
        );

    }


    return serializeNode(
        expression,
        false
    );

}


export function expressionToJSON(
    expression: ExpressionNode
): string {

    return JSON.stringify(
        expression,
        null,
        2
    );

}


function serializeNode(
    node: ExpressionNode,
    allowPlaceholders: boolean
): string {

    switch (node.type) {

        case "number":

            return node.value;


        case "symbol":

            return node.name;


        case "addition":

            return node.terms
                .map(term => (
                    serializeNode(
                        term,
                        allowPlaceholders
                    )
                ))
                .join(" + ");


        case "multiplication":

            return node.factors
                .map(factor => {

                    const serialized =
                        serializeNode(
                            factor,
                            allowPlaceholders
                        );


                    if (
                        factor.type ===
                        "addition"
                    ) {

                        return `(${serialized})`;

                    }


                    return serialized;

                })
                .join(" * ");


        case "fraction": {

            const numerator =
                serializeNode(
                    node.numerator,
                    allowPlaceholders
                );


            const denominator =
                serializeNode(
                    node.denominator,
                    allowPlaceholders
                );


            return (
                `(${numerator})` +
                ` / ` +
                `(${denominator})`
            );

        }


        case "power": {

            const base =
                serializeNode(
                    node.base,
                    allowPlaceholders
                );


            const exponent =
                serializeNode(
                    node.exponent,
                    allowPlaceholders
                );


            return (
                `(${base})` +
                ` ^ ` +
                `(${exponent})`
            );

        }


        case "negation": {

            const operand =
                serializeNode(
                    node.operand,
                    allowPlaceholders
                );


            return `-(${operand})`;

        }


        case "function-call": {

            const argumentsText =
                node.arguments
                    .map(argument => (
                        serializeNode(
                            argument,
                            allowPlaceholders
                        )
                    ))
                    .join(", ");


            return (
                `${node.name}` +
                `(${argumentsText})`
            );

        }


        case "group": {

            const content =
                serializeNode(
                    node.expression,
                    allowPlaceholders
                );


            return `(${content})`;

        }


        case "placeholder": {

            if (allowPlaceholders) {

                return node.label
                    ? `□${node.label}`
                    : "□";

            }


            throw new ExpressionSerializationError(
                "No se puede evaluar una expresión incompleta."
            );

        }

    }

}