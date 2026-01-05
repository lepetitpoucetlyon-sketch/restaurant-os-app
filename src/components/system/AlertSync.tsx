"use client";

import { useEffect, useRef } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { useNotifications } from '@/context/NotificationsContext';

/**
 * ALERT SYNC COMPONENT
 * Bridges Inventory low stock alerts to the Notifications system.
 * This component renders nothing but performs side effects.
 */
export function AlertSync() {
    const { lowStockItems } = useInventory();
    const { addNotification, notifications } = useNotifications();
    const previousLowStockRef = useRef<string[]>([]);

    useEffect(() => {
        // Get IDs of currently low stock items
        const currentLowStockIds = lowStockItems.map(item => item.id);

        // Find newly low stock items (weren't low before, are now)
        const newLowStockItems = lowStockItems.filter(
            item => !previousLowStockRef.current.includes(item.id)
        );

        // For each new low stock item, create a notification if one doesn't already exist
        newLowStockItems.forEach(item => {
            // Check if we already have a notification for this item
            const existingNotification = notifications.find(
                n => n.message.includes(item.name) && n.type === 'warning'
            );

            if (!existingNotification) {
                addNotification({
                    type: 'warning',
                    title: 'Stock Bas',
                    message: `${item.name}: ${item.quantity.toFixed(1)} ${item.unit} restants (min: ${item.minQuantity} ${item.unit})`,
                    module: 'inventory',
                    action: {
                        label: 'Voir Inventaire',
                        href: '/inventory'
                    }
                });
            }
        });

        // Update ref for next comparison
        previousLowStockRef.current = currentLowStockIds;
    }, [lowStockItems, addNotification, notifications]);

    // This component renders nothing
    return null;
}
