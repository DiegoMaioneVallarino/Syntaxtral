import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Canvas
} from "@react-three/fiber";

import type {
    ThreeEvent
} from "@react-three/fiber";

import {
    Html,
    OrbitControls
} from "@react-three/drei";

import {
    BufferGeometry,
    DoubleSide,
    Float32BufferAttribute
} from "three";

import {
    compile
} from "mathjs";

import "./Graph3DCanvas.css";

import type {
    GraphExpression
} from "../../features/calculator/models/GraphExpression";


type Graph3DCanvasProps = {

    expressions:
        GraphExpression[];

};


type CompiledSurfaceExpression =
    GraphExpression & {

        compiled:
            ReturnType<typeof compile>;

    };


type SelectedSurfacePoint = {

    expression:
        string;

    color:
        string;

    x:
        number;

    y:
        number;

    z:
        number;

};


type FunctionSurfaceProps = {

    expression:
        CompiledSurfaceExpression;

    onSelect: (
        point: SelectedSurfacePoint
    ) => void;

};


const SURFACE_SIZE =
    20;


const SURFACE_RESOLUTION =
    70;


const MAXIMUM_HEIGHT =
    30;


function normalizeExpression(
    expression: string
): string {

    const equalIndex =
        expression.indexOf("=");


    if (equalIndex === -1) {

        return expression;

    }


    return expression.slice(
        equalIndex + 1
    );

}


function Graph3DCanvas({
    expressions
}: Graph3DCanvasProps) {

    const [
        selectedPoint,
        setSelectedPoint
    ] = useState<SelectedSurfacePoint | null>(
        null
    );


    const compiledExpressions =
        useMemo<CompiledSurfaceExpression[]>(() => {

            return expressions.flatMap(
                expression => {

                    if (
                        !expression.visible ||
                        expression.expression
                            .trim()
                            .length === 0
                    ) {

                        return [];

                    }


                    try {

                        const normalized =
                            normalizeExpression(
                                expression.expression
                            );


                        return [
                            {
                                ...expression,

                                compiled:
                                    compile(
                                        normalized
                                    )
                            }
                        ];

                    } catch {

                        return [];

                    }

                }
            );

        }, [expressions]);


    useEffect(() => {

        setSelectedPoint(
            null
        );

    }, [expressions]);


    return (
        <div className="graph3DCanvasContainer">

            <Canvas
                camera={{

                    position:
                        [
                            12,
                            10,
                            12
                        ],

                    fov:
                        45,

                    near:
                        0.1,

                    far:
                        1000

                }}
                dpr={[
                    1,
                    2
                ]}
                onPointerMissed={() => {

                    setSelectedPoint(
                        null
                    );

                }}
            >

                <color
                    attach="background"
                    args={[
                        "#07080b"
                    ]}
                />


                <fog
                    attach="fog"
                    args={[
                        "#07080b",
                        22,
                        52
                    ]}
                />


                <ambientLight
                    intensity={0.75}
                />


                <directionalLight
                    position={[
                        7,
                        14,
                        8
                    ]}
                    intensity={1.7}
                />


                <directionalLight
                    position={[
                        -8,
                        4,
                        -6
                    ]}
                    intensity={0.7}
                    color="#8b5cf6"
                />


                <gridHelper
                    args={[
                        24,
                        24,
                        "#7252a3",
                        "#252630"
                    ]}
                />


                <axesHelper
                    args={[
                        6
                    ]}
                />


                {compiledExpressions.map(
                    expression => (

                        <FunctionSurface
                            key={
                                expression.id
                            }
                            expression={
                                expression
                            }
                            onSelect={
                                setSelectedPoint
                            }
                        />

                    )
                )}


                {selectedPoint && (

                    <SelectedPointMarker
                        point={
                            selectedPoint
                        }
                    />

                )}


                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={4}
                    maxDistance={55}
                    maxPolarAngle={
                        Math.PI * 0.95
                    }
                />

            </Canvas>


            <div className="graph3DInstructions">

                Arrastra para girar

                <span>
                    ·
                </span>

                Rueda para acercar

                <span>
                    ·
                </span>

                Clic para seleccionar

            </div>


            <div className="graph3DAxisLegend">

                <span className="graph3DAxisX">
                    X
                </span>

                <span className="graph3DAxisY">
                    Y
                </span>

                <span className="graph3DAxisZ">
                    Z
                </span>

            </div>

        </div>
    );

}


