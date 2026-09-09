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
    Loader
} from "lucide-react";

import toast from "react-hot-toast";


export const Roads = () => {

    const [
        roads,
        setRoads
    ] =
        useState([]);

    const [
        loading,
        setLoading
    ] =
        useState(true);


    useEffect(() => {

        api.getRoads()

            .then(
                setRoads
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

            <h2
                style={{
                    marginBottom:
                        16
                }}
            >
                Road Accessibility Overview
            </h2>


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

                        Loading roads...

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Road ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Accessibility
                                    </th>

                                    <th>
                                        Last Updated
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {roads.map(
                                    road =>
                                        (

                                            <tr
                                                key={
                                                    road.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        road.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        road.name
                                                    }
                                                </td>

                                                <td>
                                                    <Badge>
                                                        {
                                                            road.status
                                                        }
                                                    </Badge>
                                                </td>

                                                <td>
                                                    {
                                                        road.riskScore
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        road.lastUpdated
                                                    }
                                                </td>

                                            </tr>

                                        )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};