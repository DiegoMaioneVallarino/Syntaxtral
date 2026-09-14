import type {

    ExpressionNode,
    ExpressionPath

} from "./types";


export type ExpressionVisitor = (
    expression: ExpressionNode,
    path: ExpressionPath
) => void;


export function getExpressionChildren(
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


        case "factorial":

            return [
                expression.operand
            ];


        case "negation":

            return [
                expression.operand
            ];


        case "function-call":

            return expression.arguments;


        case "group":

            return [
                expression.expression
            ];

    }

}


export function walkExpression(
    expression: ExpressionNode,
    visitor: ExpressionVisitor,
    path: ExpressionPath = []
): void {

    visitor(
        expression,
        path
    );


    const children =
        getExpressionChildren(
            expression
        );


    children.forEach((
        child,
        index
    ) => {

        walkExpression(

            child,

            visitor,

            [
                ...path,
                index
            ]

        );

    });

}