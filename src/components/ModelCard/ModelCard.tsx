import "./ModelCard.css";

import type {
    MathematicalModel
} from "../../models/MathematicalModel";


type ModelCardProps = {

    model: MathematicalModel;

};


function ModelCard({
    model
}: ModelCardProps) {

    const formattedLikes =
        model.likes >= 1000
            ? `${(model.likes / 1000).toFixed(1)}K`
            : model.likes;


    return (
        <article className="modelCard">

            <div
                className="modelCardPreview"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            135deg,
                            rgba(12, 4, 35, 0.1),
                            rgba(5, 5, 10, 0.75)
                        ),
                        url("${model.imagePath}")
                    `
                }}
            >

                <div className="modelCardGrid" />

                <span className="modelCardCategory">
                    {model.categoryLabel}
                </span>

            </div>


            <div className="modelCardContent">

                <div className="modelCardTitleRow">

                    <h2>
                        {model.title}
                    </h2>

                    <button
                        type="button"
                        className="modelCardMenu"
                        aria-label={`Opciones de ${model.title}`}
                    >
                        •••
                    </button>

                </div>


                <div className="modelCardMetadata">

                    <div className="modelCardAuthor">

                        <span className="modelCardAvatar">
                            {model.author
                                .split(" ")
                                .map(word => word[0])
                                .join("")
                            }
                        </span>

                        <span>
                            {model.author}
                        </span>

                    </div>


                    <div className="modelCardTopics">

                        {model.topics.map(topic => (
                            <span key={topic}>
                                {topic}
                            </span>
                        ))}

                    </div>

                </div>


                <div className="modelCardStatistics">

                    <span>
                        ♡ {formattedLikes}
                    </span>

                    <span>
                        ⑂ {model.forks}
                    </span>

                </div>

            </div>

        </article>
    );
}


export default ModelCard;