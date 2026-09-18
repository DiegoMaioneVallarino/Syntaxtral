import {
    BufferGeometry,
    Float32BufferAttribute
} from "three";

import type {
    EvalFunction
} from "mathjs";

import type {
    GraphExpression
} from "../../features/calculator/models/GraphExpression";

import {
    createEvaluationScope
} from "../../features/calculator/math/createEvaluationScope";


export type CompiledParametricExpression =
    GraphExpression & {

        compiled:
            EvalFunction;

        representation:
            Extract<
                GraphExpression["representation"],
                {
                    kind:
                        "parametric-surface";
                }
            >;

    };


const PARAMETER_U_SEGMENTS =
    96;


const PARAMETER_V_SEGMENTS =
    48;


const MAXIMUM_COORDINATE =
    10_000;


function getVectorComponents(
    result: unknown
): unknown[] | null {

    if (
        Array.isArray(
            result
        )
    ) {

        return result;

    }


    if (
        typeof result === "object" &&
        result !== null &&
        "toArray" in result
    ) {

        const toArray =
            (
                result as {
                    toArray?:
                        unknown;
                }
            ).toArray;


        if (
            typeof toArray === "function"
        ) {

            const converted =
                (
                    toArray as
                        () => unknown
                ).call(
                    result
                );


            return Array.isArray(converted)
                ? converted
                : null;

        }

    }


    return null;

}


function evaluateParametricPoint(
    expression:
        CompiledParametricExpression,
    parameterU:
        number,
    parameterV:
        number
): [
    number,
    number,
    number
] | null {

    try {

        const result =
            expression.compiled.evaluate(
                createEvaluationScope({

                    ...expression.variables,

                    [
                        expression.representation
                            .parameterU
                    ]:
                        parameterU,

                    [
                        expression.representation
                            .parameterV
                    ]:
                        parameterV

                })
            );


        const components =
            getVectorComponents(
                result
            );


        if (
            !components ||
            components.length < 3
        ) {

            return null;

        }


        const mathX =
            Number(
                components[0]
            );

        const mathY =
            Number(
                components[1]
            );

        const mathZ =
            Number(
                components[2]
            );


        if (
            !Number.isFinite(mathX) ||
            !Number.isFinite(mathY) ||
            !Number.isFinite(mathZ)
        ) {

            return null;

        }


        if (
            Math.abs(mathX) >
                MAXIMUM_COORDINATE ||
            Math.abs(mathY) >
                MAXIMUM_COORDINATE ||
            Math.abs(mathZ) >
                MAXIMUM_COORDINATE
        ) {

            return null;

        }


        /*
         * Conversión al sistema de Three.js:
         *
         * Three X = Math X
         * Three Y = Math Z
         * Three Z = Math Y
         */
        return [
            mathX,
            mathZ,
            mathY
        ];

    } catch {

        return null;

    }

}


export function createParametricSurfaceGeometry(
    expression:
        CompiledParametricExpression
): BufferGeometry {

    const geometry =
        new BufferGeometry();


    const positions:
        number[] = [];


    const indices:
        number[] = [];


    const validPoints:
        boolean[] = [];


    const pointsPerRow =
        PARAMETER_U_SEGMENTS + 1;


    const {
        minimumU,
        maximumU,
        minimumV,
        maximumV
    } =
        expression.representation;


    for (
        let vIndex = 0;
        vIndex <= PARAMETER_V_SEGMENTS;
        vIndex += 1
    ) {

        const vProgress =

            vIndex /
            PARAMETER_V_SEGMENTS;


        const parameterV =

            minimumV +

            (
                maximumV -
                minimumV
            ) *

            vProgress;


        for (
            let uIndex = 0;
            uIndex <= PARAMETER_U_SEGMENTS;
            uIndex += 1
        ) {

            const uProgress =

                uIndex /
                PARAMETER_U_SEGMENTS;


            const parameterU =

                minimumU +

                (
                    maximumU -
                    minimumU
                ) *

                uProgress;


            const point =
                evaluateParametricPoint(

                    expression,

                    parameterU,

                    parameterV

                );


            if (point) {

                positions.push(
                    point[0],
                    point[1],
                    point[2]
                );

                validPoints.push(
                    true
                );

            } else {

                positions.push(
                    0,
                    0,
                    0
                );

                validPoints.push(
                    false
                );

            }

        }

    }


    for (
        let vIndex = 0;
        vIndex < PARAMETER_V_SEGMENTS;
        vIndex += 1
    ) {

        for (
            let uIndex = 0;
            uIndex < PARAMETER_U_SEGMENTS;
            uIndex += 1
        ) {

            const topLeft =

                vIndex *
                pointsPerRow +
                uIndex;


            const topRight =
                topLeft + 1;


            const bottomLeft =
                topLeft +
                pointsPerRow;


            const bottomRight =
                bottomLeft + 1;


            if (
                validPoints[topLeft] &&
                validPoints[bottomLeft] &&
                validPoints[topRight]
            ) {

                indices.push(
                    topLeft,
                    bottomLeft,
                    topRight
                );

            }


            if (
                validPoints[topRight] &&
                validPoints[bottomLeft] &&
                validPoints[bottomRight]
            ) {

                indices.push(
                    topRight,
                    bottomLeft,
                    bottomRight
                );

            }

        }

    }


    geometry.setAttribute(

        "position",

        new Float32BufferAttribute(
            positions,
            3
        )

    );


    geometry.setIndex(
        indices
    );


    geometry.computeVertexNormals();

    geometry.computeBoundingSphere();


    return geometry;

}