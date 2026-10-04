import "./ResearcherBadges.css";

import type {
    ResearcherCredential,
    ResearcherCredentialKind
} from "../../models/Researcher";

type ResearcherBadgesProps = {
    credentials?: readonly ResearcherCredential[];
};

const symbols: Record<ResearcherCredentialKind, string> = {
    degree: "▤",
    outreach: "✦",
    award: "✧"
};

const statusLabels: Record<
    ResearcherCredential["status"],
    string
> = {
    declared: "Declarada · sin verificar",
    verified: "Verificada por la plataforma",
    demo: "Ejemplo de demostración"
};

export default function ResearcherBadges({
    credentials = []
}: ResearcherBadgesProps) {
    if (credentials.length === 0) {
        return null;
    }

    return (
        <div
            className="researcherBadges"
            aria-label="Formación, divulgación y reconocimientos"
        >
            {credentials.map(credential => (
                <details
                    key={credential.id}
                    className={`
                        researcherBadge
                        researcherBadge--${credential.kind}
                    `}
                >
                    <summary>
                        <span aria-hidden="true">
                            {symbols[credential.kind]}
                        </span>

                        <span>
                            {credential.title}
                        </span>

                        {credential.status === "verified" && (
                            <span aria-label="Verificada">
                                ✓
                            </span>
                        )}

                        {credential.status === "demo" && (
                            <small>Demo</small>
                        )}
                    </summary>

                    <div className="researcherBadgeDetails">
                        {credential.institution && (
                            <strong>
                                {credential.institution}
                            </strong>
                        )}

                        {credential.year && (
                            <span>
                                Año: {credential.year}
                            </span>
                        )}

                        <small>
                            {statusLabels[credential.status]}
                        </small>
                    </div>
                </details>
            ))}
        </div>
    );
}