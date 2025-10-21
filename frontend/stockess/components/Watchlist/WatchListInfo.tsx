import { useWatchlistContext } from "@/context/WatchlistContext";
import WatchlistHomeScreen from "./WatchlistHomeScreen";
import AlertDetails from "./AlertDetails";
import { CreateAlertModal } from "./CreateAlertModal";

export default function WatchListInfo() {
    const {
        isEditModalOpen,
        selectedAlert,
        setIsEditModalOpen,
    } = useWatchlistContext();

    return (
        <div className="flex-1 p-2 overflow-y-auto">
            <CreateAlertModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />

            {selectedAlert ? (
                <AlertDetails/>
            ) : (
                <WatchlistHomeScreen />
            )}
        </div>
    )
}