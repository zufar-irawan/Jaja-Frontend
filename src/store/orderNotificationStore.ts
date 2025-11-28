import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PendingOrder {
  id_data: string;
  order_number: string;
  total: number;
  created_at: string;
  batas_pembayaran: string;
  status: 'pending' | 'paid' | 'expired';
  products: Array<{
    nama_produk: string;
    qty: number;
    harga: number;
    gambar: string;
  }>;
}

interface OrderNotificationState {
  pendingOrders: PendingOrder[];
  unreadCount: number;
  //action
  addPendingOrder: (order: PendingOrder) => void;
  removePendingOrder: (id_data: string) => void;
  markOrderAsPaid: (id_data: string) => void;
  clearExpiredOrders: () => void;
  getPendingOrderById: (id_data: string) => PendingOrder | undefined;
  clearAllOrders: () => void;
  updateUnreadCount: () => void;
}

export const useOrderNotificationStore = create<OrderNotificationState>()(
  persist(
    (set, get) => ({
      pendingOrders: [],
      unreadCount: 0,

      addPendingOrder: (order) => {
        set((state) => {
          // Check if order already exists
          const exists = state.pendingOrders.some(
            (o) => o.id_data === order.id_data
          );

          if (exists) {
            return {
              pendingOrders: state.pendingOrders.map((o) =>
                o.id_data === order.id_data ? order : o
              ),
            };
          }

          // Add new order
          const newOrders = [order, ...state.pendingOrders];
          return {
            pendingOrders: newOrders,
            unreadCount: newOrders.filter(o => o.status === 'pending').length,
          };
        });
      },

      removePendingOrder: (id_data) => {
        set((state) => {
          const newOrders = state.pendingOrders.filter(
            (o) => o.id_data !== id_data
          );
          return {
            pendingOrders: newOrders,
            unreadCount: newOrders.filter(o => o.status === 'pending').length,
          };
        });
      },

      markOrderAsPaid: (id_data) => {
        set((state) => {
          const newOrders = state.pendingOrders.map((order) =>
            order.id_data === id_data
              ? { ...order, status: 'paid' as const }
              : order
          );
          return {
            pendingOrders: newOrders,
            unreadCount: newOrders.filter(o => o.status === 'pending').length,
          };
        });
      },

      clearExpiredOrders: () => {
        set((state) => {
          const now = new Date().getTime();
          const newOrders = state.pendingOrders.filter((order) => {
            const deadline = new Date(order.batas_pembayaran).getTime();
            return deadline > now && order.status !== 'expired';
          });

          return {
            pendingOrders: newOrders,
            unreadCount: newOrders.filter(o => o.status === 'pending').length,
          };
        });
      },

      getPendingOrderById: (id_data) => {
        return get().pendingOrders.find((order) => order.id_data === id_data);
      },

      clearAllOrders: () => {
        set({ pendingOrders: [], unreadCount: 0 });
      },

      updateUnreadCount: () => {
        set((state) => ({
          unreadCount: state.pendingOrders.filter(o => o.status === 'pending').length,
        }));
      },
    }),
    {
      name: 'order-notifications',
      partialize: (state) => ({
        pendingOrders: state.pendingOrders,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