function FunctionSurface({
    expression,
    onSelect
}: FunctionSurfaceProps) {

    const geometry =
        useMemo(() => {

            return createSurfaceGeometry(
                expression.compiled
            );

        }, [expression.compiled]);


    useEffect(() => {

        return () => {

            geometry.dispose();

        };

    }, [geometry]);


    function handleSurfaceClick(
        event:
            ThreeEvent<MouseEvent>
    ): void {

        event.stopPropagation();


        onSelect({

            expression:
                expression.expression,

            color:
                expression.color,

            x:
                event.point.x,

            y:
                event.point.z,

            z:
                event.point.y

        });

    }


    return (
        <mesh
            geometry={geometry}
            onClick={handleSurfaceClick}
        >

            <meshStandardMaterial
                color={
                    expression.color
                }
                side={
                    DoubleSide
                }
                transparent
                opacity={0.76}
                roughness={0.52}
                metalness={0.08}
                wireframe={false}
            />

        </mesh>
    );

}


function createSurfaceGeometry(
    compiled:
        ReturnType<typeof compile>
): BufferGeometry {

    const geometry =
        new BufferGeometry();


    const positions:
        number[] = [];


    const indices:
        number[] = [];


    const validPoints:
        boolean[] = [];


    const halfSize =
        SURFACE_SIZE / 2;


    const pointsPerSide =
        SURFACE_RESOLUTION + 1;


    for (
        let row = 0;
        row <= SURFACE_RESOLUTION;
        row += 1
    ) {

        const y =

            -halfSize +

            (
                row /
                SURFACE_RESOLUTION
            ) *

            SURFACE_SIZE;


        for (
            let column = 0;
            column <= SURFACE_RESOLUTION;
            column += 1
        ) {

            const x =

                -halfSize +

                (
                    column /
                    SURFACE_RESOLUTION
                ) *

                SURFACE_SIZE;


            let z =
                0;


            let valid =
                false;


            try {

                const result =
                    compiled.evaluate({
                        x,
                        y
                    });


                const numericResult =
                    Number(result);


                if (
                    Number.isFinite(
                        numericResult
                    ) &&
                    Math.abs(
                        numericResult
                    ) <= MAXIMUM_HEIGHT
                ) {

                    z =
                        numericResult;

                    valid =
                        true;

                }

            } catch {

                valid =
                    false;

            }


            /*
             * Three.js usa Y como eje vertical.
             *
             * Matemáticamente tenemos:
             *
             * x = horizontal
             * y = profundidad
             * z = altura
             *
             * Por eso guardamos:
             *
             * [x, z, y]
             */

            positions.push(
                x,
                z,
                y
            );


            validPoints.push(
                valid
            );

        }

    }


    for (
        let row = 0;
        row < SURFACE_RESOLUTION;
        row += 1
    ) {

        for (
            let column = 0;
            column < SURFACE_RESOLUTION;
            column += 1
        ) {

            const topLeft =

                row *
                pointsPerSide +
                column;


            const topRight =
                topLeft + 1;


            const bottomLeft =
                topLeft +
                pointsPerSide;


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


    return geometry;

}


function SelectedPointMarker({
    point
}: {
    point: SelectedSurfacePoint;
}) {

    return (
        <group
            position={[

                point.x,
                point.z,
                point.y

            ]}
        >

            <mesh>

                <sphereGeometry
                    args={[
                        0.12,
                        20,
                        20
                    ]}
                />

                <meshBasicMaterial
                    color="#ffffff"
                />

            </mesh>


            <Html
                center
                position={[
                    0,
                    0.8,
                    0
                ]}
                distanceFactor={8}
            >

                <div
                    className="graph3DPointTooltip"
                    style={{
                        borderColor:
                            point.color
                    }}
                >

                    <strong
                        style={{
                            color:
                                point.color
                        }}
                    >
                        {normalizeExpression(
                            point.expression
                        )}
                    </strong>

                    <span>
                        x = {
                            formatNumber(
                                point.x
                            )
                        }
                    </span>

                    <span>
                        y = {
                            formatNumber(
                                point.y
                            )
                        }
                    </span>

                    <span>
                        z = {
                            formatNumber(
                                point.z
                            )
                        }
                    </span>

                </div>

            </Html>

        </group>
    );

}


function formatNumber(
    value: number
): string {

    if (
        Math.abs(value) >= 10000 ||
        (
            Math.abs(value) > 0 &&
            Math.abs(value) < 0.0001
        )
    ) {

        return value.toExponential(4);

    }


    return Number(
        value.toFixed(5)
    ).toString();

}


export default Graph3DCanvas;