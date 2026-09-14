import {
    additionNode,
    fractionNode,
    functionCallNode,
    numberNode,
    powerNode,
    symbolNode
} from "./factories";


export const exampleExpression =
    fractionNode(

        additionNode([

            powerNode(

                symbolNode("x"),

                numberNode(2)

            ),

            numberNode(1)

        ]),

        functionCallNode(

            "sin",

            [
                symbolNode("x")
            ]

        )

    );