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
  variety?: {
    id: number;
    price_main?: number;
    price_final?: string;
    is_coworker_price: boolean;
    for_sale: number;
    product_alert: string;
    Properties: Array<{
      id: number;
      title: string;
      property_id: number | string;
      code?: string;
      property: {
        id: number | string;
        title: string;
      };
    }>;
    storage_image_ids: string;
    full_name: string;
    category: Category;
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
