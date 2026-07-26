// src/lib/types.ts

// مشترک
export type ID = string;
export type Species = 'dog' | 'cat' | 'bird' | 'fish' | 'small_animal' | 'reptile';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// احراز هویت
export interface User {
  id: ID;
  phone: string;
  fullName?: string;
  email?: string;
  role: 'customer' | 'vendor' | 'admin';
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OtpResponse {
  sent: boolean;
  expiresAt: string;
}

// حیوانات
export interface Vaccine {
  id: ID;
  name: string;
  date: string;
  nextDueDate?: string;
  vetName?: string;
}

export interface Pet {
  id: ID;
  name: string;
  species: Species;
  breed: string;
  gender: 'male' | 'female';
  birthDate: string;
  weight?: number;
  photoUrl?: string;
  uniqueCode: string;
  allergies?: string[];
  vaccines?: Vaccine[];
}

// کاتالوگ
export interface Brand {
  id: ID;
  name: string;
  logoUrl: string;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  parentId?: ID;
  icon?: string;
  children?: Category[];
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  brandId: ID;
  brandName: string;
  categoryId: ID;
  categorySlug: string;
  images: string[];
  suitableFor: Species[];
  description: string;
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
}

export interface VendorListing {
  id: ID;
  vendorId: ID;
  vendorName: string;
  vendorLogoUrl: string;
  vendorRating: number;
  price: number;
  discountPercent: number;
  finalPrice: number;
  shippingCost: number;
  shippingDays: number;
  city: string;
  isAuthentic: boolean;
  expiryDate?: string;
  stock: number;
  productId: ID;
}

export interface SpecialDeal {
  id: ID;
  listingId: ID;
  product: Product;
  vendorName: string;
  discountPercent: number;
  finalPrice: number;
  originalPrice: number;
  startsAt: string;
  endsAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// فروشنده
export interface RecentOrder {
  id: ID;
  customerName: string;
  total: number;
  date: string;
}

export interface Vendor {
  id: ID;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  city: string;
  rating: number;
  productCount: number;
  description: string;
  isVerified: boolean;
}

export interface VendorDashboardStats {
  todaySales: number;
  monthSales: number;
  todayOrders: number;
  recentOrders: RecentOrder[];
  chartData: { date: string; sales: number }[];
}

export interface VendorOrder {
  id: ID;
  orderDate: string;
  customerName: string;
  items: OrderItem[];
  grossAmount: number;
  commissionAmount: number;
  taxAmount: number;
  vendorNet: number;
  status: string;
}

// تجارت
export interface CartItem {
  id: ID;
  listingId: ID;
  productId: ID;
  productName: string;
  productImage: string;
  vendorId: ID;
  vendorName: string;
  price: number;
  quantity: number;
  petId?: ID;
  petName?: string;
}

export interface Cart {
  items: CartItem[];
  totalShipping: number;
  totalAmount: number;
}

export interface Address {
  id: ID;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: ID;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  address: Address;
}

export interface OrderItem {
  id: ID;
  productId: ID;
  productName: string;
  vendorId: ID;
  vendorName: string;
  price: number;
  quantity: number;
  commissionAmount: number;
  taxAmount: number;
  vendorNet: number;
}

// محتوا
export interface WorkingHour {
  dayOfWeek: number;
  open: string;
  close: string;
}

export interface Clinic {
  id: ID;
  name: string;
  slug: string;
  logoUrl: string;
  images: string[];
  city: string;
  address: string;
  phone: string;
  services: string[];
  workingHours: WorkingHour[];
  rating: number;
  lat: number;
  lng: number;
  isOpen: boolean;
}

export interface BlogPost {
  id: ID;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface Banner {
  id: ID;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkUrl: string;
  order: number;
}

export interface Review {
  id: ID;
  targetType: 'product' | 'vendor' | 'clinic';
  targetId: ID;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// مالی
export interface VendorFinanceSummary {
  totalRevenue: number;
  totalCommission: number;
  totalTax: number;
  netProfit: number;
  pendingSettlement: number;
  availableBalance: number;
}

export interface Settlement {
  id: ID;
  vendorId: ID;
  amount: number;
  requestedAt: string;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export interface AdminFinanceSummary {
  platformRevenue: number;
  totalCommission: number;
  totalTaxCollected: number;
  pendingSettlements: Settlement[];
}

// ادمین
export interface AdminDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalVendors: number;
  petDistribution: { species: string; count: number }[];
}
