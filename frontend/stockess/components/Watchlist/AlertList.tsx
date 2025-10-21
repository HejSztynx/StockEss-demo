import SelectableList from "../Common/SelectableList";
import { formatAlert } from "./WatchlistService";
import { useWatchlistContext } from "@/context/WatchlistContext";
import CreateAlertButton from "./CreateAlertButton";

export default function AlertList() {
    const {
        alerts,
        selectedAlert,
        handleSelectAlert,
    } = useWatchlistContext();

    return (
        <div className="w-[20%] border-r border-gray-200 p-0">
            <div className="w-full h-full">
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium rounded-md text-center">
                    Your Alerts
                </div>
                
                <CreateAlertButton/>

                <div className="max-h-[80vh] overflow-y-auto">
                    <SelectableList
                        items={alerts}
                        selectedItem={selectedAlert}
                        onSelectItem={handleSelectAlert}
                        format={formatAlert}
                        renderExtra={(alert) => {
                            const hasUnread = alert.notifications?.some((n) => !n.read);
                            return hasUnread ? (
                            <span className="w-2 h-2 bg-red-500 rounded-full ml-2" />
                            ) : null;
                        }}
                    />
                </div>
            </div>
        </div>
    );
}