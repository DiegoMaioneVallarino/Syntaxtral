import type {

    ExpressionNode,
    MathematicalConstant

} from "./types";


export type ExpressionValidationError = {

    readonly nodeId:
        string;

    readonly message:
        string;

};


export type ExpressionValidationResult = {

    readonly valid:
        boolean;

    readonly errors:
        readonly ExpressionValidationError[];

};


const validConstants:
    readonly MathematicalConstant[] = [

        "pi",
        "e",
        "i",
        "infinity"

    ];


export function validateExpression(
    expression: ExpressionNode
): ExpressionValidationResult {

    const errors:
        ExpressionValidationError[] = [];


    function addError(
        nodeId: string,
        message: string
    ): void {

        errors.push({

            nodeId,
            message

        });

    }


    function validateNode(
        node: ExpressionNode
    ): void {

        if (
            typeof node.id !== "string" ||
            node.id.trim().length === 0
        ) {

            addError(
                node.id,
                "El nodo no tiene un identificador válido"
            );

        }


        switch (node.type) {

            case "number":

                if (
                    node.value.trim().length === 0
                ) {

                    addError(
                        node.id,
                        "El número está vacío"
                    );

                }


                if (
                    Number.isNaN(
                        Number(node.value)
                    )
                ) {

                    addError(
                        node.id,
                        `"${node.value}" no es un número válido`
                    );

                }

                break;


            case "symbol":

                if (
                    node.name.trim().length === 0
                ) {

                    addError(
                        node.id,
                        "El símbolo no puede estar vacío"
                    );

                }

                break;


            case "constant":

                if (
                    !validConstants.includes(
                        node.name
                    )
                ) {

                    addError(
                        node.id,
                        "Constante matemática inválida"
                    );

                }

                break;


            case "addition":

                if (
                    node.terms.length < 2
                ) {

                    addError(
                        node.id,
                        "Una suma necesita al menos dos términos"
                    );

                }


                node.terms.forEach(
                    validateNode
                );

                break;


            case "multiplication":

                if (
                    node.factors.length < 2
                ) {

                    addError(
                        node.id,
                        "Una multiplicación necesita al menos dos factores"
                    );

                }


                node.factors.forEach(
                    validateNode
                );

                break;


            case "fraction":

                validateNode(
                    node.numerator
                );


                validateNode(
                    node.denominator
                );

                break;


            case "power":

                validateNode(
                    node.base
                );


                validateNode(
                    node.exponent
                );

                break;


            case "factorial":

                validateNode(
                    node.operand
                );

                break;


            case "negation":

                validateNode(
                    node.operand
                );

                break;


            case "function-call":

                if (
                    node.name.trim().length === 0
                ) {

                    addError(
                        node.id,
                        "La función necesita un nombre"
                    );

                }


                if (
                    node.arguments.length === 0
                ) {

                    addError(
                        node.id,
                        "La función necesita al menos un argumento"
                    );

                }


                node.arguments.forEach(
                    validateNode
                );

                break;


            case "group":

                validateNode(
                    node.expression
                );

                break;


            case "placeholder":

                /*
                 * El placeholder representa una expresión
                 * que el usuario todavía no ha completado.
                 *
                 * Es estructuralmente válido, aunque todavía
                 * no sea evaluable matemáticamente.
                 */

                break;

        }

    }


    validateNode(
        expression
    );


    return {

        valid:
            errors.length === 0,

        errors

    };

}