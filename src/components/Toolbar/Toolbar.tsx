import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link,
    NavLink
} from "react-router-dom";

import "./Toolbar.css";


function SearchIcon() {

    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                cx="11"
                cy="11"
                r="7"
            />

            <path d="M16 16L21 21" />
        </svg>
    );

}


function BellIcon() {

    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="
                    M18 8
                    A6 6 0 0 0 6 8
                    V13
                    L4 17
                    H20
                    L18 13
                    Z
                "
            />

            <path d="M10 20H14" />
        </svg>
    );

}


function Toolbar() {

    const [
        profileMenuOpen,
        setProfileMenuOpen
    ] = useState(
        false
    );


    const profileMenuRef =
        useRef<HTMLDivElement | null>(
            null
        );


    useEffect(() => {

        function handlePointerDown(
            event: PointerEvent
        ): void {

            const target =
                event.target;


            if (
                !(target instanceof Node) ||
                profileMenuRef.current?.contains(
                    target
                )
            ) {

                return;

            }


            setProfileMenuOpen(
                false
            );

        }


        function handleKeyDown(
            event: KeyboardEvent
        ): void {

            if (
                event.key === "Escape"
            ) {

                setProfileMenuOpen(
                    false
                );

            }

        }


        window.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "pointerdown",
                handlePointerDown
            );

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, []);


    function closeProfileMenu(): void {

        setProfileMenuOpen(
            false
        );

    }


    return (
        <header className="toolbar">

            <div className="titleArea">

                <Link
                    to="/"
                    className="logoLink"
                    aria-label="Ir al inicio"
                >
                    <div
                        className="logo"
                        role="img"
                        aria-label="Syntaxtral"
                    />
                </Link>

            </div>


            <nav
                className="toolbarNavigation"
                aria-label="Navegación principal"
            >

                <NavLink
                    to="/explore"
                    className={({ isActive }) =>
                        isActive
                            ? "navigationButton navigationButtonActive"
                            : "navigationButton"
                    }
                >
                    Explora
                </NavLink>


                <NavLink
                    to="/articles"
                    className={({ isActive }) =>
                        isActive
                            ? "navigationButton navigationButtonActive"
                            : "navigationButton"
                    }
                >
                    Artículos
                </NavLink>


                <NavLink
                    to="/community"
                    className={({ isActive }) =>
                        isActive
                            ? "navigationButton navigationButtonActive"
                            : "navigationButton"
                    }
                >
                    Comunidad
                </NavLink>


                <NavLink
                    to="/create"
                    className={({ isActive }) =>
                        isActive
                            ? "navigationButton navigationButtonActive"
                            : "navigationButton"
                    }
                >
                    Create
                </NavLink>


                <NavLink
                    to="/calculator"
                    className={({ isActive }) =>
                        isActive
                            ? "navigationButton navigationButtonActive"
                            : "navigationButton"
                    }
                >
                    Calculator
                </NavLink>
<NavLink
    to="/questions"
    className={({ isActive }) =>
        isActive
            ? "navigationButton navigationButtonActive"
            : "navigationButton"
    }
>
    Preguntas
</NavLink><NavLink
    to="/news"
    className={({ isActive }) =>
        isActive
            ? "navigationButton navigationButtonActive"
            : "navigationButton"
    }
>
    Noticias
</NavLink>
<NavLink
    to="/shaders"
    className={({ isActive }) =>
        isActive
            ? "navigationButton navigationButtonActive"
            : "navigationButton"
    }
>
    Shaders
</NavLink>
            </nav>


            <div className="toolbarActions">

                <label className="searchArea">

                    <span className="searchIcon">
                        <SearchIcon />
                    </span>

                    <input
                        type="search"
                        className="searchInput"
                        placeholder="Buscar modelos, usuarios, temas..."
                        aria-label="Buscar en Syntaxtral"
                    />

                </label>


                <button
                    type="button"
                    className="notificationButton"
                    aria-label="Notificaciones"
                >
                    <BellIcon />

                    <span className="notificationDot" />
                </button>


                <div
                    ref={profileMenuRef}
                    className="profileMenuArea"
                >

                    <button
                        type="button"
                        className={`profileButton ${
                            profileMenuOpen
                                ? "profileButtonActive"
                                : ""
                        }`}
                        aria-label="Abrir menú de perfil"
                        aria-haspopup="menu"
                        aria-expanded={
                            profileMenuOpen
                        }
                        onClick={() => {

                            setProfileMenuOpen(
                                previous =>
                                    !previous
                            );

                        }}
                    >
                        <span className="profileAvatar">
                            DM
                        </span>
                    </button>


                    {profileMenuOpen && (

                        <div
                            className="profileDropdown"
                            role="menu"
                        >

                            <header className="profileDropdownHeader">

                                <span className="profileDropdownAvatar">
                                    DM
                                </span>

                                <div>

                                    <strong>
                                        Dmitry Rybalkin
                                    </strong>

                                    <small>
                                        @dmitry
                                    </small>

                                </div>

                            </header>


                            <div className="profileDropdownStats">

                                <div>
                                    <strong>42</strong>
                                    <span>Proyectos</span>
                                </div>

                                <div>
                                    <strong>2.3K</strong>
                                    <span>Seguidores</span>
                                </div>

                            </div>


                            <nav className="profileDropdownNavigation">

                                <Link
                                    to="/profile"
                                    role="menuitem"
                                    onClick={
                                        closeProfileMenu
                                    }
                                >
                                    <span>◉</span>
                                    Mi perfil
                                </Link>

                                <Link
                                    to="/profile?tab=projects"
                                    role="menuitem"
                                    onClick={
                                        closeProfileMenu
                                    }
                                >
                                    <span>◇</span>
                                    Mis proyectos
                                </Link>

                                <Link
                                    to="/profile?tab=articles"
                                    role="menuitem"
                                    onClick={
                                        closeProfileMenu
                                    }
                                >
                                    <span>▤</span>
                                    Mis artículos
                                </Link>

                                <Link
                                    to="/profile?tab=saved"
                                    role="menuitem"
                                    onClick={
                                        closeProfileMenu
                                    }
                                >
                                    <span>♡</span>
                                    Guardados
                                </Link>

                            </nav>


                            <div className="profileDropdownFooter">

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={
                                        closeProfileMenu
                                    }
                                >
                                    <span>⚙</span>
                                    Configuración
                                </button>

                                <button
                                    type="button"
                                    className="profileLogoutButton"
                                    role="menuitem"
                                    onClick={
                                        closeProfileMenu
                                    }
                                >
                                    <span>↪</span>
                                    Cerrar sesión
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );

}


export default Toolbar;