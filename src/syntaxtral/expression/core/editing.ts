import type {

    ExpressionNode

} from "./types";


export function findExpressionNodeById(
    expression: ExpressionNode,
    nodeId: string
): ExpressionNode | null {

    if (
        expression.id === nodeId
    ) {

        return expression;

    }


    for (
        const child
        of getChildren(expression)
    ) {

        const found =
            findExpressionNodeById(

                child,
                nodeId

            );


        if (found) {

            return found;

        }

    }


    return null;

}


export function replaceExpressionNodeById(
    expression: ExpressionNode,
    nodeId: string,
    replacement: ExpressionNode
): ExpressionNode {

    if (
        expression.id === nodeId
    ) {

        return replacement;

    }


    switch (expression.type) {

        case "number":
        case "symbol":
        case "constant":
        case "placeholder":

            return expression;


        case "addition":

            return {

                ...expression,

                terms:
                    expression.terms.map(
                        term => (
                            replaceExpressionNodeById(

                                term,
                                nodeId,
                                replacement

                            )
                        )
                    )

            };


        case "multiplication":

            return {

                ...expression,

                factors:
                    expression.factors.map(
                        factor => (
                            replaceExpressionNodeById(

                                factor,
                                nodeId,
                                replacement

                            )
                        )
                    )

            };

case "vector":

    return {
        ...expression,

        components:
            expression.components.map(
                component =>
                    replaceExpressionNodeById(
                        component,
                        nodeId,
                        replacement
                    )
            )
    };
        case "fraction":

            return {

                ...expression,

                numerator:
                    replaceExpressionNodeById(

                        expression.numerator,
                        nodeId,
                        replacement

                    ),

                denominator:
                    replaceExpressionNodeById(

                        expression.denominator,
                        nodeId,
                        replacement

                    )

            };


        case "power":

            return {

                ...expression,

                base:
                    replaceExpressionNodeById(

                        expression.base,
                        nodeId,
                        replacement

                    ),

                exponent:
                    replaceExpressionNodeById(

                        expression.exponent,
                        nodeId,
                        replacement

                    )

            };


        case "factorial":

            return {

                ...expression,

                operand:
                    replaceExpressionNodeById(

                        expression.operand,
                        nodeId,
                        replacement

                    )

            };


        case "negation":

            return {

                ...expression,

                operand:
                    replaceExpressionNodeById(

                        expression.operand,
                        nodeId,
                        replacement

                    )

            };
case "equality":

    return {

        ...expression,

        left:
            replaceExpressionNodeById(
                expression.left,
                nodeId,
                replacement
            ),

        right:
            replaceExpressionNodeById(
                expression.right,
                nodeId,
                replacement
            )

    };


case "function-definition":

    return {

        ...expression,

        name:
            replaceExpressionNodeById(
                expression.name,
                nodeId,
                replacement
            ),

        parameters:
            expression.parameters.map(
                parameter =>
                    replaceExpressionNodeById(
                        parameter,
                        nodeId,
                        replacement
                    )
            ),

        body:
            replaceExpressionNodeById(
                expression.body,
                nodeId,
                replacement
            )

    };

        case "function-call":

            return {

                ...expression,

                arguments:
                    expression.arguments.map(
                        argument => (
                            replaceExpressionNodeById(

                                argument,
                                nodeId,
                                replacement

                            )
                        )
                    )

            };
        case "vector":

            return {

                ...expression,

                components:
                    expression.components.map(
                        component =>
                            replaceExpressionNodeById(
                                component,
                                nodeId,
                                replacement
                            )
                    )

            };

        case "group":

            return {

                ...expression,

                expression:
                    replaceExpressionNodeById(

                        expression.expression,
                        nodeId,
                        replacement

                    )

            };
        case "summation":

    return {

        ...expression,

        index:
            replaceExpressionNodeById(
                expression.index,
                nodeId,
                replacement
            ),

        lowerBound:
            replaceExpressionNodeById(
                expression.lowerBound,
                nodeId,
                replacement
            ),

        upperBound:
            replaceExpressionNodeById(
                expression.upperBound,
                nodeId,
                replacement
            ),

        body:
            replaceExpressionNodeById(
                expression.body,
                nodeId,
                replacement
            )

    };

    }

}


function getChildren(
    expression: ExpressionNode
): readonly ExpressionNode[] {

    switch (expression.type) {

        case "number":
        case "symbol":
        case "constant":
        case "placeholder":

            return [];


        case "addition":

            return expression.terms;


        case "multiplication":

            return expression.factors;


        case "fraction":

            return [

                expression.numerator,
                expression.denominator

            ];


        case "power":

            return [

                expression.base,
                expression.exponent

            ];

        case "vector":

            return expression.components;
        case "factorial":

            return [
                expression.operand
            ];


        case "negation":

            return [
                expression.operand
            ];
        case "equality":

            return [
                expression.left,
                expression.right
            ];


        case "function-definition":

            return [
                expression.name,
                ...expression.parameters,
                expression.body
            ];
        case "vector":

    return expression.components;
        case "function-call":

            return expression.arguments;


        case "group":

            return [
                expression.expression
            ];
        case "summation":

            return [
                expression.index,
                expression.lowerBound,
                expression.upperBound,
                expression.body
             ];
case "equality":

    return [
        expression.left,
        expression.right
    ];


case "function-definition":

    return [
        expression.name,
        ...expression.parameters,
        expression.body
    ];


case "function-call":

    return expression.arguments;


case "vector":

    return expression.components;


case "group":

    return [
        expression.expression
    ];


case "summation":

    return [
        expression.index,
        expression.lowerBound,
        expression.upperBound,
        expression.body
    ];
    }

}