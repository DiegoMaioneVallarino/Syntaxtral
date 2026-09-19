import {
    compile
} from "mathjs";

import {
    expressionToMathJs,
    validateExpression
} from "../../../syntaxtral/expression";

import type {
    ProjectionIntersectionNode
} from "../../../syntaxtral/expression";

import type {
    GraphExpression
} from "../models/GraphExpression";

import {
    createEvaluationScope
} from "./createEvaluationScope";

type ProjectionGraphData = Pick<
    GraphExpression,
    "expression" | "variables" | "representation"
>;

export function createProjectionGraphData(
    node: ProjectionIntersectionNode,
    variables: Readonly<Record<string, unknown>>
): ProjectionGraphData {
    const validation = validateExpression(node);

    if (!validation.valid) {
        throw new Error(
            validation.errors
                .map(error => error.message)
                .join("; ")
        );
    }

    const regions = node.regions.map(region => {
        const constraints = region.constraints.map(
            constraint => {
                if (constraint.type !== "comparison") {
                    throw new Error(
                        "Completa todas las desigualdades de la vista"
                    );
                }

                return {
                    relation: constraint.relation,

                    left: compile(
                        expressionToMathJs(constraint.left)
                    ),

                    right: compile(
                        expressionToMathJs(constraint.right)
                    )
                };
            }
        );

        return {
            plane: region.plane,
            coordinateSystem: region.coordinateSystem,
            constraints
        };
    });

   function contains(
    x: number,
    y: number,
    z: number
): number {
    if (
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(z)
    ) {
        return Number.NaN;
    }

    let intersectionField = Number.NEGATIVE_INFINITY;

    for (const region of regions) {
        let u: number;
        let v: number;

        const coordinates = {
            x: Number.NaN,
            y: Number.NaN,
            z: Number.NaN
        };

        switch (region.plane) {
            case "xy":
                u = x;
                v = y;
                coordinates.x = x;
                coordinates.y = y;
                break;

            case "yz":
                u = y;
                v = z;
                coordinates.y = y;
                coordinates.z = z;
                break;

            case "xz":
                u = x;
                v = z;
                coordinates.x = x;
                coordinates.z = z;
                break;
        }

        const polar =
            region.coordinateSystem === "polar";

        const scope = createEvaluationScope({
            ...variables,
            ...coordinates,

            rho: polar
                ? Math.hypot(u, v)
                : Number.NaN,

            theta: polar
                ? Math.atan2(v, u)
                : Number.NaN
        });

        for (const constraint of region.constraints) {
            try {
                const left =
                    constraint.left.evaluate(scope);

                const right =
                    constraint.right.evaluate(scope);

                if (
                    typeof left !== "number" ||
                    typeof right !== "number" ||
                    !Number.isFinite(left) ||
                    !Number.isFinite(right)
                ) {
                    return Number.NaN;
                }

                let residual: number;

                switch (constraint.relation) {
                    case "less":
                    case "less-or-equal":
                        residual = left - right;
                        break;

                    case "greater":
                    case "greater-or-equal":
                        residual = right - left;
                        break;
                }

                if (!Number.isFinite(residual)) {
                    return Number.NaN;
                }

                intersectionField = Math.max(
                    intersectionField,
                    residual
                );
            } catch {
                return Number.NaN;
            }
        }
    }

    return Number.isFinite(intersectionField)
        ? intersectionField
        : Number.NaN;
}

    return {
        expression: "syntaxtralProjectionContains(x, y, z)",

        variables: {
            ...variables,
            syntaxtralProjectionContains: contains
        },

        representation: {
            kind: "inequality-solid",
            relation: "less-or-equal",
            threshold: 0
        }
    };
}