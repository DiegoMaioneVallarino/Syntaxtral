import {
    useEffect,
    useRef
} from "react";

type ShaderCanvasProps = {
    code: string;
    playing?: boolean;
    preview?: boolean;
    onError?: (message: string | null) => void;
};

type ShaderRuntime = {
    gl: WebGLRenderingContext;
    buffer: WebGLBuffer;
    program: WebGLProgram | null;
    timeLocation: WebGLUniformLocation | null;
    resolutionLocation: WebGLUniformLocation | null;
};

const vertexSource = `
attribute vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

function compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader {
    const shader = gl.createShader(type);

    if (!shader) {
        throw new Error("No se pudo crear el shader.");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message =
            gl.getShaderInfoLog(shader) ??
            "Error de compilación.";

        gl.deleteShader(shader);
        throw new Error(message);
    }

    return shader;
}

function createProgram(
    gl: WebGLRenderingContext,
    fragmentSource: string
): WebGLProgram {
    const vertex = compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexSource
    );

    let fragment: WebGLShader | null = null;
    let program: WebGLProgram | null = null;

    try {
        fragment = compileShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentSource
        );

        program = gl.createProgram();

        if (!program) {
            throw new Error("No se pudo crear el programa.");
        }

        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(
                gl.getProgramInfoLog(program) ??
                "No se pudo enlazar el programa."
            );
        }

        return program;
    } catch (error) {
        if (program) {
            gl.deleteProgram(program);
        }

        throw error;
    } finally {
        gl.deleteShader(vertex);

        if (fragment) {
            gl.deleteShader(fragment);
        }
    }
}

export default function ShaderCanvas({
    code,
    playing = true,
    preview = false,
    onError
}: ShaderCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const runtimeRef = useRef<ShaderRuntime | null>(null);

    const playingRef = useRef(playing);
    const errorRef = useRef(onError);

    useEffect(() => {
        playingRef.current = playing;
        errorRef.current = onError;
    }, [playing, onError]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const gl = canvas.getContext("webgl", {
            antialias: false,
            alpha: false,
            depth: false,
            stencil: false
        });

        if (!gl) {
            errorRef.current?.(
                "WebGL no está disponible en este navegador."
            );
            return;
        }

        const buffer = gl.createBuffer();

        if (!buffer) {
            errorRef.current?.(
                "No se pudo reservar el búfer gráfico."
            );
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        // Un triángulo que cubre toda la pantalla.
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                3, -1,
                -1, 3
            ]),
            gl.STATIC_DRAW
        );

        const runtime: ShaderRuntime = {
            gl,
            buffer,
            program: null,
            timeLocation: null,
            resolutionLocation: null
        };

        runtimeRef.current = runtime;

        let visible = true;
        let elapsed = 0;
        let lastTime = performance.now();
        let lastDraw = 0;
        let frameId = 0;

        const observer = new IntersectionObserver(entries => {
            visible = entries[0]?.isIntersecting ?? false;
        });

        observer.observe(canvas);

        function resize(): void {
            const bounds = canvas!.getBoundingClientRect();

            const pixelRatio = preview
                ? 1
                : Math.min(window.devicePixelRatio || 1, 2);

            const width = Math.max(
                1,
                Math.round(bounds.width * pixelRatio)
            );

            const height = Math.max(
                1,
                Math.round(bounds.height * pixelRatio)
            );

            if (
                canvas!.width !== width ||
                canvas!.height !== height
            ) {
                canvas!.width = width;
                canvas!.height = height;
            }
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);
        resize();

        function animate(now: number): void {
            frameId = requestAnimationFrame(animate);

            const delta = Math.min(
                (now - lastTime) / 1000,
                0.1
            );

            lastTime = now;

            if (!visible || document.hidden) {
                return;
            }

            if (playingRef.current) {
                elapsed += delta;
            }

            // Las miniaturas se limitan a unos 24 FPS.
            if (preview && now - lastDraw < 1000 / 24) {
                return;
            }

            lastDraw = now;

            const program = runtime.program;

            if (!program || gl!.isContextLost()) {
                return;
            }

            gl!.viewport(0, 0, canvas!.width, canvas!.height);
            gl!.useProgram(program);

            gl!.uniform1f(runtime.timeLocation, elapsed);

            gl!.uniform2f(
                runtime.resolutionLocation,
                canvas!.width,
                canvas!.height
            );

            gl!.drawArrays(gl!.TRIANGLES, 0, 3);
        }

        function handleContextLost(event: Event): void {
            event.preventDefault();

            errorRef.current?.(
                "Se perdió el contexto gráfico. Recarga la página."
            );
        }

        canvas.addEventListener(
            "webglcontextlost",
            handleContextLost
        );

        frameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            resizeObserver.disconnect();

            canvas.removeEventListener(
                "webglcontextlost",
                handleContextLost
            );

            if (runtime.program) {
                gl.deleteProgram(runtime.program);
            }

            gl.deleteBuffer(buffer);

            if (runtimeRef.current === runtime) {
                runtimeRef.current = null;
            }
        };
    }, [preview]);

    useEffect(() => {
        const runtime = runtimeRef.current;

        if (!runtime) {
            return;
        }

        const { gl } = runtime;

        try {
            const nextProgram = createProgram(gl, code);
            const previousProgram = runtime.program;

            gl.useProgram(nextProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, runtime.buffer);

            const position = gl.getAttribLocation(
                nextProgram,
                "a_position"
            );

            if (position >= 0) {
                gl.enableVertexAttribArray(position);

                gl.vertexAttribPointer(
                    position,
                    2,
                    gl.FLOAT,
                    false,
                    0,
                    0
                );
            }

            runtime.program = nextProgram;

            runtime.timeLocation = gl.getUniformLocation(
                nextProgram,
                "u_time"
            );

            runtime.resolutionLocation = gl.getUniformLocation(
                nextProgram,
                "u_resolution"
            );

            if (previousProgram) {
                gl.deleteProgram(previousProgram);
            }

            errorRef.current?.(null);
        } catch (error) {
            errorRef.current?.(
                error instanceof Error
                    ? error.message
                    : "No se pudo compilar el shader."
            );
        }
    }, [code, preview]);

    return (
        <canvas
            ref={canvasRef}
            className="shaderCanvas"
            aria-label="Visualización animada del shader"
        />
    );
}