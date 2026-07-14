import { Tabs } from "../../components/ui/Tabs";
import { Select } from "../../components/ui/Select";

const mockLocations = [
    { id: 1, name: "Jeddah Elite Sports Center" },
    { id: 2, name: "Riyadh Sports Hub" }
];

// const events = ["Registration", "Document Request", "Fee Invoice", "Payment Reminder", "Session Start"];
const gateways = [
    { name: "Secure Payments", connected: true },
    { name: "PayTabs", connected: false },
    { name: "HyperPay", connected: false },
];

export function Settings() {
    const generalContent = (
        <Card
            title="Academy Profile"
            description="Manage academy information, currency, and timezone settings."
        >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Academy Name">
                    <input
                        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        defaultValue="Neomora Sports Academy"
                    />
                </Field>

                <Field label="Default Currency">
                    <Select className="h-11 px-4" containerClassName="w-full">
                        <option value="SAR">SAR · Saudi Riyal</option>
                        <option value="AED">AED · UAE Dirham</option>
                        <option value="USD">USD · US Dollar</option>
                    </Select>
                </Field>

                <Field label="Timezone">
                    <Select className="h-11 px-4" containerClassName="w-full">
                        <option value="Asia/Riyadh">
                            Asia/Riyadh (GMT+3)
                        </option>

                        <option value="Asia/Dubai">
                            Asia/Dubai (GMT+4)
                        </option>
                    </Select>
                </Field>

                <div className="rounded-xl border border-border bg-surface-muted p-5">
                    <h4 className="text-sm font-semibold text-text">
                        Academy Summary
                    </h4>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-muted">
                                Academy
                            </span>

                            <span className="text-sm font-medium text-text">
                                Neomora Sports Academy
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-muted">
                                Currency
                            </span>

                            <span className="text-sm font-medium text-text">
                                SAR
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-muted">
                                Timezone
                            </span>

                            <span className="text-sm font-medium text-text">
                                GMT +3
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-border pt-5">
                <button className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary/90">
                    Save Changes
                </button>
            </div>
        </Card>
    );

    // const notificationsContent = (
    //     <Card title="Notification Channels">
    //         <table className="w-full text-sm">
    //             <thead>
    //                 <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
    //                     <th className="py-2">Event</th>
    //                     <th className="w-32 py-2 text-center">WhatsApp</th>
    //                     <th className="w-32 py-2 text-center">Email</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {events.map((ev, i) => (
    //                     <tr key={ev} className="border-b border-border last:border-0">
    //                         <td className="py-3 font-medium text-text">{ev}</td>
    //                         <td className="py-3 text-center">
    //                             <input type="checkbox" defaultChecked={i % 2 === 0} className="w-4 h-4 accent-primary" />
    //                         </td>
    //                         <td className="py-3 text-center">
    //                             <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
    //                         </td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     </Card>
    // );

    const gatewaysContent = (
        <div className="grid gap-4 md:grid-cols-3">
            {gateways.map((g) => (
                <div key={g.name} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-muted text-sm font-bold text-text-muted">
                        {g.name[0]}
                    </div>
                    <h3 className="mt-4 font-semibold text-text">{g.name}</h3>
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${g.connected ? "bg-success/10 text-success ring-success/20" : "bg-surface-muted text-text-muted ring-border"
                        }`}>
                        {g.connected ? "Connected" : "Not Connected"}
                    </span>
                    <button className="mt-4 w-full rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-surface-muted transition-colors">
                        Configure
                    </button>
                </div>
            ))}
        </div>
    );

    const localisationContent = (
        <Card title="Language">
            <Field label="Interface Language">
                <Select className="h-10 px-3 py-2" containerClassName="w-48">
                    <option value="en">English</option>
                    {/* <option value="ar">العربية</option> */}
                </Select>
            </Field>
            <div className="space-y-3 pt-3">
                <label className="text-sm font-medium leading-none text-text">Default language per location</label>
                <div className="space-y-2">
                    {mockLocations.map((l) => (
                        <div key={l.id} className="flex items-center justify-between rounded-md border border-border p-3">
                            <span className="text-sm font-medium text-text">{l.name}</span>
                            <Select className="h-10 px-3 py-2" containerClassName="w-40">
                                <option value="en">English</option>
                                {/* <option value="ar">العربية</option> */}
                            </Select>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    const tabsData = [
        { id: "general", label: "General", content: generalContent },
        // { id: "notifications", label: "Notifications", content: notificationsContent },
        { id: "gateways", label: "Payment Gateways", content: gatewaysContent },
        { id: "localisation", label: "Localisation", content: localisationContent },
    ];

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text">Settings</h1>
                    <p className="text-sm text-text-muted mt-1">Configure academy preferences</p>
                </div>
            </div>
            <div>
                <Tabs tabs={tabsData} />
            </div>
        </>
    );
}

function Card({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-5xl rounded-2xl border border-border bg-surface p-7 shadow-sm">
            <div className="mb-6 border-b border-border pb-5">
                <h3 className="text-lg font-semibold text-text">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-sm text-text-muted">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </div>
    );
}
function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-text">
                {label}
            </label>

            {children}
        </div>
    );
}
