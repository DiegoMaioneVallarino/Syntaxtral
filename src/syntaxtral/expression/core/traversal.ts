import type {
    ExpressionNode,
    ExpressionPath
} from "./types";


export type ExpressionVisitor = (
    node: ExpressionNode,
    path: ExpressionPath
) => void;


export function getExpressionChildren(
    node: ExpressionNode
): ExpressionNode[] {

    switch (node.type) {

        case "number":
        case "symbol":
        case "placeholder":

            return [];


        case "addition":

            return [
                ...node.terms
            ];


        case "multiplication":

            return [
                ...node.factors
            ];


        case "fraction":

            return [
                node.numerator,
                node.denominator
            ];


        case "power":

            return [
                node.base,
                node.exponent
            ];


        case "negation":

            return [
                node.operand
            ];


        case "function-call":

            return [
                ...node.arguments
            ];


        case "group":

            return [
                node.expression
            ];

    }

}


export function walkExpression(
    node: ExpressionNode,
    visitor: ExpressionVisitor,
    path: ExpressionPath = []
): void {

    visitor(
        node,
        path
    );


    switch (node.type) {

        case "number":
        case "symbol":
        case "placeholder":

            return;


        case "addition":

            node.terms.forEach((
                term,
                index
            ) => {

                walkExpression(

                    term,

                    visitor,

                    [
                        ...path,
                        "terms",
                        index
                    ]

                );

            });

            return;


        case "multiplication":

            node.factors.forEach((
                factor,
                index
            ) => {

                walkExpression(

                    factor,

                    visitor,

                    [
                        ...path,
                        "factors",
                        index
                    ]

                );

            });

            return;


        case "fraction":

            walkExpression(

                node.numerator,

                visitor,

                [
                    ...path,
                    "numerator"
                ]

            );


            walkExpression(

                node.denominator,

                visitor,

                [
                    ...path,
                    "denominator"
                ]

            );

            return;


        case "power":

            walkExpression(

                node.base,

                visitor,

                [
                    ...path,
                    "base"
                ]

            );


            walkExpression(

                node.exponent,

                visitor,

                [
                    ...path,
                    "exponent"
                ]

            );

            return;


        case "negation":

            walkExpression(

                node.operand,

                visitor,

                [
                    ...path,
                    "operand"
                ]

            );

            return;


        case "function-call":

            node.arguments.forEach((
                argument,
                index
            ) => {

                walkExpression(

                    argument,

                    visitor,

                    [
                        ...path,
                        "arguments",
                        index
                    ]

                );

            });

            return;


        case "group":

            walkExpression(

                node.expression,

                visitor,

                [
                    ...path,
                    "expression"
                ]

            );

            return;

    }

}