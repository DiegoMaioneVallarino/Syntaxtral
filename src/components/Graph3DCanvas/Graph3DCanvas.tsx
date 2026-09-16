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
    Line,
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

import type {
    EvalFunction
} from "mathjs";

import "./Graph3DCanvas.css";

import type {
    GraphExpression
} from "../../features/calculator/models/GraphExpression";

import {
    createEvaluationScope
} from "../../features/calculator/math/createEvaluationScope";
type Graph3DCanvasProps = {

    expressions:
        GraphExpression[];


};


type CompiledSurfaceExpression =
    GraphExpression & {

        compiled:
            EvalFunction;

    };



type HoveredCord = {
    expressionId: string;
    frameIndex: number;
};


type ActiveGraphPoint = {
  
   
    expressionId:
        string;

    color:
        string;

    x:
        number;

    y:
        number;

    z:
        number;

    frameIndex?:
        number;

};


type FunctionCordProps = {

    expression:
        CompiledSurfaceExpression;

    frameIndex:
        number;

    frameY:
        number;

    hovered:
        boolean;

    onHover: (
        cord: HoveredCord,
        point: ActiveGraphPoint
    ) => void;

};

type SurfaceGuideCordProps = {

    expression:
        CompiledSurfaceExpression;

    frameY:
        number;

};
type FunctionSurfaceProps = {

    expression:
        CompiledSurfaceExpression;

    onHover: (
        point: ActiveGraphPoint
    ) => void;

};


const GRAPH_SIZE =
    20;

    const SURFACE_GUIDE_COUNT =
    33;


const SURFACE_GUIDE_POSITIONS =
    Array.from(
        {
            length:
                SURFACE_GUIDE_COUNT
        },
        (_, index) => {

            const halfSize =
                GRAPH_SIZE / 2;


            return (

                -halfSize +

                (
                    index /
                    (
                        SURFACE_GUIDE_COUNT -
                        1
                    )
                ) *

                GRAPH_SIZE

            );

        }
    );

const CURVE_SAMPLES =
    320;


const SURFACE_RESOLUTION =
    70;


const MAXIMUM_HEIGHT =
    30;


function normalizeExpression(
    expression: string
): string {

    const equalIndex =
        expression.indexOf("=");

    return equalIndex === -1
        ? expression
        : expression.slice(
            equalIndex + 1
        );

}


function Graph3DCanvas({
    expressions,

}: Graph3DCanvasProps) {




    const [
        hoveredCord,
        setHoveredCord
    ] = useState<HoveredCord | null>(
        null
    );


    const [
        activePoint,
        setActivePoint
    ] = useState<ActiveGraphPoint | null>(
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

                        return [
                            {
                                ...expression,

                                compiled:
                                    compile(
                                        normalizeExpression(
                                            expression.expression
                                        )
                                    )
                            }
                        ];

                    } catch {

                        return [];

                    }

                }
            );

        }, [expressions]);

const flatExpressions =
    useMemo(() => {

        return compiledExpressions.filter(
            expression =>
                !expression.is3D
        );

    }, [compiledExpressions]);


const surfaceExpressions =
    useMemo(() => {

        return compiledExpressions.filter(
            expression =>
                expression.is3D
        );

    }, [compiledExpressions]);


const selectedContinuousExpression =

    activePoint

        ? surfaceExpressions.find(
            expression =>
                expression.id ===
                activePoint.expressionId
        ) ?? null

        : null;

useEffect(() => {

    setHoveredCord(
        null
    );

    setActivePoint(
        null
    );

}, [expressions]);


    function clearHover(): void {

        setHoveredCord(
            null
        );

        setActivePoint(
            null
        );

    }
