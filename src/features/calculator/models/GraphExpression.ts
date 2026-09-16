import type {
    FormulaRepresentation
} from "../object3d";


export type GraphCoordinateSystem =
    | "cartesian"
    | "polar";


export type GraphExpression = {

    readonly id:
        string;

    expression:
        string;

    color:
        string;

    visible:
        boolean;

    is3D:
        boolean;

    coordinateSystem:
        GraphCoordinateSystem;

    representation:
        FormulaRepresentation;

    variables:
        Readonly<
            Record<string, unknown>
        >;

};