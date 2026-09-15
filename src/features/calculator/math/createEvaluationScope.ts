import {
    compile
} from "mathjs";

import type {
    EvalFunction
} from "mathjs";


const compiledBodyCache =
    new Map<string, EvalFunction>();


const MAXIMUM_SUM_TERMS =
    100_000;


function getCompiledBody(
    expression: string
): EvalFunction {

    const cached =
        compiledBodyCache.get(
            expression
        );


    if (cached) {
        return cached;
    }


    const compiled =
        compile(
            expression
        );


    compiledBodyCache.set(
        expression,
        compiled
    );


    return compiled;

}


export function createEvaluationScope(
    values:
        Readonly<
            Record<string, number>
        >
): Record<string, unknown> {

    const scope:
        Record<string, unknown> = {
            ...values
        };


    scope.syntaxtralSum = (
        bodyExpression:
            unknown,
        indexName:
            unknown,
        lowerBound:
            unknown,
        upperBound:
            unknown
    ): number => {

        if (
            typeof bodyExpression !== "string" ||
            typeof indexName !== "string" ||
            indexName.length === 0
        ) {

            return Number.NaN;

        }


        const start =
            Math.ceil(
                Number(
                    lowerBound
                )
            );


        const end =
            Math.floor(
                Number(
                    upperBound
                )
            );


        if (
            !Number.isFinite(start) ||
            !Number.isFinite(end)
        ) {

            return Number.NaN;

        }


        if (end < start) {
            return 0;
        }


        const termCount =
            end - start + 1;


        if (
            termCount >
            MAXIMUM_SUM_TERMS
        ) {

            return Number.NaN;

        }


        const compiledBody =
            getCompiledBody(
                bodyExpression
            );


        let total =
            0;


        for (
            let index = start;
            index <= end;
            index += 1
        ) {

            const term =
                Number(
                    compiledBody.evaluate({
                        ...scope,

                        [indexName]:
                            index
                    })
                );


            if (
                !Number.isFinite(term)
            ) {

                return Number.NaN;

            }


            total +=
                term;

        }


        return total;

    };


    return scope;

}