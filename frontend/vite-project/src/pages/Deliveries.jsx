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

import toast from "react-hot-toast";


export const Deliveries = () => {

    const [
        deliveries,
        setDeliveries
    ] =
        useState([]);


    useEffect(() => {

        api.getDeliveries()

            .then(
                setDeliveries
            )

            .catch(
                error =>
                    toast.error(
                        error.message
                    )
            );

    }, []);


    return (

        <div>

            <PageHeader
                title="Logistics Delivery Monitoring"
                description="Track active shipments, schedules, and route completion."
            />


            <div className="card">

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Delivery ID
                                </th>

                                <th>
                                    Vehicle & Cargo
                                </th>

                                <th>
                                    Route
                                </th>

                                <th>
                                    Priority
                                </th>

                                <th>
                                    Progress
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {deliveries.map(
                                del =>
                                    (

                                        <tr
                                            key={
                                                del.id
                                            }
                                        >

                                            <td
                                                style={{
                                                    fontWeight:
                                                        600
                                                }}
                                            >
                                                {
                                                    del.id
                                                }
                                            </td>

                                            <td>

                                                <div>
                                                    {
                                                        del.vehicle
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "0.75rem",
                                                        color:
                                                            "var(--text-secondary)"
                                                    }}
                                                >
                                                    {
                                                        del.cargo
                                                    }
                                                </div>

                                            </td>

                                            <td>

                                                {
                                                    del.source
                                                }

                                                {" → "}

                                                {
                                                    del.destination
                                                }

                                            </td>

                                            <td>
                                                <Badge>
                                                    {
                                                        del.priority
                                                    }
                                                </Badge>
                                            </td>

                                            <td>

                                                <div>

                                                    {
                                                        del.progress
                                                    }%

                                                </div>

                                                <div
                                                    className="progress-bar-container"
                                                >

                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width:
                                                                `${del.progress}%`
                                                        }}
                                                    />

                                                </div>

                                            </td>

                                            <td>
                                                <Badge>
                                                    {
                                                        del.status
                                                    }
                                                </Badge>
                                            </td>

                                        </tr>

                                    )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};