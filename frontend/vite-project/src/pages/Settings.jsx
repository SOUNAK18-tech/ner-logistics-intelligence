import {
    useEffect,
    useState
} from "react";

import {
    api
} from "../services/api";

import {
    PageHeader
} from "../components/common/PageHeader";

import toast from "react-hot-toast";


export const Settings = () => {

    const [
        settings,
        setSettings
    ] =
        useState({

            language:
                "English",

            notificationsEnabled:
                true,

            emailAlerts:
                true,

            smsAlerts:
                false,

            highRiskAlerts:
                true

        });


    useEffect(() => {

        api.getSettings()

            .then(
                data =>
                    setSettings(
                        data
                    )
            )

            .catch(
                error =>
                    toast.error(
                        error.message
                    )
            );

    }, []);


    const save =
        async () => {

            try {

                const data =
                    await api.updateSettings(
                        settings
                    );

                setSettings(
                    data
                );

                toast.success(
                    "Settings saved."
                );

            } catch (error) {

                toast.error(
                    error.message
                );

            }

        };


    return (

        <div>

            <PageHeader
                title="System Settings"
                description="Configure SIH26002 platform preferences."
            />


            <div className="card">

                <h3>
                    Notification Routing
                </h3>


                <label>

                    <input
                        type="checkbox"
                        checked={
                            settings.notificationsEnabled
                        }
                        onChange={e =>
                            setSettings(
                                s => ({
                                    ...s,
                                    notificationsEnabled:
                                        e.target.checked
                                })
                            )
                        }
                    />

                    Enable Notifications

                </label>


                <br />


                <label>

                    <input
                        type="checkbox"
                        checked={
                            settings.emailAlerts
                        }
                        onChange={e =>
                            setSettings(
                                s => ({
                                    ...s,
                                    emailAlerts:
                                        e.target.checked
                                })
                            )
                        }
                    />

                    Email Alerts

                </label>


                <br />


                <label>

                    <input
                        type="checkbox"
                        checked={
                            settings.highRiskAlerts
                        }
                        onChange={e =>
                            setSettings(
                                s => ({
                                    ...s,
                                    highRiskAlerts:
                                        e.target.checked
                                })
                            )
                        }
                    />

                    High-Risk Alerts

                </label>


                <br />


                <button
                    className="btn btn-primary"
                    onClick={save}
                >
                    Save Settings
                </button>

            </div>

        </div>

    );

};