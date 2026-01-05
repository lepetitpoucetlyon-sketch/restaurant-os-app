"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    X,
    Bell,
    AlertCircle,
    AlertTriangle,
    Info,
    CheckCircle2,
    Trash2,
    CheckCheck,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications, Notification, NotificationType } from "@/context/NotificationsContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const TYPE_CONFIG: Record<NotificationType, { icon: any; bgColor: string; textColor: string; borderColor: string }> = {
    critical: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-500',
        borderColor: 'border-l-red-500'
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-500',
        borderColor: 'border-l-orange-500'
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-500',
        borderColor: 'border-l-blue-500'
    },
    success: {
        icon: CheckCircle2,
        bgColor: 'bg-green-50',
        textColor: 'text-[#00D764]',
        borderColor: 'border-l-[#00D764]'
    }
};

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const router = useRouter();
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.action?.href) {
            router.push(notification.action.href);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[150] bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-20 right-10 z-[200] w-[420px] max-h-[calc(100vh-120px)] bg-white rounded-[2rem] shadow-2xl border border-neutral-100 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                            <Bell className="w-5 h-5 text-[#00D764]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-[#1A1A1A]">Notifications</h2>
                            <p className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-widest">
                                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="p-2 rounded-xl hover:bg-neutral-50 text-[#ADB5BD] hover:text-[#00D764] transition-colors"
                                title="Tout marquer comme lu"
                            >
                                <CheckCheck className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-neutral-50 text-[#ADB5BD] hover:text-[#1A1A1A] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto max-h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bell className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                            <p className="text-[#ADB5BD] font-bold">Aucune notification</p>
                            <p className="text-[11px] text-[#CED4DA] mt-1">Les alertes apparaîtront ici</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-50">
                            {notifications.map(notification => {
                                const config = TYPE_CONFIG[notification.type];
                                const Icon = config.icon;
                                const timeAgo = formatDistanceToNow(notification.timestamp, {
                                    addSuffix: true,
                                    locale: fr
                                });

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={cn(
                                            "p-4 border-l-4 cursor-pointer transition-all hover:bg-neutral-50",
                                            config.borderColor,
                                            !notification.read && "bg-[#F8F9FA]"
                                        )}
                                    >
                                        <div className="flex gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                config.bgColor
                                            )}>
                                                <Icon className={cn("w-5 h-5", config.textColor)} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={cn(
                                                        "font-bold text-sm",
                                                        !notification.read ? "text-[#1A1A1A]" : "text-[#495057]"
                                                    )}>
                                                        {notification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <Clock className="w-3 h-3 text-[#CED4DA]" />
                                                        <span className="text-[10px] text-[#ADB5BD]">{timeAgo}</span>
                                                    </div>
                                                </div>
                                                <p className="text-[12px] text-[#6C757D] mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                {notification.action && (
                                                    <button className={cn(
                                                        "mt-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors",
                                                        config.bgColor, config.textColor,
                                                        "hover:opacity-80"
                                                    )}>
                                                        {notification.action.label}
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(notification.id);
                                                }}
                                                className="p-1 rounded-lg hover:bg-red-50 text-[#CED4DA] hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {!notification.read && (
                                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#00D764]" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
                        <button
                            onClick={clearAll}
                            className="w-full py-2 text-[11px] font-bold text-[#ADB5BD] hover:text-red-500 transition-colors uppercase tracking-wider"
                        >
                            Effacer toutes les notifications
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
