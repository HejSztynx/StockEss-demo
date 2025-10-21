import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWatchlistContext } from "@/context/WatchlistContext";
import { deleteAlert } from "./WatchlistService";
import { useEffect, useState } from "react";

export function DeleteAlertModal() {
    const {
        selectedAlert,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        setSelectedAlert,
        refreshAlerts,
    } = useWatchlistContext();

    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        setMessage(null);
        setIsSuccess(false);
    }, [isDeleteModalOpen]);

    const handleDeleteAlert = async () => {
        if (!selectedAlert) return;
        try {
            const res = await deleteAlert(selectedAlert.id!);
            setIsSuccess(true);
            setMessage(res.message);
            
            setTimeout(() => {
                setMessage(null);
                setIsDeleteModalOpen(false);
                setSelectedAlert(null);
                refreshAlerts();
            }, 1000);
        } catch (err: any) {
            setIsSuccess(false);
            setMessage(err.message);
        }
    };

    return (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Alert</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to delete <strong>{selectedAlert?.name}</strong>?<br />
                    This action cannot be undone.
                </p>
                <p className={`${isSuccess ? "text-green-600" : "text-red-500"} text-center self-center`}>
                    {message || "\u00A0"}
                </p>
                {/* <DialogFooter className="flex justify-end gap-2"> */}
                    {/* <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeleting}
                    >
                    Cancel
                    </Button> */}
                    <Button
                    variant="destructive"
                    onClick={handleDeleteAlert}
                    // disabled={isDeleting}
                    >
                    Delete
                    </Button>
                {/* </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}