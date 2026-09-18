import {
    useEffect,
    useRef
} from "react";

import {
    useFrame
} from "@react-three/fiber";

import type {
    BufferGeometry
} from "three";

const geometryElementCountCache =
    new WeakMap<
        BufferGeometry,
        number
    >();

function clamp01(
    value: number
): number {

    return Math.min(
        1,
        Math.max(
            0,
            value
        )
    );

}





function getGeometryElementCount(
    geometry: BufferGeometry
): number {

    const cachedCount =
        geometryElementCountCache.get(
            geometry
        );


    if (
        cachedCount !== undefined
    ) {

        return cachedCount;

    }


    let elementCount =
        0;


    if (
        Number.isFinite(
            geometry.drawRange.count
        ) &&
        geometry.drawRange.count > 0
    ) {

        elementCount =
            geometry.drawRange.count;

    } else if (
        geometry.index
    ) {

        elementCount =
            geometry.index.count;

    } else {

        const position =
            geometry.getAttribute(
                "position"
            );


        elementCount =
            position?.count ?? 0;

    }


    /*
     * Conservamos el número original antes de poner
     * temporalmente el drawRange en cero.
     *
     * WeakMap permite que la geometría sea liberada
     * automáticamente cuando se hace dispose.
     */
    geometryElementCountCache.set(
        geometry,
        elementCount
    );


    return elementCount;

}


export function useGeometryConstruction(
    geometry: BufferGeometry,
    durationMilliseconds:
        number = 520
): void {

    const startedAtRef =
        useRef<number | null>(
            null
        );


    const totalElementCountRef =
        useRef(
            0
        );


    useEffect(() => {

        totalElementCountRef.current =
            getGeometryElementCount(
                geometry
            );


        startedAtRef.current =
            null;


        geometry.setDrawRange(
            0,
            0
        );

    }, [
        geometry
    ]);


    useFrame(() => {

        if (
            startedAtRef.current === null
        ) {

            startedAtRef.current =
                performance.now();

        }


        const elapsed =
            performance.now() -
            startedAtRef.current;


        const progress =
    clamp01(

        elapsed /
        durationMilliseconds

    );


        const visibleElementCount =

            Math.floor(

                (
                    totalElementCountRef.current *
                    progress
                ) /

                3

            ) *

            3;


        geometry.setDrawRange(

            0,

            Math.min(
                visibleElementCount,
                totalElementCountRef.current
            )

        );

    });

}