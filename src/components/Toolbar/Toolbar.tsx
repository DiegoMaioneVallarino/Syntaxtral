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
    return (
        <header className="toolbar">

            <div className="titleArea">

                <div
                    className="logo"
                    role="img"
                    aria-label="Syntaxtral"
                />

            </div>


            <nav
                className="toolbarNavigation"
                aria-label="Navegación principal"
            >

                <button
                    type="button"
                    className="navigationButton navigationButtonActive"
                >
                    Explora
                </button>

                <button
                    type="button"
                    className="navigationButton"
                >
                    Artículos
                </button>

                <button
                    type="button"
                    className="navigationButton"
                >
                    Comunidad
                </button>

                <button
                    type="button"
                    className="navigationButton"
                >
                    Create
                </button>

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


                <button
                    type="button"
                    className="profileButton"
                    aria-label="Abrir perfil"
                >
                    <span className="profileAvatar">
                        DM
                    </span>
                </button>

            </div>

        </header>
    );
}


export default Toolbar;