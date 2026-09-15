import {
    Fragment
} from "react";

import type {
    MouseEvent as ReactMouseEvent
} from "react";

import "./ExpressionRenderer.css";

import type {
    ExpressionNode
} from "../core";

import {
    expressionToPlainText
} from "../core";


type ExpressionRendererProps = {

    expression:
        ExpressionNode;

    className?:
        string;

    selectedNodeId?:
        string | null;

    onNodeSelect?: (
        node: ExpressionNode
    ) => void;

};


type ExpressionNodeViewProps = {

    node:
        ExpressionNode;

    selectedNodeId?:
        string | null;

    onNodeSelect?: (
        node: ExpressionNode
    ) => void;

};


export function ExpressionRenderer({
    expression,
    className = "",
    selectedNodeId,
    onNodeSelect
}: ExpressionRendererProps) {

    return (
        <span
            className={`
                syntaxtralExpression
                ${className}
            `}
            role="math"
            aria-label={
                expressionToPlainText(
                    expression
                )
            }
        >

            <ExpressionNodeView
                node={expression}
                selectedNodeId={
                    selectedNodeId
                }
                onNodeSelect={
                    onNodeSelect
                }
            />

        </span>
    );

}


function ExpressionNodeView({
    node,
    selectedNodeId,
    onNodeSelect
}: ExpressionNodeViewProps) {

    function handleNodeClick(
        event:
            ReactMouseEvent<HTMLSpanElement>
    ) {

        event.stopPropagation();


        onNodeSelect?.(
            node
        );

    }


    const selected =
        selectedNodeId === node.id;


    return (
        <span
            className={`
                syntaxtralNodeBoundary

                ${
                    onNodeSelect
                        ? "syntaxtralNodeInteractive"
                        : ""
                }

                ${
                    selected
                        ? "syntaxtralNodeSelected"
                        : ""
                }
            `}
            data-expression-node-id={
                node.id
            }
            data-expression-node-type={
                node.type
            }
            onClick={
                onNodeSelect
                    ? handleNodeClick
                    : undefined
            }
        >

            <ExpressionNodeContent
                node={node}
                selectedNodeId={
                    selectedNodeId
                }
                onNodeSelect={
                    onNodeSelect
                }
            />

        </span>
    );

}


function ExpressionNodeContent({
    node,
    selectedNodeId,
    onNodeSelect
}: ExpressionNodeViewProps) {

    function renderChild(
        child: ExpressionNode
    ) {

        return (
            <ExpressionNodeView
                node={child}
                selectedNodeId={
                    selectedNodeId
                }
                onNodeSelect={
                    onNodeSelect
                }
            />
        );

    }


    switch (node.type) {

        case "number":

            return (
                <span className="syntaxtralNumber">
                    {node.value}
                </span>
            );


        case "symbol":

    return (
        <span className="syntaxtralSymbol">

            {
                node.name === "theta"
                    ? "θ"
                    : node.name
            }

        </span>
    );


        case "constant":

            return (
                <span className="syntaxtralConstant">

                    {
                        node.name === "pi"
                            ? "π"
                            : node.name === "infinity"
                                ? "∞"
                                : node.name
                    }

                </span>
            );


        case "addition":

            return (
                <span className="syntaxtralAddition">

                    {node.terms.map((
                        term,
                        index
                    ) => (

                        <Fragment key={term.id}>

                            {index > 0 && (

                                <span className="syntaxtralOperator">
                                    +
                                </span>

                            )}

                            {renderChild(
                                term
                            )}

                        </Fragment>

                    ))}

                </span>
            );


        case "multiplication":

            return (
                <span className="syntaxtralMultiplication">

                    {node.factors.map((
                        factor,
                        index
                    ) => (

                        <Fragment key={factor.id}>

                            {index > 0 && (

                                <span className="syntaxtralMultiplicationSymbol">
                                    ·
                                </span>

                            )}

                            {renderChild(
                                factor
                            )}

                        </Fragment>

                    ))}

                </span>
            );


        case "fraction":

            return (
                <span className="syntaxtralFraction">

                    <span className="syntaxtralNumerator">

                        {renderChild(
                            node.numerator
                        )}

                    </span>

                    <span className="syntaxtralDenominator">

                        {renderChild(
                            node.denominator
                        )}

                    </span>

                </span>
            );


        case "power":

            return (
                <span className="syntaxtralPower">

                    <span className="syntaxtralPowerBase">

                        {renderChild(
                            node.base
                        )}

                    </span>

                    <sup className="syntaxtralExponent">

                        {renderChild(
                            node.exponent
                        )}

                    </sup>

                </span>
            );


        case "factorial":

            return (
                <span className="syntaxtralFactorial">

                    {renderChild(
                        node.operand
                    )}

                    <span className="syntaxtralFactorialSymbol">
                        !
                    </span>

                </span>
            );


        case "negation":

            return (
                <span className="syntaxtralNegation">

                    <span className="syntaxtralOperator">
                        −
                    </span>

                    {renderChild(
                        node.operand
                    )}

                </span>
            );


        case "function-call":

            return (
                <span className="syntaxtralFunction">

                    <span className="syntaxtralFunctionName">
                        {node.name}
                    </span>

                    <span className="syntaxtralParenthesis">
                        (
                    </span>

                    <span className="syntaxtralFunctionArguments">

                        {node.arguments.map((
                            argument,
                            index
                        ) => (

                            <Fragment key={argument.id}>

                                {index > 0 && (

                                    <span className="syntaxtralComma">
                                        ,
                                    </span>

                                )}

                                {renderChild(
                                    argument
                                )}

                            </Fragment>

                        ))}

                    </span>

                    <span className="syntaxtralParenthesis">
                        )
                    </span>

                </span>
            );


        case "group":

            return (
                <span className="syntaxtralGroup">

                    <span className="syntaxtralParenthesis">
                        (
                    </span>

                    {renderChild(
                        node.expression
                    )}

                    <span className="syntaxtralParenthesis">
                        )
                    </span>

                </span>
            );


        case "placeholder":

            return (
                <span
                    className="syntaxtralPlaceholder"
                    title={node.label}
                >
                    {node.label ?? "□"}
                </span>
            );
        case "summation":

    return (
        <span className="syntaxtralSummation">

            <span className="syntaxtralSummationOperator">

                <span className="syntaxtralSummationUpper">
                    {renderChild(
                        node.upperBound
                    )}
                </span>

                <span className="syntaxtralSummationSymbol">
                    ∑
                </span>

                <span className="syntaxtralSummationLower">

                    {renderChild(
                        node.index
                    )}

                    <span className="syntaxtralOperator">
                        =
                    </span>

                    {renderChild(
                        node.lowerBound
                    )}

                </span>

            </span>


            <span className="syntaxtralSummationBody">

                {renderChild(
                    node.body
                )}

            </span>

        </span>
    );

    }

}


export default ExpressionRenderer;