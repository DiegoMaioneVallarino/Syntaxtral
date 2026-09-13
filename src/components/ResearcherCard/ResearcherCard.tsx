import "./ResearcherCard.css";

import type {
    Researcher
} from "../../models/Researcher";


type ResearcherCardProps = {

    researcher: Researcher;

    isFollowing: boolean;

    onToggleFollow: (
        researcherId: string
    ) => void;

};


function formatFollowers(
    followers: number
): string {

    if (followers < 1000) {
        return followers.toString();
    }


    return `${(
        followers / 1000
    ).toFixed(1)}K`;

}


function getInitials(
    name: string
): string {

    return name
        .split(" ")
        .map(word => word[0])
        .join("");

}


function ResearcherCard({
    researcher,
    isFollowing,
    onToggleFollow
}: ResearcherCardProps) {

    return (
        <article className="researcherCard">

            <div className="researcherCardDecoration">

                <span>
                    {researcher.fieldLabel}
                </span>

                <div className="researcherOrbit">

                    <div />

                    <div />

                    <div />

                </div>

            </div>


            <div className="researcherCardProfile">

                <div className="researcherAvatar">

                    {getInitials(
                        researcher.name
                    )}

                </div>


                <div className="researcherIdentity">

                    <h2>
                        {researcher.name}
                    </h2>

                    <span>
                        {researcher.username}
                    </span>

                </div>


                <button
                    type="button"
                    className={
                        isFollowing
                            ? "followButton followButtonActive"
                            : "followButton"
                    }
                    onClick={() => {
                        onToggleFollow(
                            researcher.id
                        );
                    }}
                >
                    {isFollowing
                        ? "Siguiendo"
                        : "Seguir"
                    }
                </button>

            </div>


            <p className="researcherBiography">

                {researcher.biography}

            </p>


            <div className="researcherSpecialties">

                {researcher.specialties.map(
                    specialty => (

                        <span key={specialty}>
                            {specialty}
                        </span>

                    )
                )}

            </div>


            <div className="researcherLocation">

                <span>
                    ⌖
                </span>

                {researcher.location}

            </div>


            <div className="researcherStatistics">

                <div>

                    <strong>
                        {researcher.projects}
                    </strong>

                    <span>
                        Proyectos
                    </span>

                </div>


                <div>

                    <strong>
                        {researcher.publications}
                    </strong>

                    <span>
                        Publicaciones
                    </span>

                </div>


                <div>

                    <strong>
                        {formatFollowers(
                            researcher.followers
                        )}
                    </strong>

                    <span>
                        Seguidores
                    </span>

                </div>

            </div>

        </article>
    );
}


export default ResearcherCard;