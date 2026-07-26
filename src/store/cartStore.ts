import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  productSlug: string;
  productTitle: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  price: number; // قیمت اصلی
  discountPrice?: number; // قیمت تخفیف‌دار (اختیاری)
  quantity: number;
  petId?: string;
  petName?: string;
  petPhotoUrl?: string;
  stock: number; // موجودی انبار
}

interface CartState {
  items: CartItem[];
  // عمل‌ها
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, vendorId: string) => void;
  updateQuantity: (productId: string, vendorId: string, qty: number) => void;
  clearCart: () => void;
  // Getters
  totalItems: () => number;
  subtotal: () => number;
  vendorGroups: () => Map<string, { vendorName: string; items: CartItem[]; shippingCost: number; subtotal: number }>;
  totalAmount: () => number;
}

// ثابت هزینه ارسال به تومان
const SHIPPING_COST = 35000;

// ایجاد store با persist
const cartStoreCreator: StateCreator<CartState, [], [], CartState> = (set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.vendorId === item.vendorId
      );

      if (existingIndex >= 0) {
        const existingItem = state.items[existingIndex];
        const newQuantity = Math.min(
          existingItem.quantity + item.quantity,
          existingItem.stock
        );
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        return { items: updatedItems };
      }

      // اگر آیتم جدید است، مقدار را به حد موجودی محدود می‌کنیم
      const clampedQuantity = Math.min(item.quantity, item.stock);
      return {
        items: [
          ...state.items,
          { ...item, quantity: clampedQuantity },
        ],
      };
    });
  },

  removeItem: (productId, vendorId) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.vendorId === vendorId)
      ),
    }));
  },

  updateQuantity: (productId, vendorId, qty) => {
    set((state) => {
      const index = state.items.findIndex(
        (i) => i.productId === productId && i.vendorId === vendorId
      );
      if (index < 0) return state;

      const item = state.items[index];
      const newQuantity = Math.min(Math.max(qty, 1), item.stock);
      if (newQuantity === item.quantity) return state;

      const updatedItems = [...state.items];
      updatedItems[index] = { ...item, quantity: newQuantity };
      return { items: updatedItems };
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  subtotal: () => {
    return get().items.reduce((sum, item) => {
      const price = item.discountPrice ?? item.price;
      return sum + price * item.quantity;
    }, 0);
  },

  vendorGroups: () => {
    const map = new Map<
      string,
      { vendorName: string; items: CartItem[]; shippingCost: number; subtotal: number }
    ];

    for (const item of get().items) {
      if (!map.has(item.vendorId)) {
        map.set(item.vendorId, {
          vendorName: item.vendorName,
          items: [],
          shippingCost: 0,
          subtotal: 0,
        });
      }
      const vendorData = map.get(item.vendorId)!;
      vendorData.items.push(item);
      const price = item.discountPrice ?? item.price;
      vendorData.subtotal += price * item.quantity;
    }

    // محاسبه هزینه ارسال برای هر فروشنده
    for (const [, vendorData] of map.entries()) {
      vendorData.shippingCost = vendorData.subtotal > 0 ? SHIPPING_COST : 0;
    }

    return map;
  },

  totalAmount: () => {
    const state = get();
    const itemsSubtotal = state.subtotal();
    const vendorGroups = state.vendorGroups();
    let shippingSum = 0;
    for (const vendorData of vendorGroups.values()) {
      shippingSum += vendorData.shippingCost;
    }
    return itemsSubtotal + shippingSum;
  },
});

export const useCartStore = create<CartState>()(
  persist(cartStoreCreator, {
    name: 'petshop-cart',
    storage: createJSONStorage(() => localStorage),
  })
);
