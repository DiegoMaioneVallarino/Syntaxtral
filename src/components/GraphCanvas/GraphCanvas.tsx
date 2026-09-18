import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import type {
    CSSProperties,
    PointerEvent as ReactPointerEvent,
    WheelEvent as ReactWheelEvent
} from "react";

import {
    compile
} from "mathjs";

import "./GraphCanvas.css";

import type {
    GraphExpression
} from "../../features/calculator/models/GraphExpression";

import {
    createEvaluationScope
} from "../../features/calculator/math/createEvaluationScope";

type GraphCanvasProps = {

    expressions:
        GraphExpression[];

};


type Viewport = {

    centerX:
        number;

    centerY:
        number;

    pixelsPerUnit:
        number;

};


type CanvasSize = {

    width:
        number;

    height:
        number;

};


type DragState = {

    pointerX:
        number;

    pointerY:
        number;

    centerX:
        number;

    centerY:
        number;

    moved:
        boolean;

};


type SelectedGraphPoint = {

    expressionId:
        string;

    expression:
        string;

    color:
        string;

    x:
        number;

    y:
        number;

};

const EXPRESSION_DISSOLVE_DURATION =
    120;


const EXPRESSION_CONSTRUCTION_DURATION =
    700;

function clampConstructionProgress(
    value: number
): number {

    return Math.min(
        1,
        Math.max(
            0,
            value
        )
    );

}


function easeConstructionProgress(
    value: number
): number {

    return clampConstructionProgress(
        value
    );

}

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


function getGridStep(
    pixelsPerUnit: number
): number {

    const desiredPixels =
        80;


    const approximateStep =
        desiredPixels /
        pixelsPerUnit;


    const magnitude =
        Math.pow(

            10,

            Math.floor(
                Math.log10(
                    approximateStep
                )
            )

        );


    const normalizedStep =
        approximateStep /
        magnitude;


    if (normalizedStep <= 1) {

        return magnitude;

    }


    if (normalizedStep <= 2) {

        return 2 * magnitude;

    }


    if (normalizedStep <= 5) {

        return 5 * magnitude;

    }


    return 10 * magnitude;

}


