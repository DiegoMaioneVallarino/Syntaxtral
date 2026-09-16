import {
    additionNode,
    equalityNode,
    multiplicationNode,
    numberNode,
    powerNode,
    symbolNode
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

    }

}