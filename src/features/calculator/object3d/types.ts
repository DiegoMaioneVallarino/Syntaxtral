import type {
    ExpressionNode
} from "../../../syntaxtral/expression";


export type Object3DKind =
    | "explicit-surface"
    | "implicit-surface"
    | "implicit-torus"
    | "parametric-surface"
    | "inequality-solid"
    | "projection-intersection"
    | "projection-intersection"


export type CreatableObject3DKind =
    | "explicit-surface"
    | "implicit-surface"
    | "implicit-torus"
    | "parametric-surface"
    | "inequality-solid"
    | "projection-intersection";


export type FormulaRepresentation =
    | {
        readonly kind:
            "curve";
    }
    | {
        readonly kind:
            "explicit-surface";

        readonly dependentAxis:
            "x" |
            "y" |
            "z";
    }
    | {
        readonly kind:
            "implicit-surface";

        readonly isoValue:
            number;
    }
    | {
    readonly kind:
        "parametric-surface";

    readonly parameterU:
        string;

    readonly parameterV:
        string;

    readonly minimumU:
        number;

    readonly maximumU:
        number;

    readonly minimumV:
        number;

    readonly maximumV:
        number;
}
    | {
        readonly kind:
            "inequality-solid";

        readonly relation:
            "less" |
            "less-or-equal" |
            "greater" |
            "greater-or-equal";

        readonly threshold:
            number;
    }
    | {
        readonly kind:
            "projection-intersection";
    };


export type Object3DFormulaPreset = {

    readonly title:
        string;

    readonly expression:
        ExpressionNode;

    readonly representation:
        FormulaRepresentation;

};