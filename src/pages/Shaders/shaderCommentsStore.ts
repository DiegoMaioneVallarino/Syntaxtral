export type ShaderComment = {
    id: string;
    author: string;
    body: string;
    createdAt: number;
};

function storageKey(shaderId: string): string {
    return `syntaxtral.shader-comments.v1:${encodeURIComponent(shaderId)}`;
}

export function readShaderComments(
    shaderId: string
): ShaderComment[] {
    try {
        const raw: unknown = JSON.parse(
            localStorage.getItem(storageKey(shaderId)) ?? "[]"
        );

        if (!Array.isArray(raw)) {
            return [];
        }

        return raw.filter(
            (item: unknown): item is ShaderComment => {
                if (typeof item !== "object" || item === null) {
                    return false;
                }

                const value = item as Record<string, unknown>;

                return (
                    typeof value.id === "string" &&
                    typeof value.author === "string" &&
                    typeof value.body === "string" &&
                    typeof value.createdAt === "number" &&
                    Number.isFinite(value.createdAt) &&
                    !Number.isNaN(
                        new Date(value.createdAt).getTime()
                    )
                );
            }
        ).sort(
            (a, b) => b.createdAt - a.createdAt
        );
    } catch {
        return [];
    }
}

export function writeShaderComments(
    shaderId: string,
    comments: readonly ShaderComment[]
): void {
    localStorage.setItem(
        storageKey(shaderId),
        JSON.stringify(comments)
    );
}