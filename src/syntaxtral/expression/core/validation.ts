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


const identifierPattern =
    /^[A-Za-z_][A-Za-z0-9_]*$/;


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

                } else if (
                    !identifierPattern.test(
                        node.name
                    )
                ) {

                    addError(
                        node.id,
                        `"${node.name}" no es un símbolo válido`
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


            case "equality":

                validateNode(
                    node.left
                );

                validateNode(
                    node.right
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

                } else if (
                    !identifierPattern.test(
                        node.name
                    )
                ) {

                    addError(
                        node.id,
                        `"${node.name}" no es un nombre válido de función`
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


            case "function-definition": {

                if (
                    node.name.type !== "symbol"
                ) {

                    addError(
                        node.name.id,
                        "El nombre de la función debe ser un símbolo"
                    );

                }


                validateNode(
                    node.name
                );


                if (
                    node.parameters.length === 0
                ) {

                    addError(
                        node.id,
                        "La función necesita al menos un parámetro"
                    );

                }


                const parameterNames =
                    new Set<string>();


                node.parameters.forEach(
                    parameter => {

                        if (
                            parameter.type !== "symbol"
                        ) {

                            addError(
                                parameter.id,
                                "El parámetro debe ser un símbolo"
                            );

                        } else if (
                            parameterNames.has(
                                parameter.name
                            )
                        ) {

                            addError(
                                parameter.id,
                                `El parámetro "${parameter.name}" está repetido`
                            );

                        } else {

                            parameterNames.add(
                                parameter.name
                            );

                        }


                        validateNode(
                            parameter
                        );

                    }
                );


                validateNode(
                    node.body
                );

                break;

            }
case "projection-region": {
    if (node.constraints.length === 0) {
        addError(
            node.id,
            "La vista necesita al menos una restricción"
        );
    }

    node.constraints.forEach(constraint => {
        if (
            constraint.type !== "comparison" &&
            constraint.type !== "placeholder"
        ) {
            addError(
                constraint.id,
                "Usa una desigualdad para definir la región"
            );
        }

        validateNode(constraint);
    });

    break;
}

case "projection-intersection": {
    const expectedPlanes = ["xy", "yz", "xz"] as const;

    node.regions.forEach((region, index) => {
        if (region.plane !== expectedPlanes[index]) {
            addError(
                region.id,
                "Las vistas deben estar ordenadas como XY, YZ y XZ"
            );
        }

        validateNode(region);
    });

    break;
}
            case "vector":

                if (
                    node.components.length < 2
                ) {

                    addError(
                        node.id,
                        "Un vector necesita al menos dos componentes"
                    );

                }


                node.components.forEach(
                    validateNode
                );

                break;
                
            case "summation":

                if (
                    node.index.type !== "symbol"
                ) {

                    addError(
                        node.index.id,
                        "El índice de la sumatoria debe ser un símbolo"
                    );

                }


                validateNode(
                    node.index
                );

                validateNode(
                    node.lowerBound
                );

                validateNode(
                    node.upperBound
                );

                validateNode(
                    node.body
                );

                break;

case "comparison":

    validateNode(
        node.left
    );

    validateNode(
        node.right
    );

    break;
            case "group":

                validateNode(
                    node.expression
                );

                break;


            case "placeholder":

                /*
                 * Es estructuralmente válido,
                 * aunque todavía no sea evaluable.
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