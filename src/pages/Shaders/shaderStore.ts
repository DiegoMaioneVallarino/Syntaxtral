export type ShaderProject = {
    id: string;
    title: string;
    code: string;
};

const STORAGE_KEY = "syntaxtral.shaders.v1";

export const starterShader = `precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    vec3 color = 0.5 + 0.5 * cos(
        u_time + uv.xyx + vec3(0.0, 2.0, 4.0)
    );

    gl_FragColor = vec4(color, 1.0);
}
`;

export const exampleShaders: ShaderProject[] = [
    {
        id: "example-gradient",
        title: "Cromática",
        code: starterShader
    },
    {
        id: "example-rings",
        title: "Ondas concéntricas",
        code: `precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 p = (
        2.0 * gl_FragCoord.xy - u_resolution
    ) / min(u_resolution.x, u_resolution.y);

    float radius = length(p);
    float wave = 0.5 + 0.5 * sin(
        radius * 22.0 - u_time * 3.0
    );

    vec3 dark = vec3(0.035, 0.015, 0.08);
    vec3 light = vec3(0.55, 0.25, 1.0);

    vec3 color = mix(dark, light, pow(wave, 4.0));
    color *= exp(-radius * 0.5);

    gl_FragColor = vec4(color, 1.0);
}
`
    },
    {
        id: "example-flower",
        title: "Flor de luz",
        code: `precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 p = (
        2.0 * gl_FragCoord.xy - u_resolution
    ) / min(u_resolution.x, u_resolution.y);

    float angle = atan(p.y, p.x);
    float radius = length(p);

    float boundary = 0.55 + 0.16 * cos(
        6.0 * angle + u_time
    );

    float glow = 0.014 / (
        abs(radius - boundary) + 0.014
    );

    vec3 color = vec3(0.015, 0.02, 0.045);
    color += glow * vec3(0.3, 0.85, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
`
    }
];

export function readSavedShaders(): ShaderProject[] {
    try {
        const raw: unknown = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? "[]"
        );

        if (!Array.isArray(raw)) {
            return [];
        }

        return raw.filter(
            (item: unknown): item is ShaderProject => {
                if (
                    typeof item !== "object" ||
                    item === null
                ) {
                    return false;
                }

                const value = item as Record<string, unknown>;

                return (
                    typeof value.id === "string" &&
                    typeof value.title === "string" &&
                    typeof value.code === "string"
                );
            }
        );
    } catch {
        return [];
    }
}

export function saveShader(project: ShaderProject): void {
    const others = readSavedShaders().filter(
        item => item.id !== project.id
    );

    // El editor captura errores de cuota o almacenamiento bloqueado.
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([project, ...others])
    );
}