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

export type CompiledInequalityExpression =
    GraphExpression & {
        compiled: EvalFunction;

        representation: Extract<
            GraphExpression["representation"],
            { kind: "inequality-solid" }
        >;
    };

type Point3 = readonly [number, number, number];

type CellFace = {
    direction: Point3;
    corners: readonly [
        Point3,
        Point3,
        Point3,
        Point3
    ];
};

const RESOLUTION = 40;
const DOMAIN_SIZE = 12;

const FACES: readonly CellFace[] = [
    {
        direction: [1, 0, 0],
        corners: [
            [1, 0, 0],
            [1, 1, 0],
            [1, 1, 1],
            [1, 0, 1]
        ]
    },
    {
        direction: [-1, 0, 0],
        corners: [
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ]
    },
    {
        direction: [0, 1, 0],
        corners: [
            [0, 1, 1],
            [1, 1, 1],
            [1, 1, 0],
            [0, 1, 0]
        ]
    },
    {
        direction: [0, -1, 0],
        corners: [
            [0, 0, 0],
            [1, 0, 0],
            [1, 0, 1],
            [0, 0, 1]
        ]
    },
    {
        direction: [0, 0, 1],
        corners: [
            [1, 0, 1],
            [1, 1, 1],
            [0, 1, 1],
            [0, 0, 1]
        ]
    },
    {
        direction: [0, 0, -1],
        corners: [
            [0, 0, 0],
            [0, 1, 0],
            [1, 1, 0],
            [1, 0, 0]
        ]
    }
];

export function createInequalitySolidGeometry(
    expression: CompiledInequalityExpression
): BufferGeometry {
    const resolution = RESOLUTION;
    const halfSize = DOMAIN_SIZE / 2;
    const cellSize = DOMAIN_SIZE / resolution;

    const occupied = new Uint8Array(
        resolution * resolution * resolution
    );

    const { relation, threshold } =
        expression.representation;

    function getIndex(
        x: number,
        y: number,
        z: number
    ): number {
        return (
            x +
            y * resolution +
            z * resolution * resolution
        );
    }

    function satisfies(value: number): boolean {
        switch (relation) {
            case "less":
                return value < threshold;

            case "less-or-equal":
                return value <= threshold;

            case "greater":
                return value > threshold;

            case "greater-or-equal":
                return value >= threshold;
        }
    }

    function isOccupied(
        x: number,
        y: number,
        z: number
    ): boolean {
        if (
            x < 0 || x >= resolution ||
            y < 0 || y >= resolution ||
            z < 0 || z >= resolution
        ) {
            return false;
        }

        return occupied[getIndex(x, y, z)] === 1;
    }

    // Estos índices siguen los ejes de Three.js.
    for (let z = 0; z < resolution; z += 1) {
        for (let y = 0; y < resolution; y += 1) {
            for (let x = 0; x < resolution; x += 1) {
                const threeX =
                    -halfSize + (x + 0.5) * cellSize;

                const threeY =
                    -halfSize + (y + 0.5) * cellSize;

                const threeZ =
                    -halfSize + (z + 0.5) * cellSize;

                try {
                    const result =
                        expression.compiled.evaluate(
                            createEvaluationScope({
                                ...expression.variables,

                                // Math(x,y,z) → Three(x,z,y)
                                x: threeX,
                                y: threeZ,
                                z: threeY
                            })
                        );

                    // Evitamos convertir booleanos en 0 o 1.
                    if (
                        typeof result === "number" &&
                        Number.isFinite(result) &&
                        satisfies(result)
                    ) {
                        occupied[getIndex(x, y, z)] = 1;
                    }
                } catch {
                    // Una evaluación inválida deja la celda vacía.
                }
            }
        }
    }

    const positions: number[] = [];

    for (let z = 0; z < resolution; z += 1) {
        for (let y = 0; y < resolution; y += 1) {
            for (let x = 0; x < resolution; x += 1) {
                if (!isOccupied(x, y, z)) {
                    continue;
                }

                for (const face of FACES) {
                    const [dx, dy, dz] = face.direction;

                    if (isOccupied(x + dx, y + dy, z + dz)) {
                        continue;
                    }

                    const [a, b, c, d] = face.corners;

                    // Dos triángulos por cara.
                    for (const corner of [a, b, c, a, c, d]) {
                        positions.push(
                            -halfSize + (x + corner[0]) * cellSize,
                            -halfSize + (y + corner[1]) * cellSize,
                            -halfSize + (z + corner[2]) * cellSize
                        );
                    }
                }
            }
        }
    }

    const geometry = new BufferGeometry();

    geometry.setAttribute(
        "position",
        new Float32BufferAttribute(positions, 3)
    );

    geometry.setDrawRange(0, positions.length / 3);

    if (positions.length > 0) {
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
    }

    return geometry;
}