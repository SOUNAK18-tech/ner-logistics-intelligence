import {
    useEffect,
    useState
} from "react";

import {
    api
} from "../services/api";

import {
    Badge
} from "../components/common/Badge";

import {
    PageHeader
} from "../components/common/PageHeader";

import {
    VehicleLiveModal
} from "../components/vehicles/VehicleLiveModal";

import {
    ShieldAlert,
    Loader
} from "lucide-react";

import toast from "react-hot-toast";


export const Vehicles = () => {

    const [
        vehicles,
        setVehicles
    ] =
        useState([]);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        liveVehicle,
        setLiveVehicle
    ] =
        useState(null);


    useEffect(() => {

        api.getVehicles()

            .then(
                setVehicles
            )

            .catch(
                error =>
                    toast.error(
                        error.message
                    )
            )

            .finally(() =>
                setLoading(false)
            );

    }, []);


    return (

        <div>

            <PageHeader
                title="Vehicle Fleet Monitoring"
                description="Real-time tracking of logistics assets."
            />


            <div className="card">

                {loading ? (

                    <div
                        style={{
                            padding:
                                30,
                            display:
                                "flex",
                            gap:
                                8
                        }}
                    >

                        <Loader size={18} />

                        Loading vehicles...

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Vehicle ID
                                    </th>

                                    <th>
                                        Cargo
                                    </th>

                                    <th>
                                        Priority
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Destination
                                    </th>

                                    <th>
                                        ETA
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {vehicles.map(
                                    v => (

                                        <tr
                                            key={
                                                v.id
                                            }
                                        >

                                            <td
                                                style={{
                                                    fontWeight:
                                                        600
                                                }}
                                            >

                                                {
                                                    v.id
                                                }

                                                {v.priority ===
                                                    "CRITICAL" && (

                                                    <ShieldAlert
                                                        size={14}
                                                        color="var(--danger)"
                                                        style={{
                                                            marginLeft:
                                                                8
                                                        }}
                                                    />

                                                )}

                                            </td>

                                            <td>
                                                {
                                                    v.cargo
                                                }
                                            </td>

                                            <td>
                                                <Badge>
                                                    {
                                                        v.priority
                                                    }
                                                </Badge>
                                            </td>

                                            <td>
                                                <Badge>
                                                    {
                                                        v.status
                                                    }
                                                </Badge>
                                            </td>

                                            <td>
                                                {
                                                    v.destination
                                                }
                                            </td>

                                            <td>
                                                {
                                                    v.eta
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        setLiveVehicle(
                                                            v
                                                        )
                                                    }
                                                >
                                                    View Live
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {liveVehicle && (

                <VehicleLiveModal
                    vehicle={
                        liveVehicle
                    }
                    onClose={() =>
                        setLiveVehicle(
                            null
                        )
                    }
                />

            )}

        </div>

    );

};