function handleCordHover(
    cord: HoveredCord,
    point: ActiveGraphPoint
): void {

    setHoveredCord(
        cord
    );

    setActivePoint(
        point
    );

}
useEffect(() => {

    function handleKeyDown(
        event: KeyboardEvent
    ): void {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        setHoveredCord(
            null
        );

        setActivePoint(
            null
        );

    }


    window.addEventListener(
        "keydown",
        handleKeyDown
    );


    return () => {

        window.removeEventListener(
            "keydown",
            handleKeyDown
        );

    };

}, []);
    return (
        <div className="graph3DCanvasContainer">

            <Canvas
                camera={{
                    position: [
                        12,
                        10,
                        12
                    ],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                }}
                dpr={[
                    1,
                    2
                ]}
                onPointerMissed={event => {

    /*
     * Solo desbloqueamos con un clic vacío.
     * Un arrastre de cámara no lo elimina.
     */

    if (
        event.type === "click"
    ) {

        clearHover();

    }

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
                        24,
                        54
                    ]}
                />


                <ambientLight
                    intensity={0.8}
                />


                <directionalLight
                    position={[
                        7,
                        14,
                        8
                    ]}
                    intensity={1.6}
                />


                <directionalLight
                    position={[
                        -8,
                        5,
                        -7
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

{/* Funciones configuradas como 2D */}
{flatExpressions.map((
    expression,
    index
) => (

    <FunctionCord
        key={
            `flat-${expression.id}`
        }
        expression={
            expression
        }
        frameIndex={
            index
        }
        frameY={0}
        hovered={
            hoveredCord?.expressionId ===
                expression.id &&
            hoveredCord.frameIndex ===
                index
        }
        onHover={
            handleCordHover
        }
    />

))}


{/* Funciones configuradas como 3D */}
{surfaceExpressions.map(
    expression => (

        <FunctionSurface
            key={
                `surface-${expression.id}`
            }
            expression={
                expression
            }
            onHover={
                setActivePoint
            }
        />

    )
)}


{/* 33 slices guía para cada superficie */}
{surfaceExpressions.flatMap(
    expression => (

        SURFACE_GUIDE_POSITIONS.map((
            frameY,
            frameIndex
        ) => (

            <SurfaceGuideCord
                key={
                    `guide-${expression.id}-${frameIndex}`
                }
                expression={
                    expression
                }
                frameY={
                    frameY
                }
            />

        ))

    )
)}


{/* Slice seleccionado sobre la superficie */}
{activePoint &&
    selectedContinuousExpression && (

    <FunctionCord
        expression={
            selectedContinuousExpression
        }
        frameIndex={0}
        frameY={
            activePoint.y
        }
        hovered
        onHover={(
            _cord,
            point
        ) => {

            setActivePoint(
                point
            );

        }}
    />

)}
                
                {activePoint && (

                   <ActivePointMarker
                    point={
                            activePoint
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

                <span>·</span>

                Rueda para acercar

                <span>·</span>

                Pasa sobre una cuerda

            </div>

        </div>
    );

}


function FunctionCord({
    expression,
    frameIndex,
    frameY,
    hovered,
    onHover
}: FunctionCordProps) {

    const segments =
    useMemo(() => {

        return createCurveSegments(
            expression,
            frameY
        );

    }, [
        expression.compiled,
        expression.coordinateSystem,
        expression.variables,
        frameY
    ]);

    function selectPoint(
        event: ThreeEvent<MouseEvent>
    ): void {

        event.stopPropagation();

        onHover(
            {
                expressionId:
                    expression.id,

                frameIndex
            },
            {
                expressionId:
                    expression.id,

                color:
                    expression.color,

                x:
                    event.point.x,

                y:
                    frameY,

                z:
                    event.point.y,

                frameIndex
            }
        );

    }


    return (
        <group>

            {segments.map((
                points,
                segmentIndex
            ) => (

                <Line
                    key={segmentIndex}
                    points={points}
                    color={
                        hovered
                            ? "#ffffff"
                            : expression.color
                    }
                    lineWidth={
                        hovered
                            ? 1.2
                            : 1
                    }
                    transparent
                    opacity={
                        hovered
                            ? 1
                            : 0.78
                    }

                    /*
                     * La cuerda seleccionada siempre se
                     * dibuja encima de la superficie.
                     */
                    depthTest={
                        !hovered
                    }
                    renderOrder={
                        hovered
                            ? 20
                            : 2
                    }
                    onClick={
                        selectPoint
                    }
                    onPointerMove={event => {

                        /*
                         * Solamente recorremos la cuerda
                         * que ya está seleccionada.
                         */
                        if (!hovered) {
                            return;
                        }

                        selectPoint(
                            event
                        );

                    }}
                />

            ))}

        </group>
    );

}

function SurfaceGuideCord({
    expression,
    frameY
}: SurfaceGuideCordProps) {

    const segments =
    useMemo(() => {

        return createCurveSegments(
            expression,
            frameY
        );

    }, [
        expression.compiled,
        expression.coordinateSystem,
        expression.variables,
        frameY
    ]);


    return (
        <group>

            {segments.map((
                points,
                segmentIndex
            ) => (

                <Line
                    key={segmentIndex}
                    points={points}
                    color={
                        expression.color
                    }
                    lineWidth={0.75}
                    transparent
                    opacity={0.6}
                    depthTest
                    renderOrder={5}

                    /*
                     * Los slices decorativos no deben
                     * capturar clics ni el ratón.
                     */
                    raycast={() => {}}
                />

            ))}

        </group>
    );

}
function createCurveSegments(
    expression: CompiledSurfaceExpression,
    frameY: number
): Array<Array<[number, number, number]>> {

    const segments:
        Array<Array<[number, number, number]>> = [];

    let currentSegment:
        Array<[number, number, number]> = [];

    let previousPoint:
        [number, number, number] | null = null;

    const halfSize =
        GRAPH_SIZE / 2;

    const isPolar =
        expression.coordinateSystem === "polar";


    function finishSegment(): void {

        if (currentSegment.length >= 2) {

            segments.push(
                currentSegment
            );

        }

        currentSegment = [];
        previousPoint = null;

    }


    for (
        let index = 0;
        index <= CURVE_SAMPLES;
        index += 1
    ) {

        const progress =
            index / CURVE_SAMPLES;

        const parameter =
            isPolar
                ? progress * Math.PI * 2
                : -halfSize + progress * GRAPH_SIZE;

        let result:
            number;


        try {

            const scope =
                isPolar
                    ? {
                        ...expression.variables,

                        theta:
                            parameter,

                        /*
                         * En Rθ, x y theta son
                         * el mismo parámetro.
                         */
                        x:
                            parameter,

                        y:
                            frameY
                    }
                    : {
                        ...expression.variables,

                        x:
                            parameter,

                        y:
                            frameY
                    };


            result =
                Number(
                    expression.compiled.evaluate(
                        createEvaluationScope(
                            scope
                        )
                    )
                );

        } catch {

            finishSegment();

            continue;

        }


        if (
            !Number.isFinite(result) ||
            Math.abs(result) > MAXIMUM_HEIGHT
        ) {

            finishSegment();

            continue;

        }


        const point:
            [number, number, number] =
                isPolar
                    ? [
                        result * Math.cos(parameter),
                        result * Math.sin(parameter),
                        frameY
                    ]
                    : [
                        parameter,
                        result,
                        frameY
                    ];


        const discontinuity =

            previousPoint !== null &&

            Math.hypot(
                point[0] - previousPoint[0],
                point[1] - previousPoint[1],
                point[2] - previousPoint[2]
            ) > 8;


        if (discontinuity) {

            finishSegment();

        }


        currentSegment.push(
            point
        );

        previousPoint =
            point;

    }


    finishSegment();

    return segments;

}


function FunctionSurface({
    expression,
    onHover,
}: FunctionSurfaceProps) {

    const geometry =
    useMemo(() => {

        return createSurfaceGeometry(
            expression
        );

    }, [
        expression.compiled,
        expression.coordinateSystem,
        expression.variables
    ]);


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


        onHover({

            expressionId:
                  expression.id,

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
           onClick={
    handleSurfaceClick
}
        >

            <meshStandardMaterial
    color={
        expression.color
    }
    side={
        DoubleSide
    }
    transparent
    opacity={0.58}
    roughness={0.5}
    metalness={0.08}
    polygonOffset
    polygonOffsetFactor={1}
    polygonOffsetUnits={1}
/>

        </mesh>
    );

}

function createSurfaceGeometry(
    expression: CompiledSurfaceExpression
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
        GRAPH_SIZE / 2;

    const pointsPerSide =
        SURFACE_RESOLUTION + 1;

    const isPolar =
        expression.coordinateSystem === "polar";


    for (
        let row = 0;
        row <= SURFACE_RESOLUTION;
        row += 1
    ) {

        const frameY =

            -halfSize +

            (
                row /
                SURFACE_RESOLUTION
            ) *

            GRAPH_SIZE;


        for (
            let column = 0;
            column <= SURFACE_RESOLUTION;
            column += 1
        ) {

            const progress =
                column /
                SURFACE_RESOLUTION;

            const parameter =
                isPolar
                    ? progress * Math.PI * 2
                    : -halfSize + progress * GRAPH_SIZE;


            let valid =
                false;

            let pointX =
                0;

            let pointY =
                0;

            let pointZ =
                frameY;


            try {

                const scope =
                    isPolar
                        ? {
                            ...expression.variables,

                            theta:
                                parameter,

                            /*
                             * Alias solicitado:
                             * x equivale a theta en Rθ.
                             */
                            x:
                                parameter,

                            y:
                                frameY
                        }
                        : {
                            ...expression.variables,

                            x:
                                parameter,

                            y:
                                frameY
                        };


                const result =
                    Number(
                        expression.compiled.evaluate(
                            createEvaluationScope(
                                scope
                            )
                        )
                    );


                if (
                    Number.isFinite(result) &&
                    Math.abs(result) <= MAXIMUM_HEIGHT
                ) {

                    if (isPolar) {

                        pointX =
                            result *
                            Math.cos(parameter);

                        pointY =
                            result *
                            Math.sin(parameter);

                    } else {

                        pointX =
                            parameter;

                        pointY =
                            result;

                    }


                    valid =
                        true;

                }

            } catch {

                valid =
                    false;

            }


            positions.push(
                pointX,
                pointY,
                pointZ
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


function ActivePointMarker({
    point
}: {
    point:
        ActiveGraphPoint;
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
                        0.105,
                        18,
                        18
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
                    0.75,
                    0
                ]}
            >

                <div
                    className="graph3DPointTooltip"
                    style={{
                        borderColor:
                            point.color
                    }}
                >

                    <strong className="graph3DPointMainValue">

                        {formatNumber(
                            point.z
                        )}

                    </strong>


                    <span className="graph3DPointSecondaryValue">

                        x = {
                            formatNumber(
                                point.x
                            )
                        }

                    </span>


                    <span className="graph3DPointSecondaryValue">

                        y = {
                            formatNumber(
                                point.y
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