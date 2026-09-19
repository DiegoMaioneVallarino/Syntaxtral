import {
    BufferGeometry,
    Float32BufferAttribute,
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

export type CompiledInequalityExpression =
    GraphExpression & {
        compiled: EvalFunction;

        representation: Extract<
            GraphExpression["representation"],
            { kind: "inequality-solid" }
        >;
    };

// Resolución de muestreo, no tamaño de cubos visibles.
const RESOLUTION = 48;

// La región representada sigue siendo [-6, 6]³.
const DOMAIN_HALF_SIZE = 6;

// Espacio adicional para cerrar la malla en los límites.
const SAMPLING_HALF_SIZE = 7.5;

export function createInequalitySolidGeometry(
    expression: CompiledInequalityExpression
): BufferGeometry {
    const material = new MeshBasicMaterial();

    // Hasta cinco triángulos por celda de Marching Cubes.
    const maximumTriangles =
        5 * Math.pow(RESOLUTION - 1, 3);

    const marching = new MarchingCubes(
        RESOLUTION,
        material,
        false,
        false,
        maximumTriangles
    );

    try {
        const { relation, threshold } =
            expression.representation;

        const reverse =
            relation === "greater" ||
            relation === "greater-or-equal";

        for (let iz = 0; iz < RESOLUTION; iz += 1) {
            for (let iy = 0; iy < RESOLUTION; iy += 1) {
                for (let ix = 0; ix < RESOLUTION; ix += 1) {
                    /*
                     * MarchingCubes sitúa sus muestras utilizando
                     * índice / resolución, no índice / (resolución - 1).
                     */
                    const threeX =
                        (2 * ix / RESOLUTION - 1) *
                        SAMPLING_HALF_SIZE;

                    const threeY =
                        (2 * iy / RESOLUTION - 1) *
                        SAMPLING_HALF_SIZE;

                    const threeZ =
                        (2 * iz / RESOLUTION - 1) *
                        SAMPLING_HALF_SIZE;

                    const index =
                        ix +
                        iy * RESOLUTION +
                        iz * RESOLUTION * RESOLUTION;

                    /*
                     * Distancia con signo al límite del dominio:
                     * negativa dentro del cubo y positiva fuera.
                     */
                    const domainField = Math.max(
                        Math.abs(threeX) - DOMAIN_HALF_SIZE,
                        Math.abs(threeY) - DOMAIN_HALF_SIZE,
                        Math.abs(threeZ) - DOMAIN_HALF_SIZE
                    );

                    // Una evaluación inválida se trata como exterior.
                    let signedField = 1;

                    try {
                        const value = expression.compiled.evaluate(
                            createEvaluationScope({
                                ...expression.variables,

                                x: threeX,
                                y: threeZ,
                                z: threeY
                            })
                        );

                        if (
                            typeof value === "number" &&
                            Number.isFinite(value)
                        ) {
                            const residual = reverse
                                ? threshold - value
                                : value - threshold;

                            if (Number.isFinite(residual)) {
                                /*
                                 * Intersección con el cubo de dominio.
                                 * El interior satisface signedField <= 0.
                                 */
                                signedField = Math.max(
                                    residual,
                                    domainField
                                );
                            }
                        }
                    } catch {
                        // Conservamos el valor exterior.
                    }

                    /*
                     * MarchingCubes utiliza valores positivos dentro.
                     * Limitamos solo valores extremos para Float32.
                     */
                    marching.field[index] = -Math.max(
                        -1e20,
                        Math.min(1e20, signedField)
                    );
                }
            }
        }

        marching.isolation = 0;
        marching.update();

        const source = marching.geometry;

        const positions = source.getAttribute("position");
        const normals = source.getAttribute("normal");

        const count = Math.min(
            positions.count,
            Math.max(0, source.drawRange.count)
        );

        const vertexCount = Math.floor(count / 3) * 3;

        const outputPositions =
            new Float32Array(vertexCount * 3);

        const outputNormals =
            new Float32Array(vertexCount * 3);

        for (let index = 0; index < vertexCount; index += 1) {
            const offset = index * 3;

            outputPositions[offset] =
                positions.getX(index) * SAMPLING_HALF_SIZE;

            outputPositions[offset + 1] =
                positions.getY(index) * SAMPLING_HALF_SIZE;

            outputPositions[offset + 2] =
                positions.getZ(index) * SAMPLING_HALF_SIZE;

            /*
             * Conservamos las normales interpoladas del campo.
             * Recalcularlas sobre triángulos sin índices produciría
             * una apariencia facetada.
             */
            outputNormals[offset] = normals.getX(index);
            outputNormals[offset + 1] = normals.getY(index);
            outputNormals[offset + 2] = normals.getZ(index);
        }

        const geometry = new BufferGeometry();

        geometry.setAttribute(
            "position",
            new Float32BufferAttribute(outputPositions, 3)
        );

        geometry.setAttribute(
            "normal",
            new Float32BufferAttribute(outputNormals, 3)
        );

        geometry.setDrawRange(0, vertexCount);

        if (vertexCount > 0) {
            geometry.computeBoundingBox();
            geometry.computeBoundingSphere();
        }

        return geometry;
    } finally {
        marching.geometry.dispose();
        material.dispose();
    }
}