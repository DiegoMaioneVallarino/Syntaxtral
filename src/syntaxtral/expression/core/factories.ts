import type {
    AdditionNode,
    ExpressionNode,
    FractionNode,
    FunctionCallNode,
    GroupNode,
    MultiplicationNode,
    NegationNode,
    NumberNode,
    PlaceholderNode,
    PowerNode,
    SymbolNode
} from "./types";


function createExpressionId(): string {

    return crypto.randomUUID();

}


export function numberNode(
    value: string | number
): NumberNode {

    return {

        id:
            createExpressionId(),

        type:
            "number",

        value:
            value.toString()

    };

}


export function symbolNode(
    name: string
): SymbolNode {

    return {

        id:
            createExpressionId(),

        type:
            "symbol",

        name

    };

}


export function additionNode(
    terms: ExpressionNode[]
): AdditionNode {

    return {

        id:
            createExpressionId(),

        type:
            "addition",

        terms

    };

}


export function multiplicationNode(
    factors: ExpressionNode[]
): MultiplicationNode {

    return {

        id:
            createExpressionId(),

        type:
            "multiplication",

        factors

    };

}


export function fractionNode(
    numerator: ExpressionNode,
    denominator: ExpressionNode
): FractionNode {

    return {

        id:
            createExpressionId(),

        type:
            "fraction",

        numerator,
        denominator

    };

}


export function powerNode(
    base: ExpressionNode,
    exponent: ExpressionNode
): PowerNode {

    return {

        id:
            createExpressionId(),

        type:
            "power",

        base,
        exponent

    };

}


export function negationNode(
    operand: ExpressionNode
): NegationNode {

    return {

        id:
            createExpressionId(),

        type:
            "negation",

        operand

    };

}


export function functionCallNode(
    name: string,
    argumentsList: ExpressionNode[]
): FunctionCallNode {

    return {

        id:
            createExpressionId(),

        type:
            "function-call",

        name,

        arguments:
            argumentsList

    };

}


export function groupNode(
    expression: ExpressionNode
): GroupNode {

    return {

        id:
            createExpressionId(),

        type:
            "group",

        expression

    };

}


export function placeholderNode(
    label?: string
): PlaceholderNode {

    return {

        id:
            createExpressionId(),

        type:
            "placeholder",

        label

    };

}