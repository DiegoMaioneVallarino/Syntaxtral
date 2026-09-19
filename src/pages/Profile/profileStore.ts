export type CredentialKind =
    | "degree"
    | "outreach"
    | "award";

export type ProfileCredential = {
    id: string;
    kind: CredentialKind;
    title: string;
    institution: string;
    year: string;
};

export type ProfileSocial = {
    id: string;
    label: string;
    url: string;
};

export type ProfilePost = {
    id: string;
    body: string;
    createdAt: number;
};

export type LocalProfile = {
    name: string;
    handle: string;
    bio: string;
    location: string;
    credentials: ProfileCredential[];
    socials: ProfileSocial[];
    posts: ProfilePost[];
};

const STORAGE_KEY = "syntaxtral.profile.v1";

export const initialProfile: LocalProfile = {
    name: "Dmitry Rybalkin",
    handle: "dmitry",
    bio:
        "Explorando estructuras algebraicas, visualización matemática " +
        "y los patrones ocultos detrás de reglas sencillas.",
    location: "Buenos Aires",
    credentials: [],
    socials: [],
    posts: []
};

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isCredential(
    value: unknown
): value is ProfileCredential {
    return (
        isRecord(value) &&
        typeof value.id === "string" &&
        (
            value.kind === "degree" ||
            value.kind === "outreach" ||
            value.kind === "award"
        ) &&
        typeof value.title === "string" &&
        typeof value.institution === "string" &&
        typeof value.year === "string"
    );
}

function isSocial(value: unknown): value is ProfileSocial {
    return (
        isRecord(value) &&
        typeof value.id === "string" &&
        typeof value.label === "string" &&
        typeof value.url === "string"
    );
}

function isPost(value: unknown): value is ProfilePost {
    return (
        isRecord(value) &&
        typeof value.id === "string" &&
        typeof value.body === "string" &&
        typeof value.createdAt === "number" &&
        Number.isFinite(value.createdAt)
    );
}

export function readProfile(): LocalProfile {
    try {
        const value: unknown = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? "null"
        );

        if (
            !isRecord(value) ||
            typeof value.name !== "string" ||
            typeof value.handle !== "string" ||
            typeof value.bio !== "string" ||
            typeof value.location !== "string" ||
            !Array.isArray(value.credentials) ||
            !Array.isArray(value.socials) ||
            !Array.isArray(value.posts)
        ) {
            return initialProfile;
        }

        return {
            name: value.name,
            handle: value.handle,
            bio: value.bio,
            location: value.location,
            credentials: value.credentials.filter(isCredential),
            socials: value.socials.filter(isSocial),
            posts: value.posts.filter(isPost)
        };
    } catch {
        return initialProfile;
    }
}

export function writeProfile(profile: LocalProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function safeSocialUrl(value: string): string | null {
    try {
        const url = new URL(value);

        return url.protocol === "https:" || url.protocol === "http:"
            ? url.href
            : null;
    } catch {
        return null;
    }
}