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

    variables:
        Readonly<
            Record<string, number>
        >;

};