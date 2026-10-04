import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./NotificationsPopover.css";

type NotificationKind = "answer" | "follow" | "article" | "project";

type DemoNotification = {
    id: string;
    kind: NotificationKind;
    actor: string;
    action: string;
    subject: string;
    time: string;
    to: string;
    read: boolean;
};

const examples: DemoNotification[] = [
    {
        id: "reply-polar",
        kind: "answer",
        actor: "Mateo Ruiz",
        action: "respondió la pregunta",
        subject: "¿Por qué algunas rosas polares tienen el doble de pétalos?",
        time: "Hace 12 min",
        to: "/questions?question=polar-rose#answer-polar-answer",
        read: false
    },
    {
        id: "new-follower",
        kind: "follow",
        actor: "Elena Ruiz",
        action: "comenzó a seguir tu perfil",
        subject: "",
        time: "Hace 2 h",
        to: "/community",
        read: false
    },
    {
        id: "article-activity",
        kind: "article",
        actor: "Kai Nakamura",
        action: "comentó tu artículo",
        subject: "Visualizaciones matemáticas",
        time: "Ayer",
        to: "/articles",
        read: false
    },
    {
        id: "project-activity",
        kind: "project",
        actor: "Sofia Laurent",
        action: "guardó tu proyecto de calculadora",
        subject: "Superficies geométricas",
        time: "Hace 3 días",
        to: "/calculator",
        read: true
    }
];

const icons: Record<NotificationKind, string> = {
    answer: "↩",
    follow: "+",
    article: "▤",
    project: "◇"
};

export default function NotificationsPopover() {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [notifications, setNotifications] = useState(examples);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const unreadCount = notifications.filter(item => !item.read).length;
    const visible = filter === "unread"
        ? notifications.filter(item => !item.read)
        : notifications;

    useEffect(() => {
        if (!open) return;

        function onPointerDown(event: PointerEvent) {
            if (
                event.target instanceof Node &&
                !containerRef.current?.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus();
            }
        }

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    function markRead(id: string) {
        setNotifications(current => current.map(item =>
            item.id === id ? { ...item, read: true } : item
        ));
    }

    return (
        <div ref={containerRef} className="notificationsArea">
            <button
                ref={buttonRef}
                type="button"
                className={`notificationButton${open ? " notificationButtonActive" : ""}`}
                aria-label={`Notificaciones: ${unreadCount} sin leer`}
                aria-expanded={open}
                aria-controls="notifications-panel"
                onClick={() => setOpen(current => !current)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 8 A6 6 0 0 0 6 8 V13 L4 17 H20 L18 13 Z" />
                    <path d="M10 20H14" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notificationCount" aria-hidden="true">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <section
                    id="notifications-panel"
                    className="notificationsPanel"
                    aria-label="Notificaciones"
                >
                    <header className="notificationsHeader">
                        <div>
                            <small>SYNTAXTRAL · DEMO</small>
                            <h2>Notificaciones</h2>
                        </div>
                        <span className="notificationsUnread">
                            {unreadCount} sin leer
                        </span>
                    </header>

                    <div className="notificationsControls">
                        <div className="notificationsFilters" aria-label="Filtrar notificaciones">
                            <button
                                type="button"
                                aria-pressed={filter === "all"}
                                onClick={() => setFilter("all")}
                            >
                                Todas
                            </button>
                            <button
                                type="button"
                                aria-pressed={filter === "unread"}
                                onClick={() => setFilter("unread")}
                            >
                                Pendientes
                            </button>
                        </div>
                        <button
                            type="button"
                            className="notificationsMarkAll"
                            disabled={unreadCount === 0}
                            onClick={() => setNotifications(current =>
                                current.map(item => ({ ...item, read: true }))
                            )}
                        >
                            Marcar todas como leídas
                        </button>
                    </div>

                    <div className="notificationsList">
                        {visible.length === 0 ? (
                            <div className="notificationsEmpty">
                                <span aria-hidden="true">✧</span>
                                <p>
                                    {notifications.length === 0
                                        ? "Todavía no hay notificaciones."
                                        : "Ya estás al día."}
                                </p>
                            </div>
                        ) : visible.map(item => (
                            <Link
                                key={item.id}
                                to={item.to}
                                className={`notificationsItem${item.read ? "" : " notificationsItemUnread"}`}
                                onClick={() => {
                                    markRead(item.id);
                                    setOpen(false);
                                }}
                            >
                                <span className={`notificationsItemIcon notificationsItemIcon-${item.kind}`} aria-hidden="true">
                                    {icons[item.kind]}
                                </span>
                                <span className="notificationsItemText">
                                    <span><strong>{item.actor}</strong> {item.action}</span>
                                    {item.subject && <span className="notificationsSubject">{item.subject}</span>}
                                    <time>{item.time}</time>
                                </span>
                                {!item.read && <span className="notificationsNewDot" aria-label="Sin leer" />}
                            </Link>
                        ))}
                    </div>

                    <footer className="notificationsFooter">
                        Actividad de ejemplo para explorar la interfaz.
                    </footer>
                </section>
            )}
        </div>
    );
}
