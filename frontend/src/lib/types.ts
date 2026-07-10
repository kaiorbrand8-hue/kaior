export type Category = {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  parent?: string | null;
  order?: number;
};

export type ProductVariant = {
  size: string;
  color: string;
  stock: number;
  sku?: string;
};

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  _id?: string;
  user: string;
  name: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt?: string;
};

export type AdminReviewEntry = {
  productId: string;
  productName: string;
  productSlug: string;
  review: Review;
};

export type Product = {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  category: Category | string;
  images: string[];
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  variants: ProductVariant[];
  colors: string[];
  sizes: string[];
  featured: boolean;
  isNewArrival: boolean;
  fabric?: string;
  fabricAr?: string;
  tags: string[];
  reviews: Review[];
  rating: number;
  numReviews: number;
  totalStock: number;
  active: boolean;
  createdAt?: string;
};

export type PaginatedProducts = {
  items: Product[];
  page: number;
  pages: number;
  total: number;
};

export type Address = {
  _id?: string;
  label?: string;
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building?: string;
  notes?: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  addresses: Address[];
  token?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  stock: number;
};

export type OrderItem = {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

export type Order = {
  _id: string;
  orderNumber: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: "cod";
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  isPaid: boolean;
  createdAt: string;
};

export type AdminStats = {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  pendingReviews: number;
  totalRevenue: number;
};

export type SiteSettings = {
  _id?: string;
  heroImage: string;
  lookbookMainImage: string;
  lookbookFeatureImage: string;
  lookbookSuitingImage: string;
  lookbookKnitwearImage: string;
};
