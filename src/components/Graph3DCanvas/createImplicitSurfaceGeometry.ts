import {
    BufferGeometry,
    MeshBasicMaterial
} from "three";

import {
    MarchingCubes
} from "three/examples/jsm/objects/MarchingCubes.js";

import type {
    EvalFunction
} from "mathjs";

import type {
    GraphExpression
} from "../../features/calculator/models/GraphExpression";

import {
    createEvaluationScope
} from "../../features/calculator/math/createEvaluationScope";


export type CompiledImplicitExpression =
    GraphExpression & {

        compiled:
            EvalFunction;

        representation:
            Extract<
                GraphExpression["representation"],
                {
                    kind:
                        "implicit-surface";
                }
            >;

    };


const IMPLICIT_RESOLUTION =
    42;


const IMPLICIT_DOMAIN_SIZE =
    12;


const INVALID_FIELD_VALUE =
    1_000_000;


export function createImplicitSurfaceGeometry(
    expression: CompiledImplicitExpression
): BufferGeometry {

    const temporaryMaterial =
        new MeshBasicMaterial();


    const marchingCubes =
        new MarchingCubes(

            IMPLICIT_RESOLUTION,

            temporaryMaterial,

            false,

            false,

            200_000

        );


    const resolution =
        IMPLICIT_RESOLUTION;


    const halfSize =
        IMPLICIT_DOMAIN_SIZE / 2;


    const lastIndex =
        resolution - 1;


    for (
        let threeZIndex = 0;
        threeZIndex < resolution;
        threeZIndex += 1
    ) {

        const threeZ =
            -halfSize +
            (
                threeZIndex /
                lastIndex
            ) *
            IMPLICIT_DOMAIN_SIZE;


        for (
            let threeYIndex = 0;
            threeYIndex < resolution;
            threeYIndex += 1
        ) {

            const threeY =
                -halfSize +
                (
                    threeYIndex /
                    lastIndex
                ) *
                IMPLICIT_DOMAIN_SIZE;


            for (
                let threeXIndex = 0;
                threeXIndex < resolution;
                threeXIndex += 1
            ) {

                const threeX =
                    -halfSize +
                    (
                        threeXIndex /
                        lastIndex
                    ) *
                    IMPLICIT_DOMAIN_SIZE;


                const mathX =
                    threeX;

                const mathY =
                    threeZ;

                const mathZ =
                    threeY;


                const fieldIndex =

                    threeXIndex +

                    threeYIndex *
                    resolution +

                    threeZIndex *
                    resolution *
                    resolution;


                try {

                    const result =
                        Number(
                            expression.compiled.evaluate(
                                createEvaluationScope({

                                    ...expression.variables,

                                    x:
                                        mathX,

                                    y:
                                        mathY,

                                    z:
                                        mathZ

                                })
                            )
                        );


                    marchingCubes.field[
                        fieldIndex
                    ] =
                        Number.isFinite(result)

                            ? result

                            : INVALID_FIELD_VALUE;

                } catch {

                    marchingCubes.field[
                        fieldIndex
                    ] =
                        INVALID_FIELD_VALUE;

                }

            }

        }

    }


    marchingCubes.isolation =
        expression.representation.isoValue;


    marchingCubes.update();


    const geometry =
        marchingCubes.geometry.clone();


    geometry.scale(
        halfSize,
        halfSize,
        halfSize
    );


    geometry.computeVertexNormals();

    geometry.computeBoundingSphere();


    marchingCubes.geometry.dispose();

    temporaryMaterial.dispose();


    return geometry;

}