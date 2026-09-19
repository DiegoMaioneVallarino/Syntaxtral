import {
    additionNode,
    equalityNode,
    functionCallNode,
    functionDefinitionNode,
    multiplicationNode,
    numberNode,
    powerNode,
    symbolNode,
    vectorNode,
    comparisonNode,
    projectionIntersectionNode,
    projectionRegionNode
} from "../../../syntaxtral/expression";

import type {
    CreatableObject3DKind,
    Object3DFormulaPreset
} from "./types";


export function createObject3DFormulaPreset(
    kind: CreatableObject3DKind
): Object3DFormulaPreset {

    switch (kind) {

        case "explicit-surface":

            return {

                title:
                    "Superficie explícita",

                expression:
                    equalityNode(

                        symbolNode(
                            "z"
                        ),

                        multiplicationNode([
                            symbolNode("x"),
                            symbolNode("y")
                        ])

                    ),

                representation: {

                    kind:
                        "explicit-surface",

                    dependentAxis:
                        "z"

                }

            };


        case "implicit-surface":

            return {

                title:
                    "Superficie implícita",

                expression:
                    equalityNode(

                        additionNode([

                            powerNode(
                                symbolNode("x"),
                                numberNode(2)
                            ),

                            powerNode(
                                symbolNode("y"),
                                numberNode(2)
                            ),

                            powerNode(
                                symbolNode("z"),
                                numberNode(2)
                            )

                        ]),

                        numberNode(1)

                    ),

                representation: {

                    kind:
                        "implicit-surface",

                    isoValue:
                        0

                }

            };

            case "implicit-torus":

    return {

        title:
            "Toro implícito",

        expression:
            equalityNode(

                powerNode(

                    additionNode([

                        powerNode(
                            symbolNode("x"),
                            numberNode(2)
                        ),

                        powerNode(
                            symbolNode("y"),
                            numberNode(2)
                        ),

                        powerNode(
                            symbolNode("z"),
                            numberNode(2)
                        ),

                        numberNode(8)

                    ]),

                    numberNode(2)

                ),

                multiplicationNode([

                    numberNode(36),

                    additionNode([

                        powerNode(
                            symbolNode("x"),
                            numberNode(2)
                        ),

                        powerNode(
                            symbolNode("y"),
                            numberNode(2)
                        )

                    ])

                ])

            ),

        representation: {

            kind:
                "implicit-surface",

            isoValue:
                0

        }

    };



    case "inequality-solid":

    return {
        title: "Sólido por desigualdad",

        expression: comparisonNode(
            additionNode([
                powerNode(
                    symbolNode("x"),
                    numberNode(2)
                ),

                powerNode(
                    symbolNode("y"),
                    numberNode(2)
                ),

                powerNode(
                    symbolNode("z"),
                    numberNode(2)
                )
            ]),

            "less-or-equal",

            numberNode(4)
        ),

        representation: {
            kind: "inequality-solid",
            relation: "less-or-equal",
            threshold: 0
        }
    };
        case "projection-intersection": {
    function disk(
        firstAxis: string,
        secondAxis: string
    ) {
        return comparisonNode(
            additionNode([
                powerNode(
                    symbolNode(firstAxis),
                    numberNode(2)
                ),
                powerNode(
                    symbolNode(secondAxis),
                    numberNode(2)
                )
            ]),
            "less-or-equal",
            numberNode(4)
        );
    }

    return {
        title: "Intersección de vistas",

        expression: projectionIntersectionNode(
            projectionRegionNode(
                "xy",
                "cartesian",
                [disk("x", "y")]
            ),
            projectionRegionNode(
                "yz",
                "cartesian",
                [disk("y", "z")]
            ),
            projectionRegionNode(
                "xz",
                "cartesian",
                [disk("x", "z")]
            )
        ),

        representation: {
            kind: "projection-intersection"
        }
    };
}
case "parametric-surface":

    return {

        title:
            "Toro paramétrico",

        expression:
            functionDefinitionNode(

                symbolNode(
                    "r"
                ),

                [
                    symbolNode("u"),
                    symbolNode("v")
                ],

                vectorNode([

                    /*
                     * x(u,v) =
                     * (3 + cos(v)) cos(u)
                     */
                    multiplicationNode([

                        additionNode([

                            numberNode(3),

                            functionCallNode(
                                "cos",
                                [
                                    symbolNode("v")
                                ]
                            )

                        ]),

                        functionCallNode(
                            "cos",
                            [
                                symbolNode("u")
                            ]
                        )

                    ]),


                    /*
                     * y(u,v) =
                     * (3 + cos(v)) sin(u)
                     */
                    multiplicationNode([

                        additionNode([

                            numberNode(3),

                            functionCallNode(
                                "cos",
                                [
                                    symbolNode("v")
                                ]
                            )

                        ]),

                        functionCallNode(
                            "sin",
                            [
                                symbolNode("u")
                            ]
                        )

                    ]),


                    /*
                     * z(u,v) = sin(v)
                     */
                    functionCallNode(
                        "sin",
                        [
                            symbolNode("v")
                        ]
                    )

                ])

            ),

        representation: {

            kind:
                "parametric-surface",

            parameterU:
                "u",

            parameterV:
                "v",

            minimumU:
                0,

            maximumU:
                Math.PI * 2,

            minimumV:
                0,

            maximumV:
                Math.PI * 2

        }

    };
    }

}