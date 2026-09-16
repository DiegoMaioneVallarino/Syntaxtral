import type {
    AdditionNode,
    ConstantNode,
    EqualityNode,
    ExpressionNode,
    FactorialNode,
    FractionNode,
    FunctionDefinitionNode,
    FunctionCallNode,
    GroupNode,
    MathematicalConstant,
    MultiplicationNode,
    NegationNode,
    NumberNode,
    PlaceholderNode,
    PowerNode,
    SummationNode,
    SymbolNode
} from "./types";


function createExpressionNodeId(): string {

    return crypto.randomUUID();

}


export function numberNode(
    value: string | number
): NumberNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "number",

        value:
            String(value)

    };

}


export function symbolNode(
    name: string
): SymbolNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "symbol",

        name

    };

}


export function constantNode(
    name: MathematicalConstant
): ConstantNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "constant",

        name

    };

}


export function additionNode(
    terms:
        readonly ExpressionNode[]
): AdditionNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "addition",

        terms

    };

}


export function multiplicationNode(
    factors:
        readonly ExpressionNode[]
): MultiplicationNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "multiplication",

        factors

    };

}

export function summationNode(
    index: ExpressionNode,
    lowerBound: ExpressionNode,
    upperBound: ExpressionNode,
    body: ExpressionNode
): SummationNode {

    return {

        id:
            crypto.randomUUID(),

        type:
            "summation",

        index,
        lowerBound,
        upperBound,
        body

    };

}

export function fractionNode(
    numerator: ExpressionNode,
    denominator: ExpressionNode
): FractionNode {

    return {

        id:
            createExpressionNodeId(),

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
            createExpressionNodeId(),

        type:
            "power",

        base,
        exponent

    };

}


export function factorialNode(
    operand: ExpressionNode
): FactorialNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "factorial",

        operand

    };

}


export function negationNode(
    operand: ExpressionNode
): NegationNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "negation",

        operand

    };

}


export function functionCallNode(
    name: string,
    argumentsList:
        readonly ExpressionNode[]
): FunctionCallNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "function-call",

        name,

        arguments:
            argumentsList

    };

}

export function functionDefinitionNode(
    name: ExpressionNode,
    parameters: readonly ExpressionNode[],
    body: ExpressionNode
): FunctionDefinitionNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "function-definition",

        name,

        parameters,

        body

    };

}

export function equalityNode(
    left: ExpressionNode,
    right: ExpressionNode
): EqualityNode {

    return {

        id:
            createExpressionNodeId(),

        type:
            "equality",

        left,

        right

    };

}
export function groupNode(
    expression: ExpressionNode
): GroupNode {

    return {

        id:
            createExpressionNodeId(),

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
            createExpressionNodeId(),

        type:
            "placeholder",

        ...(
            label !== undefined
                ? { label }
                : {}
        )

    };

}