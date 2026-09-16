import type {
    ExpressionNode
} from "../../../syntaxtral/expression";


export type Object3DKind =
    | "explicit-surface"
    | "parametric-surface"
    | "implicit-surface"
    | "inequality-solid"
    | "projection-intersection";


export type CreatableObject3DKind =
    | "explicit-surface"
    | "implicit-surface";


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