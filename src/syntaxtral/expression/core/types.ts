export type ExpressionNode =
    | NumberNode
    | SymbolNode
    | AdditionNode
    | MultiplicationNode
    | FractionNode
    | PowerNode
    | NegationNode
    | FunctionCallNode
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


export type NegationNode =
    BaseExpressionNode<"negation"> & {

        readonly operand:
            ExpressionNode;

    };


export type FunctionCallNode =
    BaseExpressionNode<"function-call"> & {

        readonly name: string;

        readonly arguments:
            readonly ExpressionNode[];

    };


export type GroupNode =
    BaseExpressionNode<"group"> & {

        readonly expression:
            ExpressionNode;

    };


export type PlaceholderNode =
    BaseExpressionNode<"placeholder"> & {

        readonly label?: string;

    };