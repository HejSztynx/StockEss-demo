import { Alert, fetchAlerts } from "@/components/Watchlist/WatchlistService";
import { useAuth } from "@/context/AuthContext";
import { request } from "@/utils/api";
import { createContext, useContext, useEffect, useState } from "react";

interface WatchlistContextType {
    isEditModalOpen: boolean,
    isDeleteModalOpen: boolean,
    alerts: Alert[],
    selectedAlert: Alert | null,
    editedAlert: Alert | null,
    setIsEditModalOpen: (val: boolean) => void,
    setIsDeleteModalOpen: (val: boolean) => void,
    setAlerts: (vals: Alert[]) => void,
    handleSelectAlert: (val: Alert) => void,
    setEditedAlert: (val: Alert | null) => void,
    setSelectedAlert: (val: Alert | null) => void,
    setSelectedAlertById: (id: number | null) => void,
    refreshAlerts: () => void,
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [editedAlert, setEditedAlert] = useState<Alert | null>(null);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const refreshAlerts = async () => {
        const res = await fetchAlerts();
        setAlerts(res);
        setSelectedAlertById(selectedAlert?.id ?? null, res);
    };

    const setSelectedAlertById = (id: number | null, list?: Alert[]) => {
        if (!id) return;
        const foundAlert = (list ?? alerts).find(alert => alert.id === id) ?? null;
        setSelectedAlert(foundAlert);
    }

    useEffect(() => {
        refreshAlerts();
    }, []);

    const handleSelectAlert = (alert: Alert) => {
        setSelectedAlert(alert);
    };

    return (
        <WatchlistContext.Provider
            value={{
                isEditModalOpen,
                isDeleteModalOpen,
                alerts,
                selectedAlert,
                editedAlert,
                setIsEditModalOpen,
                setIsDeleteModalOpen,
                setAlerts,
                handleSelectAlert,
                setEditedAlert,
                setSelectedAlert,
                setSelectedAlertById,
                refreshAlerts,
            }}
        >
            {children}
        </WatchlistContext.Provider>
    )
}

export const useWatchlistContext = () => {
    const ctx = useContext(WatchlistContext);
    if (!ctx) {
        throw new Error("useWatchlistContext must be used within an WatchlistContextProvider");
    }
    return ctx;
}