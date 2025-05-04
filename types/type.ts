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
}

export interface Product {
  id: number;
  slug: string;
  page_title: string;
  meta_tag: string | null;
  seo_description: string;
  fa_name: string;
  en_name: string;
  store_stock: number;
  brandMain: any | null;
  main_image_id: number | null;
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

// User interfaces
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
