import {
    NavLink
} from "react-router-dom";

import {
    LayoutDashboard,
    Truck,
    Route,
    AlertTriangle,
    Package,
    Bell,
    Settings,
    Navigation,
    UserPlus,
    Car,
    KeyRound,
    UserCheck
} from "lucide-react";


const getUser =
    () => {

        try {

            return JSON.parse(

                localStorage.getItem(
                    "sih26002_user"
                )

            );

        } catch {

            return null;

        }

    };


export const Sidebar = () => {

    const user =
        getUser();

    const isAdmin =
        user?.role ===
        "ADMIN";


    const mainItems = [

        {
            path:
                "/dashboard",
            label:
                "Dashboard",
            icon:
                LayoutDashboard
        },

        {
            path:
                "/vehicles",
            label:
                "Vehicles",
            icon:
                Truck
        },

        {
            path:
                "/roads",
            label:
                "Roads",
            icon:
                Route
        },

        {
            path:
                "/incidents",
            label:
                "Incidents",
            icon:
                AlertTriangle
        },

        {
            path:
                "/deliveries",
            label:
                "Deliveries",
            icon:
                Package
        },

        {
            path:
                "/alerts",
            label:
                "Alerts",
            icon:
                Bell
        },

        {
            path:
                "/route-planner",
            label:
                "Route Planner",
            icon:
                Navigation
        }

    ];


    const personnelItems = [

        {
            path:
                "/register-officer",
            label:
                "Register Officer",
            icon:
                UserPlus
        },

        {
            path:
                "/register-operator",
            label:
                "Register Operator",
            icon:
                Car
        },

        {
            path:
                "/account",
            label:
                "Account",
            icon:
                KeyRound
        }

    ];


    return (

        <aside className="sidebar">

            <div className="sidebar-header">

                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap:
                            10
                    }}
                >

                    <div
                        style={{
                            width:
                                4,
                            height:
                                32,
                            borderRadius:
                                2,
                            background:
                                "var(--sky)"
                        }}
                    />

                    <div>

                        <div
                            style={{
                                fontSize:
                                    "1rem",
                                fontWeight:
                                    800,
                                color:
                                    "var(--sky-dark)"
                            }}
                        >
                            SIH26002
                        </div>

                        <div
                            style={{
                                fontSize:
                                    "0.65rem",
                                color:
                                    "var(--slate)",
                                fontWeight:
                                    500,
                                textTransform:
                                    "uppercase"
                            }}
                        >
                            Logistics Intelligence
                        </div>

                    </div>

                </div>

            </div>


            <nav className="sidebar-nav">

                {mainItems.map(
                    item => (

                        <NavLink
                            key={
                                item.path
                            }
                            to={
                                item.path
                            }
                            className={
                                ({
                                    isActive
                                }) =>
                                    isActive
                                        ? "nav-item active"
                                        : "nav-item"
                            }
                        >

                            <item.icon
                                size={19}
                            />

                            <span>
                                {
                                    item.label
                                }
                            </span>

                        </NavLink>

                    )
                )}


                {isAdmin && (

                    <>

                        <div
                            style={{
                                fontSize:
                                    "0.58rem",
                                fontWeight:
                                    800,
                                color:
                                    "var(--slate-soft)",
                                textTransform:
                                    "uppercase",
                                padding:
                                    "12px 20px 4px"
                            }}
                        >
                            Personnel
                        </div>


                        {personnelItems.map(
                            item => (

                                <NavLink
                                    key={
                                        item.path
                                    }
                                    to={
                                        item.path
                                    }
                                    className={
                                        ({
                                            isActive
                                        }) =>
                                            isActive
                                                ? "nav-item active"
                                                : "nav-item"
                                    }
                                >

                                    <item.icon
                                        size={19}
                                    />

                                    <span>
                                        {
                                            item.label
                                        }
                                    </span>

                                </NavLink>

                            )
                        )}


                        <NavLink
                            to="/admin-approvals"
                            className={
                                ({
                                    isActive
                                }) =>
                                    isActive
                                        ? "nav-item active"
                                        : "nav-item"
                            }
                        >

                            <UserCheck
                                size={19}
                            />

                            <span>
                                Account Approvals
                            </span>

                        </NavLink>

                    </>

                )}


                <div
                    style={{
                        fontSize:
                            "0.58rem",
                        fontWeight:
                            800,
                        color:
                            "var(--slate-soft)",
                        textTransform:
                            "uppercase",
                        padding:
                            "12px 20px 4px"
                    }}
                >
                    System
                </div>


                <NavLink
                    to="/settings"
                    className={
                        ({
                            isActive
                        }) =>
                            isActive
                                ? "nav-item active"
                                : "nav-item"
                    }
                >

                    <Settings
                        size={19}
                    />

                    <span>
                        Settings
                    </span>

                </NavLink>

            </nav>

        </aside>

    );

};