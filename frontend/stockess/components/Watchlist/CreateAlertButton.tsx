import { useWatchlistContext } from "@/context/WatchlistContext";
import { Button } from "../ui/button";

export default function CreateAlertButton() {
    const {
        setIsEditModalOpen,
        setEditedAlert: handleEditAlert,
    } = useWatchlistContext();

    const handleOpenCreateModal = () => {
        handleEditAlert(null);
        setIsEditModalOpen(true);
    };

    return (
        <Button
            variant="ghost"
            className="w-full justify-center text-sm py-1 rounded-md transition-colors"
            onClick={handleOpenCreateModal}
        >
        +
        </Button>
    )
}