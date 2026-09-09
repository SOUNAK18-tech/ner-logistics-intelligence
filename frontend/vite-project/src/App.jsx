import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {
    Toaster
} from "react-hot-toast";

import {
    Layout
} from "./components/layout/Layout";

import {
    Dashboard
} from "./pages/Dashboard";

import {
    Vehicles
} from "./pages/Vehicles";

import {
    Roads
} from "./pages/Roads";

import {
    Incidents
} from "./pages/Incidents";

import {
    Deliveries
} from "./pages/Deliveries";

import {
    Alerts
} from "./pages/Alerts";

import {
    Settings
} from "./pages/Settings";

import {
    RoutePlanner
} from "./pages/RoutePlanner";

import {
    Login
} from "./pages/Login";

import {
    RegisterFieldOfficer
} from "./pages/RegisterFieldOfficer";

import {
    RegisterVehicleOperator
} from "./pages/RegisterVehicleOperator";

import {
    AccountDetails
} from "./pages/AccountDetails";

import {
    AdminApprovals
} from "./pages/AdminApprovals";


// ==============================
// AUTH HELPERS
// ==============================

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


const isLoggedIn =
    () => {

        return Boolean(

            localStorage.getItem(
                "sih26002_token"
            )

        );

    };


// ==============================
// PROTECTED ROUTE
// ==============================

const ProtectedRoute =
    ({
        children
    }) => {

        if (!isLoggedIn()) {

            return (
                <Navigate
                    to="/login"
                    replace
                />
            );

        }

        return children;

    };


// ==============================
// ADMIN ROUTE
// ==============================

const AdminRoute =
    ({
        children
    }) => {

        const user =
            getUser();


        if (!isLoggedIn()) {

            return (
                <Navigate
                    to="/login"
                    replace
                />
            );

        }


        if (
            user?.role !==
            "ADMIN"
        ) {

            return (
                <Navigate
                    to="/dashboard"
                    replace
                />
            );

        }


        return children;

    };


export default function App() {

    return (

        <>

            <Toaster
                position="top-right"
            />


            <BrowserRouter>

                <Routes>

                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />


                    <Route
                        path="/"
                        element={

                            <ProtectedRoute>

                                <Layout />

                            </ProtectedRoute>

                        }
                    >

                        <Route
                            index
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={
                                <Dashboard />
                            }
                        />

                        <Route
                            path="vehicles"
                            element={
                                <Vehicles />
                            }
                        />

                        <Route
                            path="roads"
                            element={
                                <Roads />
                            }
                        />

                        <Route
                            path="incidents"
                            element={
                                <Incidents />
                            }
                        />

                        <Route
                            path="deliveries"
                            element={
                                <Deliveries />
                            }
                        />

                        <Route
                            path="alerts"
                            element={
                                <Alerts />
                            }
                        />

                        <Route
                            path="route-planner"
                            element={
                                <RoutePlanner />
                            }
                        />

                        <Route
                            path="settings"
                            element={
                                <Settings />
                            }
                        />

                        <Route
                            path="register-officer"
                            element={
                                <AdminRoute>
                                    <RegisterFieldOfficer />
                                </AdminRoute>
                            }
                        />

                        <Route
                            path="register-operator"
                            element={
                                <AdminRoute>
                                    <RegisterVehicleOperator />
                                </AdminRoute>
                            }
                        />

                        <Route
                            path="admin-approvals"
                            element={
                                <AdminRoute>
                                    <AdminApprovals />
                                </AdminRoute>
                            }
                        />

                        <Route
                            path="account"
                            element={
                                <AccountDetails />
                            }
                        />

                    </Route>

                </Routes>

            </BrowserRouter>

        </>

    );

}