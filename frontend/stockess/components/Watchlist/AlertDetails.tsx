import { useWatchlistContext } from "@/context/WatchlistContext";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { activateAlert, deactivateAlert, deleteAllNotifications, deleteNotification, readAllNotifications, readNotification } from "./WatchlistService";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { DeleteAlertModal } from "./DeleteAlertModal";
import AlertChartModal from "./AlertChartModal";
import { useState } from "react";

export default function AlertDetails() {
    const [showChart, setShowChart] = useState(false);
    const {
        selectedAlert,
        setIsEditModalOpen,
        setIsDeleteModalOpen,
        setEditedAlert,
        refreshAlerts,
    } = useWatchlistContext();

    const handleOpenEditModal = () => {
        setEditedAlert(selectedAlert);
        setIsEditModalOpen(true);
    };
    
    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };
    
    const handleToggleActive = async () => {
        if (!selectedAlert) return;
        try {
            if (selectedAlert.active) {
            await deactivateAlert(selectedAlert.id!);
            } else {
            await activateAlert(selectedAlert.id!);
            }

            refreshAlerts();
        } catch (err) {
            console.error("Failed to toggle alert state", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!selectedAlert || selectedAlert.notifications.length === 0) return;
        try {
            await readAllNotifications(selectedAlert.id!);

            refreshAlerts();
        } catch (e) {
            console.error("Failed to mark all notifications as read", e);
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        if (!selectedAlert) return;
        try {
            await readNotification(notificationId);

            refreshAlerts();
        } catch (e) {
            console.error("Failed to mark notification as read", e);
        }
    };

    const handleDeleteNotification = async (id: number) => {
        if (!selectedAlert) return;
        try {
            await deleteNotification(id);

            refreshAlerts();
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    const handleDeleteAllNotifications = async () => {
        if (!selectedAlert || selectedAlert.notifications.length === 0) return;
        try {
            await deleteAllNotifications(selectedAlert.id!);

            refreshAlerts();
        } catch (e) {
            console.error("Failed to delete all notifications", e);
        }
    };

    return (
        
        <div className="p-4 rounded space-y-2">
            <DeleteAlertModal/>

            <div className="flex justify-between">
                <div className="space-y-2">
                    <div><strong>Created at:</strong> {selectedAlert?.createdAt?.split("T")[0]}</div>
                    <div><strong>Start date:</strong> {selectedAlert?.startDate}</div>
                    <div><strong>Name:</strong> {selectedAlert?.name}</div>
                    <div><strong>Companies:</strong> {(selectedAlert?.companies || []).join(", ")}</div>
                    <div>
                        <strong>Conditions:</strong>
                        <ul className="list-disc list-inside">
                            {selectedAlert?.conditions.map((condition) => (
                            <li key={condition.id}>
                                Type: {condition.conditionType}, 
                                Value: {condition.value} {condition.valueType === "PERCENTAGE" ? "%" : "PLN"}, 
                                Period: {condition.period ? `${condition.period} days` : "N/A"}, 
                                OHLC: {condition.ohlcType}
                            </li>
                            ))}
                        </ul>
                    </div>
                    <div><strong>Trigger once:</strong> {selectedAlert?.once ? "Yes" : "No"}</div>
                    <div><strong>Active:</strong> {selectedAlert?.active ? "Yes" : "No"}</div>
                    <div className="flex gap-2">
                        <Button onClick={handleOpenEditModal}>Edit</Button>
                        <Button
                            variant={selectedAlert?.active ? "destructive" : "default"}
                            onClick={handleToggleActive}
                        >
                        {selectedAlert?.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button onClick={() => setShowChart(true)}>Check the past on the chart</Button>
                    </div>
                </div>
                <Button onClick={handleOpenDeleteModal} variant={"destructive"}>Delete</Button>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-4">
                    <strong>Notifications:</strong>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleMarkAllAsRead}
                            >
                            Read All
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAllNotifications}
                            >
                            Delete All
                        </Button>
                    </div>
                </div>
                <div className="overflow-y-auto border rounded p-2 space-y-2">
                    {selectedAlert?.notifications?.length ? (
                    selectedAlert.notifications.map((n) => (
                        <div
                            key={n.id}
                            className={cn(
                                "flex justify-between items-center p-2 rounded-md border",
                                !n.read ? "bg-blue-50 border-green-200" : "bg-gray-50 border-gray-100"
                            )}
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-500">
                                    {format(new Date(n.createdAt), "dd.MM.yyyy HH:mm", { locale: pl })}
                                </span>
                                <span
                                    className={cn(
                                    "text-sm",
                                    !n.read && "font-semibold text-blue-800"
                                    )}
                                >
                                    {n.message}
                                </span>
                            </div>
                            {!n.read && (
                                <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsRead(n.id)}
                                >
                                Mark as read
                                </Button>
                            )}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-gray-400 hover:text-red-600"
                                onClick={() => handleDeleteNotification(n.id)}
                                title="Delete notification"
                            >
                            ✕
                            </Button>
                        </div>
                    ))
                    ) : (
                    <div className="text-sm text-gray-500 italic">No notifications yet.</div>
                    )}
                </div>
            </div>
            {showChart && selectedAlert && (
            <AlertChartModal
                alertId={selectedAlert.id!}
                companies={selectedAlert.companies}
                onClose={() => setShowChart(false)}
            />
            )}
        </div>
    );
}