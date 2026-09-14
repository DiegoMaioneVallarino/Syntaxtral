import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import type {
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


type GraphCanvasProps = {

    expressions: GraphExpression[];

};


type Viewport = {

    centerX: number;
    centerY: number;

    pixelsPerUnit: number;

};


type CanvasSize = {

    width: number;
    height: number;

};


type DragState = {

    pointerX: number;
    pointerY: number;

    centerX: number;
    centerY: number;

};


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


    const compiledExpressions = useMemo(() => {

        return expressions.flatMap(
            expression => {

                if (!expression.visible) {
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

    }, [
        expressions
    ]);


    useEffect(() => {

        const container =
            containerRef.current;


        if (!container) return;


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

        const canvas =
            canvasRef.current;


        if (!canvas) return;


        const context =
            canvas.getContext("2d");


        if (!context) return;


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


        drawBackground(
            context,
            width,
            height
        );


        drawGrid(
            context,
            width,
            height,
            viewport
        );


        drawAxes(
            context,
            width,
            height,
            viewport
        );


        for (
            const expression
            of compiledExpressions
        ) {

            drawExpression(
                context,
                width,
                height,
                viewport,
                expression
            );

        }

    }, [
        canvasSize,
        viewport,
        compiledExpressions
    ]);


    function handleWheel(
        event: ReactWheelEvent<HTMLCanvasElement>
    ) {

        event.preventDefault();


        const canvas =
            canvasRef.current;


        if (!canvas) return;


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
                        previousViewport.pixelsPerUnit *
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
        event: ReactPointerEvent<HTMLCanvasElement>
    ) {

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
                viewport.centerY

        };

    }


    function handlePointerMove(
        event: ReactPointerEvent<HTMLCanvasElement>
    ) {

        const dragState =
            dragStateRef.current;


        if (!dragState) return;


        const deltaX =

            event.clientX -
            dragState.pointerX;


        const deltaY =

            event.clientY -
            dragState.pointerY;


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


    function stopDragging() {

        dragStateRef.current =
            null;

    }


    function resetViewport() {

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
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                aria-label="Plano cartesiano interactivo"
            />


            <div className="graphCanvasControls">

                <button
                    type="button"
                    onClick={() => {
                        setViewport(previous => ({

                            ...previous,

                            pixelsPerUnit:
                                Math.min(
                                    500,
                                    previous.pixelsPerUnit * 1.2
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
                                    previous.pixelsPerUnit / 1.2
                                )

                        }));
                    }}
                >
                    −
                </button>


                <button
                    type="button"
                    className="resetGraphButton"
                    onClick={resetViewport}
                >
                    Reset
                </button>

            </div>


            <div className="graphCoordinates">

                x: {viewport.centerX.toFixed(2)}

                {" · "}

                y: {viewport.centerY.toFixed(2)}

                {" · "}

                zoom: {viewport.pixelsPerUnit.toFixed(0)}

            </div>

        </div>
    );
}


function drawBackground(
    context: CanvasRenderingContext2D,
    width: number,
    height: number
) {

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
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    viewport: Viewport
) {

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


        if (Math.abs(x) > step / 100) {

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


        if (Math.abs(y) > step / 100) {

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
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    viewport: Viewport
) {

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
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    viewport: Viewport,
    expression: {
        color: string;

        compiled: {
            evaluate: (
                scope?: object
            ) => unknown;
        };
    }
) {

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


    for (
        let screenX = 0;
        screenX <= width;
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
                expression.compiled.evaluate({
                    x
                });

        } catch {

            drawing =
                false;

            previousScreenY =
                null;

            continue;

        }


        const y =
            Number(result);


        if (!Number.isFinite(y)) {

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
            ) > height * 0.75;


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


function formatGridNumber(
    value: number
): string {

    if (Math.abs(value) >= 1) {

        return Number(
            value.toFixed(4)
        ).toString();

    }


    return value.toPrecision(2);

}


export default GraphCanvas;