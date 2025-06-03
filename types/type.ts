// ------------------------------ category -----------------------------------

export interface Category {
  id: number;
  cat_name: string;
  cat_en_name: string;
  slug: string;
  src: string;
  icon: string;
  page_title: string;
  meta_tag: string;
  seo_des: string;
  selected: number;
  parent: Category | null;
  children: Category[];
  image_url: string;
}

// --------------------------------- product type ---------------------------

export interface Product {
  id: number;
  slug: string;
  page_title: string;
  meta_tag: string | null;
  seo_description: string;
  fa_name: string;
  en_name: string;
  store_stock: number;
  images: Array<{
    id: number;
    src: string;
  }>;
  brandMain: string | null;
  main_image_id: number | null;
  // Single variety object (for backward compatibility)
  variety: {
    id: number;
    price_main: number;
    price_final: number | string;
    is_coworker_price: boolean;
    for_sale: number;
    product_alert: string;
    Properties: Array<{
      id: number;
      title: string;
      property_id: number | string;
      property: {
        id: number | string;
        title: string;
      };
      code?: string; // For color properties
    }>;
    storage_image_ids: string | string[];
    full_name: string;
    category: {
      id: number;
      cat_name: string;
      cat_en_name: string;
      slug: string;
      src: string;
      icon: string;
      page_title: string;
      meta_tag: string;
      seo_des: string;
      selected: number;
      parent: {
        id: number;
        cat_name: string;
        cat_en_name: string;
        slug: string;
        src: string;
        icon: string;
        page_title: string;
        meta_tag: string;
        seo_des: string;
        selected: number;
        parent: any | null;
      } | null;
    };
    is_main: boolean;
    show_unit: string;
    units: Array<{
      id: number;
      title: string;
      short_title: string | null;
      step: string;
      ratio: number;
      is_main: number;
      can_buy: number;
      main_title: string;
    }>;
    fa_name: string;
    seo_description: string;
    slug: string;
    product_id: number;
    getWarranty: any | null;
    sepidar_code: string | null;
    b_code: string | null;
    mainTitle: string;
    store_stock: number;
    color: number;
  };
  // Array of varieties (for new implementation)
  varieties?: Array<{
    id: number;
    price_main: number;
    priceOff: number;
    for_sale: number;
    product_alert: string;
    Properties: Record<string, number>;
    showProperties: Array<{
      id: number;
      title: string;
      sort: number;
      child: {
        id: number;
        title: string;
      };
    }>;
    storage_image_ids: string;
    full_name: string;
    category: {
      id: number;
      cat_name: string;
      cat_en_name: string;
      slug: string;
      src: string;
      icon: string;
      page_title: string;
      meta_tag: string;
      seo_des: string;
      selected: number;
      parent: {
        id: number;
        cat_name: string;
        cat_en_name: string;
        slug: string;
        src: string;
        icon: string;
        page_title: string;
        meta_tag: string;
        seo_des: string;
        selected: number;
        parent: any | null;
      } | null;
    };
    is_main: boolean;
    show_price: number;
    show_price_off: number | null;
    show_unit: string;
    units: Array<{
      id: number;
      title: string;
      short_title: string | null;
      step: string;
      ratio: number;
      is_main: number;
      can_buy: number;
      main_title: string;
    }>;
    fa_name: string;
    seo_description: string;
    slug: string;
    product_id: number;
    getColor: {
      id: number;
      fa_name: string;
      en_name: string;
      code: string;
    } | null;
    getWarranty: any | null;
    sepidar_code: string | null;
    b_code: string | null;
    price_store: number | null;
    price_site: number | null;
    price_buy: number | null;
    mainTitle: string;
    store_stock: number;
    src: string;
    color: number;
  }>;
}

export interface ProductResponse {
  items: Product[];
  _links: {
    self: { href: string };
    first: { href: string };
    last: { href: string };
  };
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}

export interface ProductCardProps {
  product: Product;
}

// ---------------------------- product comment ------------------------------
export interface CommentChild {
  id: number;
  name: string;
  title: string;
  comment: string;
  can_edit: boolean;
  childs: CommentChild[];
}

export interface CommentItem {
  id: number;
  name: string;
  title: string;
  comment: string;
  can_edit: boolean;
  childs: CommentChild[];
}

export interface CommentResponse {
  success: boolean;
  data: {
    items: CommentItem[];
    _links: {
      self: { href: string };
      first: { href: string };
      last: { href: string };
    };
    _meta: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number;
    };
  };
}

export interface Comment {
  id: number | string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  title?: string;
  replies?: Comment[];
}

export interface ProductCommentsProps {
  productSlug: string;
  productId: number;
}

// ---------------------------- productgrid ---------------------------------
export interface ProductGridProps {
  categoryFilter?: string | null;
}
// ---------------------------- producttabs ---------------------------------
export interface ProductTabsProps {
  product: Product;
}

//-------------------------- User interfaces dashboard -------------------------
export interface KeyValuePair {
  key: number;
  value: string | boolean;
}

export interface UserType {
  id: number;
  type_name: string;
}

export interface UserBasicInfo {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  job: string;
  sex: KeyValuePair;
}

export interface UserProfile {
  id: number;
  user: UserBasicInfo;
  show_title: string | null;
  national: KeyValuePair;
  nationalID: string | null;
  type_legal: KeyValuePair;
  identity_verification: KeyValuePair;
  type: UserType;
  birthday: string | null;
  complete: boolean;
  jobs: any[]; // You can define a more specific type if needed
}
// -------------------------------- ProductGallery ---------------------

export interface ProductGalleryProps {
  primaryImage: string;
  secondaryImage?: string;
  additionalImages: string[];
  productName: string;
  layout: "thumbnails" | "desktop" | "mobile";
  activeImageIndex?: number;
  onThumbnailClick?: (index: number) => void;
  onImageChange?: (index: number) => void;
}
// ------------------------------- ProductInfo ------------------------

export interface ProductInfoProps {
  product: Product;
  layout?: "desktop" | "mobile";
}

// ----------------------------- contact -----------------------------

export type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Form status type
export type FormStatus = "idle" | "submitting" | "success" | "error";

// ---------------------------- cart --------------------------------
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: null | number;
  size: null | string;
  color: null | string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ---------------------------- ScrollMediaShowcase ----------------------
export interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  alt?: string;
  title: string;
  description: string;
}

// ------------------------ datepicker ----------------------------------------
export interface PersianDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// ------------------------ locationselector for cart ------------------------
export interface LocationSelectorProps {
  onProvinceChange?: (provinceId: string, provinceName: string) => void;
  onCityChange?: (cityId: string, cityName: string) => void;
  onLocationSelected?: (
    provinceId: string,
    provinceName: string,
    cityId: string,
    cityName: string
  ) => void;
  className?: string;
}

// ---------------------------- megamenu ----------------------------------------
export interface MegaMenuProps {
  categories: Category[];
  hoveredCategory: number | null;
  setHoveredCategory: (index: number | null) => void;
}






export interface ScrollMediaShowcaseProps {
  initialCenterImage?: string;
  transitionComplete?: () => void;
}