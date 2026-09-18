export type ExpressionNode =
    | NumberNode
    | SymbolNode
    | ConstantNode
    | AdditionNode
    | MultiplicationNode
    | FractionNode
    | PowerNode
    | FactorialNode
    | SummationNode
    | NegationNode
    | EqualityNode
    | FunctionCallNode
    | FunctionDefinitionNode
    | VectorNode
    | GroupNode
    | PlaceholderNode;

export type ExpressionNodeType =
    ExpressionNode["type"];


export type ExpressionPath =
    Array<
        string |
        number
    >;


export type BaseExpressionNode<
    Type extends string
> = {

    readonly id: string;

    readonly type: Type;

};


export type NumberNode =
    BaseExpressionNode<"number"> & {

        readonly value: string;

    };


export type SymbolNode =
    BaseExpressionNode<"symbol"> & {

        readonly name: string;

    };
export type SummationNode =
    BaseExpressionNode<"summation"> & {

        readonly index:
            ExpressionNode;

        readonly lowerBound:
            ExpressionNode;

        readonly upperBound:
            ExpressionNode;

        readonly body:
            ExpressionNode;

    };

export type MathematicalConstant =
    | "pi"
    | "e"
    | "i"
    | "infinity";


export type ConstantNode =
    BaseExpressionNode<"constant"> & {

        readonly name:
            MathematicalConstant;

    };


export type AdditionNode =
    BaseExpressionNode<"addition"> & {

        readonly terms:
            readonly ExpressionNode[];

    };


export type MultiplicationNode =
    BaseExpressionNode<"multiplication"> & {

        readonly factors:
            readonly ExpressionNode[];

    };


export type FractionNode =
    BaseExpressionNode<"fraction"> & {

        readonly numerator:
            ExpressionNode;

        readonly denominator:
            ExpressionNode;

    };


export type PowerNode =
    BaseExpressionNode<"power"> & {

        readonly base:
            ExpressionNode;

        readonly exponent:
            ExpressionNode;

    };


export type FactorialNode =
    BaseExpressionNode<"factorial"> & {

        readonly operand:
            ExpressionNode;

    };


export type NegationNode =
    BaseExpressionNode<"negation"> & {

        readonly operand:
            ExpressionNode;

    };
export type EqualityNode =
    BaseExpressionNode<"equality"> & {

        readonly left:
            ExpressionNode;

        readonly right:
            ExpressionNode;

    };

export type FunctionCallNode =
    BaseExpressionNode<"function-call"> & {

        readonly name:
            string;

        readonly arguments:
            readonly ExpressionNode[];

    };

export type FunctionDefinitionNode =
    BaseExpressionNode<"function-definition"> & {

        readonly name:
            ExpressionNode;

        readonly parameters:
            readonly ExpressionNode[];

        readonly body:
            ExpressionNode;

    };
export type VectorNode =
    BaseExpressionNode<"vector"> & {

        readonly components:
            readonly ExpressionNode[];

    };
export type GroupNode =
    BaseExpressionNode<"group"> & {

        readonly expression:
            ExpressionNode;

    };


export type PlaceholderNode =
    BaseExpressionNode<"placeholder"> & {

        readonly label?:
            string;

    };