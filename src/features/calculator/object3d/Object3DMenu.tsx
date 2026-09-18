import "./Object3DMenu.css";

import type {
    CreatableObject3DKind,
    Object3DKind
} from "./types";


type Object3DMenuProps = {

    onCreate: (
        kind: CreatableObject3DKind
    ) => void;

};


type CommonObject3DMenuItem = {

    readonly symbol:
        string;

    readonly name:
        string;

    readonly description:
        string;

};


type AvailableObject3DMenuItem =
    CommonObject3DMenuItem & {

        readonly kind:
            CreatableObject3DKind;

        readonly available:
            true;

    };


type UnavailableObject3DMenuItem =
    CommonObject3DMenuItem & {

        readonly kind:
            Exclude<
                Object3DKind,
                CreatableObject3DKind
            >;

        readonly available:
            false;

    };


type Object3DMenuItem =
    | AvailableObject3DMenuItem
    | UnavailableObject3DMenuItem;


const objectItems:
    readonly Object3DMenuItem[] = [

        {
            kind:
                "explicit-surface",

            symbol:
                "▦",

            name:
                "Superficie explícita",

            description:
                "Construye una superficie como z = f(x,y).",

            available:
                true
        },

        {
            kind:
                "implicit-surface",

            symbol:
                "◇",

            name:
                "Superficie implícita",

            description:
                "Encuentra los puntos donde F(x,y,z) = c.",

            available:
                true
        },
{
    kind:
        "implicit-torus",

    symbol:
        "◉",

    name:
        "Toro implícito",

    description:
        "Construye un toro mediante una ecuación implícita.",

    available:
        true
},
        {
    kind:
        "parametric-surface",

    symbol:
        "◎",

    name:
        "Superficie paramétrica",

    description:
        "Define x, y y z mediante dos parámetros.",

    available:
        true
},

        {
    kind: "inequality-solid",

    symbol: "⬢",

    name: "Sólido por desigualdad",

    description:
        "Define una región del espacio mediante una desigualdad.",

    available: true
},
        {
            kind:
                "projection-intersection",

            symbol:
                "▣",

            name:
                "Intersección de vistas",

            description:
                "Combina restricciones vistas desde X, Y y Z.",

            available:
                false
        }

    ];


export function Object3DMenu({
    onCreate
}: Object3DMenuProps) {

    return (
        <section className="object3DMenu">

            <header className="object3DMenuIntro">

                <span>
                    Syntaxtral geometry
                </span>

                <p>
                    Elige cómo será definida la fórmula
                    tridimensional.
                </p>

            </header>


            <div className="object3DMenuGrid">

                {objectItems.map(item => (

                    <button
                        key={item.kind}
                        type="button"
                        className={`
                            object3DMenuItem
                            ${
                                !item.available
                                    ? "object3DMenuItemUnavailable"
                                    : ""
                            }
                        `}
                        disabled={
                            !item.available
                        }
                        aria-label={
                            item.available
                                ? `Crear ${item.name}`
                                : `${item.name}: próximamente`
                        }
                        onClick={() => {

                            /*
                             * Este if también permite que
                             * TypeScript sepa que item.kind
                             * es CreatableObject3DKind.
                             */
                            if (!item.available) {
                                return;
                            }


                            onCreate(
                                item.kind
                            );

                        }}
                    >

                        <span className="object3DMenuSymbol">
                            {item.symbol}
                        </span>


                        <span className="object3DMenuContent">

                            <strong>
                                {item.name}
                            </strong>

                            <small>
                                {item.description}
                            </small>

                        </span>


                        {item.available
                            ? (
                                <span className="object3DMenuArrow">
                                    +
                                </span>
                            )
                            : (
                                <span className="object3DMenuComingSoon">
                                    Soon
                                </span>
                            )
                        }

                    </button>

                ))}

            </div>

        </section>
    );

}


export default Object3DMenu;