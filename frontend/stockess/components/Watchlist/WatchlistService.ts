import { request } from "@/utils/api";

export type ConditionType = "RISE" | "FALL" | "MORE" | "LESS" | "THRESHOLD";

export type ConditionValueType = "PERCENTAGE" | "ABSOLUTE";

export type OHLCType = "OPEN" | "HIGH" | "LOW" | "CLOSE";

export type Condition = {
    id: string | null,
    conditionType: ConditionType,
    period: number | null,
    value: number,
    valueType: ConditionValueType,
    ohlcType: OHLCType,
};

export type Notification = {
    id: number,
    message: string,
    read: boolean,
    createdAt: string,
};

export type Alert = {
  id: number | null,
  name: string,
  createdAt: string | null,
  startDate: string,
  companies: string[],
  conditions: Condition[],
  notifications: Notification[],
  active: boolean,
  once: boolean,
};

export function formatAlert(alert: Alert) {
    return alert.name;
}

export const createAlert = (alert: Alert) => request<any>("/alert/create",
    {
        method: "PUT",
        body: alert,
    }
);

export const updateAlert = (alert: Alert) => request<any>("/alert/update",
    {
        method: "POST",
        body: alert,
    }
);

export const deleteAlert = (id: number) => request<any>(`/alert/delete?alert_id=${id}`,
    {
        method: "DELETE",
    }
);

export const activateAlert = (id: number) => request<any>(`/alert/activate?alert_id=${id}`,
    {
        method: "POST",
    }
);

export const deactivateAlert = (id: number) => request<any>(`/alert/deactivate?alert_id=${id}`,
    {
        method: "POST",
    }
);

export const fetchAlerts = () => request<Alert[]>("/alert/all");

export const readNotification = (id: number) => request<any>(`/notification/read?notification_id=${id}`,
    {
        method: "POST",
    }
);

export const readAllNotifications = (id: number) => request<any>(`/notification/read-all?alert_id=${id}`,
    {
        method: "POST",
    }
);

export const deleteNotification = (id: number) => request<any>(`/notification/delete?notification_id=${id}`,
    {
        method: "DELETE",
    }
);

export const deleteAllNotifications = (id: number) => request<any>(`/notification/delete-all?alert_id=${id}`,
    {
        method: "DELETE",
    }
);