function GraphCanvas({
    expressions
}: GraphCanvasProps) {

    const canvasRef =
        useRef<HTMLCanvasElement | null>(
            null
        );


    const containerRef =
        useRef<HTMLDivElement | null>(
            null
        );


    const dragStateRef =
        useRef<DragState | null>(
            null
        );


    const [
        canvasSize,
        setCanvasSize
    ] = useState<CanvasSize>({

        width: 0,
        height: 0

    });


    const [
        viewport,
        setViewport
    ] = useState<Viewport>({

        centerX: 0,
        centerY: 0,

        pixelsPerUnit: 55

    });


    const [
        selectedPoint,
        setSelectedPoint
    ] = useState<SelectedGraphPoint | null>(
        null
    );


    const compiledExpressions =
        useMemo(() => {

            return expressions.flatMap(
                expression => {

                    if (!expression.visible) {

                        return [];

                    }


                    if (
                        expression.expression
                            .trim()
                            .length === 0
                    ) {

                        return [];

                    }


                    try {

                        const normalizedExpression =
                            normalizeExpression(
                                expression.expression
                            );


                        const compiled =
                            compile(
                                normalizedExpression
                            );


                        return [
                            {
                                ...expression,
                                compiled
                            }
                        ];

                    } catch {

                        return [];

                    }

                }
            );

        }, [expressions]);

const settledExpressionsRef =
    useRef<
        typeof compiledExpressions
    >([]);





    const selectedScreenPosition =
        useMemo(() => {

            if (!selectedPoint) {

                return null;

            }


            const screenX =

                canvasSize.width / 2 +

                (
                    selectedPoint.x -
                    viewport.centerX
                ) *

                viewport.pixelsPerUnit;


            const screenY =

                canvasSize.height / 2 -

                (
                    selectedPoint.y -
                    viewport.centerY
                ) *

                viewport.pixelsPerUnit;


            if (
                screenX < 0 ||
                screenX > canvasSize.width ||
                screenY < 0 ||
                screenY > canvasSize.height
            ) {

                return null;

            }


            return {

                x:
                    screenX,

                y:
                    screenY,

                tooltipLeft:
                    screenX >
                    canvasSize.width - 210,

                tooltipBelow:
                    screenY < 70

            };

        }, [
            selectedPoint,
            canvasSize,
            viewport
        ]);


    useEffect(() => {

        const container =
            containerRef.current;


        if (!container) {

            return;

        }


        const resizeObserver =
            new ResizeObserver(entries => {

                const entry =
                    entries[0];


                setCanvasSize({

                    width:
                        entry.contentRect.width,

                    height:
                        entry.contentRect.height

                });

            });


        resizeObserver.observe(
            container
        );


        return () => {

            resizeObserver.disconnect();

        };

    }, []);
useEffect(() => {

    function handleKeyDown(
        event: KeyboardEvent
    ): void {

        if (
            event.key === "Escape"
        ) {

            setSelectedPoint(
                null
            );

        }

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

    useEffect(() => {

    const canvas =
        canvasRef.current;


    if (!canvas) {

        return;

    }


    const context =
        canvas.getContext(
            "2d"
        );


    if (!context) {

        return;

    }


    const {
        width,
        height
    } = canvasSize;


    if (
        width === 0 ||
        height === 0
    ) {

        return;

    }


    const pixelRatio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * pixelRatio;


    canvas.height =
        height * pixelRatio;


    context.setTransform(

        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0

    );


    function drawBase(): void {

        drawBackground(
            context!,
            width,
            height
        );


        drawGrid(
            context!,
            width,
            height,
            viewport
        );


        drawAxes(
            context!,
            width,
            height,
            viewport
        );

    }


    function drawExpressions(
        expressionsToDraw:
            typeof compiledExpressions,
        constructionProgress:
            number,
        opacity:
            number
    ): void {

        context!.save();


        context!.globalAlpha =
            clampConstructionProgress(
                opacity
            );


        for (
            const expression
            of expressionsToDraw
        ) {

            drawExpression(

                context!,
                width,
                height,
                viewport,
                expression,
                constructionProgress

            );

        }


        context!.restore();

    }


const expressionsChanged =

    settledExpressionsRef.current !==
    compiledExpressions;

    /*
     * Un cambio de cámara o tamaño solamente
     * redibuja la forma terminada.
     */
    if (!expressionsChanged) {

        drawBase();


        drawExpressions(
            compiledExpressions,
            1,
            1
        );


        return;

    }


    const previousExpressions =
        settledExpressionsRef.current;


    const hasPreviousExpression =
        previousExpressions.length > 0;


    const startedAt =
        performance.now();


    let animationFrameId =
        0;


    function renderFrame(
        timestamp: number
    ): void {

        const elapsed =
            timestamp -
            startedAt;


        drawBase();


        /*
         * Primero desaparece la geometría anterior.
         */
        if (
            hasPreviousExpression &&
            elapsed <
                EXPRESSION_DISSOLVE_DURATION
        ) {

            const dissolveProgress =

                elapsed /
                EXPRESSION_DISSOLVE_DURATION;


            drawExpressions(

                previousExpressions,

                1,

                1 -
                dissolveProgress

            );

        }


        const constructionStartedAt =

            hasPreviousExpression

                ? EXPRESSION_DISSOLVE_DURATION

                : 0;


        const constructionProgress =

            easeConstructionProgress(

                (
                    elapsed -
                    constructionStartedAt
                ) /

                EXPRESSION_CONSTRUCTION_DURATION

            );


        /*
         * La nueva expresión solamente comienza después
         * de que la anterior terminó de disolverse.
         */
        if (
            elapsed >=
            constructionStartedAt
        ) {

            drawExpressions(

                compiledExpressions,

                constructionProgress,

                1

            );

        }


        if (
            constructionProgress < 1
        ) {

            animationFrameId =
                requestAnimationFrame(
                    renderFrame
                );

            return;

        }


        settledExpressionsRef.current =
            compiledExpressions;

    }


    animationFrameId =
        requestAnimationFrame(
            renderFrame
        );


    return () => {

        cancelAnimationFrame(
            animationFrameId
        );

    };

}, [
    canvasSize,
    viewport,
    compiledExpressions
]);


    function handleWheel(
        event:
            ReactWheelEvent<HTMLCanvasElement>
    ): void {

        event.preventDefault();


        const canvas =
            canvasRef.current;


        if (!canvas) {

            return;

        }


        const bounds =
            canvas.getBoundingClientRect();


        const pointerX =
            event.clientX -
            bounds.left;


        const pointerY =
            event.clientY -
            bounds.top;


        setViewport(previousViewport => {

            const zoomFactor =

                event.deltaY < 0
                    ? 1.12
                    : 0.89;


            const nextScale =
                Math.min(

                    500,

                    Math.max(

                        8,

                        previousViewport
                            .pixelsPerUnit *
                        zoomFactor

                    )

                );


            const worldX =

                previousViewport.centerX +

                (
                    pointerX -
                    bounds.width / 2
                ) /

                previousViewport.pixelsPerUnit;


            const worldY =

                previousViewport.centerY -

                (
                    pointerY -
                    bounds.height / 2
                ) /

                previousViewport.pixelsPerUnit;


            return {

                centerX:

                    worldX -

                    (
                        pointerX -
                        bounds.width / 2
                    ) /

                    nextScale,

                centerY:

                    worldY +

                    (
                        pointerY -
                        bounds.height / 2
                    ) /

                    nextScale,

                pixelsPerUnit:
                    nextScale

            };

        });

    }


    function handlePointerDown(
        event:
            ReactPointerEvent<HTMLCanvasElement>
    ): void {

        event.currentTarget.setPointerCapture(
            event.pointerId
        );


        dragStateRef.current = {

            pointerX:
                event.clientX,

            pointerY:
                event.clientY,

            centerX:
                viewport.centerX,

            centerY:
                viewport.centerY,

            moved:
                false

        };

    }


    function handlePointerMove(
    event:
        ReactPointerEvent<HTMLCanvasElement>
): void {

    const dragState =
        dragStateRef.current;


    /*
     * Si no estamos arrastrando la cámara
     * y existe una curva seleccionada,
     * el mouse solamente controla x.
     */

    if (!dragState) {

        if (
            selectedPoint &&
            event.buttons === 0
        ) {

            updateSelectedPointFromMouse(
                event
            );

        }


        return;

    }


    const deltaX =

        event.clientX -
        dragState.pointerX;


    const deltaY =

        event.clientY -
        dragState.pointerY;


    const distance =

        Math.hypot(
            deltaX,
            deltaY
        );


    if (distance < 4) {

        return;

    }


    dragState.moved =
        true;


    setViewport(previousViewport => ({

        ...previousViewport,

        centerX:

            dragState.centerX -

            deltaX /
            previousViewport.pixelsPerUnit,

        centerY:

            dragState.centerY +

            deltaY /
            previousViewport.pixelsPerUnit

    }));

}

function updateSelectedPointFromMouse(
    event:
        ReactPointerEvent<HTMLCanvasElement>
): void {

    if (!selectedPoint) {

        return;

    }


    const canvas =
        canvasRef.current;


    if (!canvas) {

        return;

    }


    const selectedExpression =
        compiledExpressions.find(
            expression =>
                expression.id ===
                selectedPoint.expressionId
        );


    if (!selectedExpression) {

        return;

    }


    const bounds =
        canvas.getBoundingClientRect();


    const pointerScreenX =

        event.clientX -
        bounds.left;


    const worldX =

        viewport.centerX +

        (
            pointerScreenX -
            bounds.width / 2
        ) /

        viewport.pixelsPerUnit;


    try {

        const worldY =
    Number(
        selectedExpression.compiled.evaluate(
            createEvaluationScope({
                ...selectedExpression.variables,

                x:
                    worldX,

                theta:
                    worldX
            })
        )
    );


        /*
         * Si caemos en una discontinuidad,
         * conservamos el último punto válido.
         * No borramos la selección.
         */

        if (
            !Number.isFinite(
                worldY
            )
        ) {

            return;

        }


        setSelectedPoint(previous => {

            if (!previous) {

                return previous;

            }


            return {

                ...previous,

                x:
                    worldX,

                y:
                    worldY

            };

        });

    } catch {

        /*
         * Conservamos el último punto válido.
         */

    }

}


    function handlePointerUp(
        event:
            ReactPointerEvent<HTMLCanvasElement>
    ): void {

        const dragState =
            dragStateRef.current;


        dragStateRef.current =
            null;


        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {

            event.currentTarget.releasePointerCapture(
                event.pointerId
            );

        }


        if (
            !dragState ||
            dragState.moved
        ) {

            return;

        }


        selectNearestExpression(
            event
        );

    }


    function handlePointerCancel(
        event:
            ReactPointerEvent<HTMLCanvasElement>
    ): void {

        dragStateRef.current =
            null;


        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {

            event.currentTarget.releasePointerCapture(
                event.pointerId
            );

        }

    }


    function selectNearestExpression(
        event:
            ReactPointerEvent<HTMLCanvasElement>
    ): void {

        const canvas =
            canvasRef.current;


        if (!canvas) {

            return;

        }


        const bounds =
            canvas.getBoundingClientRect();


        const pointerScreenX =

            event.clientX -
            bounds.left;


        const pointerScreenY =

            event.clientY -
            bounds.top;


        const worldX =

            viewport.centerX +

            (
                pointerScreenX -
                bounds.width / 2
            ) /

            viewport.pixelsPerUnit;


        let nearestPoint:
            SelectedGraphPoint | null = null;


        let nearestDistance =
            Number.POSITIVE_INFINITY;


        for (
            const expression
            of compiledExpressions
        ) {

            let result:
                unknown;


            try {

             result =
    expression.compiled.evaluate(
        createEvaluationScope({
            ...expression.variables,

            x:
                worldX
        })
    );

            } catch {

                continue;

            }


            const worldY =
                Number(result);


            if (
                !Number.isFinite(worldY)
            ) {

                continue;

            }


            const curveScreenY =

                bounds.height / 2 -

                (
                    worldY -
                    viewport.centerY
                ) *

                viewport.pixelsPerUnit;


            const distance =

                Math.abs(
                    curveScreenY -
                    pointerScreenY
                );


            if (
                distance <
                nearestDistance
            ) {

                nearestDistance =
                    distance;


                nearestPoint = {

                    expressionId:
                        expression.id,

                    expression:
                        expression.expression,

                    color:
                        expression.color,

                    x:
                        worldX,

                    y:
                        worldY

                };

            }

        }


        const selectionTolerance =
            14;


        if (
            nearestPoint &&
            nearestDistance <=
                selectionTolerance
        ) {

            setSelectedPoint(
                nearestPoint
            );

        } else {

            setSelectedPoint(
                null
            );

        }

    }


    function resetViewport(): void {

        setViewport({

            centerX: 0,
            centerY: 0,

            pixelsPerUnit: 55

        });

    }


    return (
        <div
            ref={containerRef}
            className="graphCanvasContainer"
        >

            <canvas
                ref={canvasRef}
                className="graphCanvas"
                onWheel={handleWheel}
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerCancel
                }
                aria-label="Plano cartesiano interactivo"
            />


            {selectedPoint &&
                selectedScreenPosition && (

                <div
                    className={`
                        graphSelectedPoint

                        ${
                            selectedScreenPosition
                                .tooltipLeft
                                ? "graphSelectedPointLeft"
                                : ""
                        }

                        ${
                            selectedScreenPosition
                                .tooltipBelow
                                ? "graphSelectedPointBelow"
                                : ""
                        }
                    `}
                    style={{

                        left:
                            selectedScreenPosition.x,

                        top:
                            selectedScreenPosition.y,

                        "--selected-point-color":
                            selectedPoint.color

                    } as CSSProperties}
                >

                    <span className="graphSelectedPointDot" />


                   <strong className="graphPointMainValue">

    {formatSelectedNumber(
        selectedPoint.y
    )}

</strong>


<span className="graphPointSecondaryValue">

    x = {
        formatSelectedNumber(
            selectedPoint.x
        )
    }

</span>

                </div>

            )}


            <div className="graphCanvasControls">

                <button
                    type="button"
                    onClick={() => {

                        setViewport(previous => ({

                            ...previous,

                            pixelsPerUnit:
                                Math.min(

                                    500,

                                    previous
                                        .pixelsPerUnit *
                                    1.2

                                )

                        }));

                    }}
                >
                    +
                </button>


                <button
                    type="button"
                    onClick={() => {

                        setViewport(previous => ({

                            ...previous,

                            pixelsPerUnit:
                                Math.max(

                                    8,

                                    previous
                                        .pixelsPerUnit /
                                    1.2

                                )

                        }));

                    }}
                >
                    −
                </button>


                <button
                    type="button"
                    className="resetGraphButton"
                    onClick={
                        resetViewport
                    }
                >
                    Reset
                </button>

            </div>


            <div className="graphCoordinates">

                x: {
                    viewport.centerX.toFixed(2)
                }

                {" · "}

                y: {
                    viewport.centerY.toFixed(2)
                }

                {" · "}

                zoom: {
                    viewport.pixelsPerUnit.toFixed(0)
                }

            </div>

        </div>
    );

}


function drawBackground(
    context:
        CanvasRenderingContext2D,
    width: number,
    height: number
): void {

    context.fillStyle =
        "#07080b";


    context.fillRect(
        0,
        0,
        width,
        height
    );

}


function drawGrid(
    context:
        CanvasRenderingContext2D,
    width: number,
    height: number,
    viewport: Viewport
): void {

    const step =
        getGridStep(
            viewport.pixelsPerUnit
        );


    const leftWorld =

        viewport.centerX -

        width /
        2 /
        viewport.pixelsPerUnit;


    const rightWorld =

        viewport.centerX +

        width /
        2 /
        viewport.pixelsPerUnit;


    const bottomWorld =

        viewport.centerY -

        height /
        2 /
        viewport.pixelsPerUnit;


    const topWorld =

        viewport.centerY +

        height /
        2 /
        viewport.pixelsPerUnit;


    context.strokeStyle =
        "#ffffff0e";


    context.lineWidth =
        1;


    context.fillStyle =
        "#625e6a";


    context.font =
        "10px monospace";


    context.beginPath();


    const firstX =

        Math.floor(
            leftWorld / step
        ) * step;


    for (
        let x = firstX;
        x <= rightWorld;
        x += step
    ) {

        const screenX =

            width / 2 +

            (
                x -
                viewport.centerX
            ) *

            viewport.pixelsPerUnit;


        context.moveTo(
            screenX,
            0
        );


        context.lineTo(
            screenX,
            height
        );


        if (
            Math.abs(x) >
            step / 100
        ) {

            context.fillText(

                formatGridNumber(x),

                screenX + 4,

                height / 2 +
                viewport.centerY *
                viewport.pixelsPerUnit +
                14

            );

        }

    }


    const firstY =

        Math.floor(
            bottomWorld / step
        ) * step;


    for (
        let y = firstY;
        y <= topWorld;
        y += step
    ) {

        const screenY =

            height / 2 -

            (
                y -
                viewport.centerY
            ) *

            viewport.pixelsPerUnit;


        context.moveTo(
            0,
            screenY
        );


        context.lineTo(
            width,
            screenY
        );


        if (
            Math.abs(y) >
            step / 100
        ) {

            context.fillText(

                formatGridNumber(y),

                width / 2 -
                viewport.centerX *
                viewport.pixelsPerUnit +
                6,

                screenY - 5

            );

        }

    }


    context.stroke();

}


function drawAxes(
    context:
        CanvasRenderingContext2D,
    width: number,
    height: number,
    viewport: Viewport
): void {

    const axisX =

        width / 2 -

        viewport.centerX *
        viewport.pixelsPerUnit;


    const axisY =

        height / 2 +

        viewport.centerY *
        viewport.pixelsPerUnit;


    context.strokeStyle =
        "#ffffff4a";


    context.lineWidth =
        1.4;


    context.beginPath();


    context.moveTo(
        axisX,
        0
    );


    context.lineTo(
        axisX,
        height
    );


    context.moveTo(
        0,
        axisY
    );


    context.lineTo(
        width,
        axisY
    );


    context.stroke();

}


function drawExpression(
    context:
        CanvasRenderingContext2D,
    width:
        number,
    height:
        number,
    viewport:
        Viewport,
    expression: {

        color:
            string;

        coordinateSystem:
            "cartesian" |
            "polar";

        variables:
            Readonly<
                Record<string, unknown>
            >;

        compiled: {

            evaluate: (
                scope?: object
            ) => unknown;

        };

    },
    constructionProgress:
        number
): void {
if (
    expression.coordinateSystem ===
    "polar"
) {

    drawPolarExpression(
        context,
        width,
        height,
        viewport,
        expression,
        constructionProgress
    );

    return;

}
    context.beginPath();


    context.strokeStyle =
        expression.color;


    context.lineWidth =
        2.5;


    context.lineJoin =
        "round";


    context.lineCap =
        "round";


    let previousScreenY:
        number | null = null;


    let drawing =
        false;

const visibleWidth =
    Math.floor(

        width *

        clampConstructionProgress(
            constructionProgress
        )

    );
    for (
        let screenX = 0;
screenX <= visibleWidth;
        screenX += 1
    ) {

        const x =

            viewport.centerX +

            (
                screenX -
                width / 2
            ) /

            viewport.pixelsPerUnit;


        let result:
            unknown;


        try {

            result =
    expression.compiled.evaluate(
        createEvaluationScope({
            ...expression.variables,
            x
        })
    );
        } catch {

            drawing =
                false;

            previousScreenY =
                null;

            continue;

        }


        const y =
            Number(result);


        if (
            !Number.isFinite(y)
        ) {

            drawing =
                false;

            previousScreenY =
                null;

            continue;

        }


        const screenY =

            height / 2 -

            (
                y -
                viewport.centerY
            ) *

            viewport.pixelsPerUnit;


        const hasDiscontinuity =

            previousScreenY !== null &&

            Math.abs(
                screenY -
                previousScreenY
            ) >
            height * 0.75;


        const isFarOutsideCanvas =

            Math.abs(screenY) >
            height * 10;


        if (
            hasDiscontinuity ||
            isFarOutsideCanvas
        ) {

            drawing =
                false;

        }


        if (!drawing) {

            context.moveTo(
                screenX,
                screenY
            );


            drawing =
                true;

        } else {

            context.lineTo(
                screenX,
                screenY
            );

        }


        previousScreenY =
            screenY;

    }


    context.stroke();

}

function drawPolarExpression(
    context:
        CanvasRenderingContext2D,
    width:
        number,
    height:
        number,
    viewport:
        Viewport,
    expression: {
        color:
            string;

        variables:
            Readonly<
                Record<string, unknown>
            >;

            compiled: {

        evaluate: (
            scope?: object
        ) => unknown;

    };

},
constructionProgress:
    number
): void {

    const samples =
        720;

const visibleSamples =
    Math.floor(

        samples *

        clampConstructionProgress(
            constructionProgress
        )

    );
    context.beginPath();

    context.strokeStyle =
        expression.color;

    context.lineWidth =
        2.5;

    context.lineJoin =
        "round";

    context.lineCap =
        "round";


    let drawing =
        false;

    let previousScreenX:
        number | null = null;

    let previousScreenY:
        number | null = null;


    for (
        let index = 0;
        index <= visibleSamples;
        index += 1
    ) {

        const theta =

            (
                index /
                samples
            ) *

            Math.PI *
            2;


        let radius:
            number;


        try {

            radius =
    Number(
        expression.compiled.evaluate(
            createEvaluationScope({
    ...expression.variables,

    theta,

    /*
     * En modo Rθ:
     * x === theta
     */
    x:
        theta
})
        )
    );

        } catch {

            drawing =
                false;

            previousScreenX =
                null;

            previousScreenY =
                null;

            continue;

        }


        if (
            !Number.isFinite(radius) ||
            Math.abs(radius) > 10000
        ) {

            drawing =
                false;

            previousScreenX =
                null;

            previousScreenY =
                null;

            continue;

        }


        const x =
            radius *
            Math.cos(theta);


        const y =
            radius *
            Math.sin(theta);


        const screenX =

            width / 2 +

            (
                x -
                viewport.centerX
            ) *

            viewport.pixelsPerUnit;


        const screenY =

            height / 2 -

            (
                y -
                viewport.centerY
            ) *

            viewport.pixelsPerUnit;


        const discontinuity =

            previousScreenX !== null &&
            previousScreenY !== null &&

            Math.hypot(

                screenX -
                    previousScreenX,

                screenY -
                    previousScreenY

            ) > 180;


        if (
            !drawing ||
            discontinuity
        ) {

            context.moveTo(
                screenX,
                screenY
            );

            drawing =
                true;

        } else {

            context.lineTo(
                screenX,
                screenY
            );

        }


        previousScreenX =
            screenX;

        previousScreenY =
            screenY;

    }


    context.stroke();

}
function formatGridNumber(
    value: number
): string {

    if (
        Math.abs(value) >= 1
    ) {

        return Number(
            value.toFixed(4)
        ).toString();

    }


    return value.toPrecision(2);

}


function formatSelectedNumber(
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
        value.toFixed(6)
    ).toString();

}


export default GraphCanvas;