import type {
    ExpressionNode,
    ExpressionPath
} from "./types";


export type ExpressionValidationError = {

    path: ExpressionPath;

    nodeId: string;

    code:
        | "invalid-number"
        | "invalid-symbol"
        | "empty-addition"
        | "empty-multiplication"
        | "empty-function"
        | "empty-function-arguments"
        | "placeholder";

    message: string;

};


export type ExpressionValidationResult = {

    valid: boolean;

    errors:
        ExpressionValidationError[];

};


const numberPattern =
    /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;


const symbolPattern =
    /^[\p{L}_][\p{L}\p{N}_]*$/u;


export function validateExpression(
    expression: ExpressionNode
): ExpressionValidationResult {

    const errors:
        ExpressionValidationError[] = [];


    validateNode(
        expression,
        [],
        errors
    );


    return {

        valid:
            errors.length === 0,

        errors

    };

}


function validateNode(
    node: ExpressionNode,
    path: ExpressionPath,
    errors: ExpressionValidationError[]
): void {

    switch (node.type) {

        case "number": {

            if (
                !numberPattern.test(
                    node.value
                )
            ) {

                errors.push({

                    path,

                    nodeId:
                        node.id,

                    code:
                        "invalid-number",

                    message:
                        `"${node.value}" no es un número válido.`

                });

            }

            return;

        }


        case "symbol": {

            if (
                !symbolPattern.test(
                    node.name
                )
            ) {

                errors.push({

                    path,

                    nodeId:
                        node.id,

                    code:
                        "invalid-symbol",

                    message:
                        `"${node.name}" no es un símbolo válido.`

                });

            }

            return;

        }


        case "addition": {

            if (
                node.terms.length === 0
            ) {

                errors.push({

                    path,

                    nodeId:
                        node.id,

                    code:
                        "empty-addition",

                    message:
                        "La suma no contiene términos."

                });

            }


            node.terms.forEach((
                term,
                index
            ) => {

                validateNode(

                    term,

                    [
                        ...path,
                        "terms",
                        index
                    ],

                    errors

                );

            });


            return;

        }


        case "multiplication": {

            if (
                node.factors.length === 0
            ) {

                errors.push({

                    path,

                    nodeId:
                        node.id,

                    code:
                        "empty-multiplication",

                    message:
                        "El producto no contiene factores."

                });

            }


            node.factors.forEach((
                factor,
                index
            ) => {

                validateNode(

                    factor,

                    [
                        ...path,
                        "factors",
                        index
                    ],

                    errors

                );

            });


            return;

        }


        case "fraction": {

            validateNode(

                node.numerator,

                [
                    ...path,
                    "numerator"
                ],

                errors

            );


            validateNode(

                node.denominator,

                [
                    ...path,
                    "denominator"
                ],

                errors

            );


            return;

        }


        case "power": {

            validateNode(

                node.base,

                [
                    ...path,
                    "base"
                ],

                errors

            );


            validateNode(

                node.exponent,

                [
                    ...path,
                    "exponent"
                ],

                errors

            );


            return;

        }


        case "negation": {

            validateNode(

                node.operand,

                [
                    ...path,
                    "operand"
                ],

                errors

            );


            return;

        }


        case "function-call": {

            if (
                !symbolPattern.test(
                    node.name
                )
            ) {

                errors.push({

                    path,

                    nodeId:
                        node.id,

                    code:
                        "empty-function",

                    message:
                        "La función no tiene un nombre válido."

                });

            }


            if (
                node.arguments.length === 0
            ) {

                errors.push({

                    path,

                    nodeId:
                        node.id,

                    code:
                        "empty-function-arguments",

                    message:
                        `La función ${node.name} no contiene argumentos.`

                });

            }


            node.arguments.forEach((
                argument,
                index
            ) => {

                validateNode(

                    argument,

                    [
                        ...path,
                        "arguments",
                        index
                    ],

                    errors

                );

            });


            return;

        }


        case "group": {

            validateNode(

                node.expression,

                [
                    ...path,
                    "expression"
                ],

                errors

            );


            return;

        }


        case "placeholder": {

            errors.push({

                path,

                nodeId:
                    node.id,

                code:
                    "placeholder",

                message:
                    node.label
                        ? `Falta completar: ${node.label}.`
                        : "La expresión está incompleta."

            });


            return;

        }

    }

}