export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: number
                    name: string
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: number
                    name: string
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            customer_users: {
                Row: {
                    address: Json | null
                    created_at: string | null
                    email: string | null
                    id: string
                    name: string | null
                }
                Insert: {
                    address?: Json | null
                    created_at?: string | null
                    email?: string | null
                    id: string
                    name?: string | null
                }
                Update: {
                    address?: Json | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name?: string | null
                }
                Relationships: []
            }
            enterprise_users: {
                Row: {
                    address: string | null
                    created_at: string | null
                    email: string | null
                    id: string
                    name: string | null
                }
                Insert: {
                    address?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name?: string | null
                }
                Update: {
                    address?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: string
                    name?: string | null
                }
                Relationships: []
            }
            fidelity: {
                Row: {
                    free_cookie_earned: boolean
                    id: number
                    points: number
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    free_cookie_earned?: boolean
                    id?: number
                    points?: number
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    free_cookie_earned?: boolean
                    id?: number
                    points?: number
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "fidelity_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "customer_users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            order_items: {
                Row: {
                    id: number
                    order_id: number
                    price: number
                    product_id: number
                    quantity: number
                }
                Insert: {
                    id?: number
                    order_id: number
                    price: number
                    product_id: number
                    quantity: number
                }
                Update: {
                    id?: number
                    order_id?: number
                    price?: number
                    product_id?: number
                    quantity?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            orders: {
                Row: {
                    address: Json
                    created_at: string
                    customer_name: string
                    id: number
                    status: string
                    total: number
                    user_id: string | null
                }
                Insert: {
                    address: Json
                    created_at?: string
                    customer_name: string
                    id?: number
                    status?: string
                    total: number
                    user_id?: string | null
                }
                Update: {
                    address?: Json
                    created_at?: string
                    customer_name?: string
                    id?: number
                    status?: string
                    total?: number
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "customer_users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            product_stock: {
                Row: {
                    id: number
                    product_id: number
                    quantity: number
                    updated_at: string
                }
                Insert: {
                    id?: number
                    product_id: number
                    quantity: number
                    updated_at?: string
                }
                Update: {
                    id?: number
                    product_id?: number
                    quantity?: number
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "product_stock_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                ]
            }
            products: {
                Row: {
                    category_id: number
                    created_at: string
                    description: string | null
                    id: number
                    image_front_url: string | null
                    image_top_url: string | null
                    name: string
                    price: number
                }
                Insert: {
                    category_id: number
                    created_at?: string
                    description?: string | null
                    id?: number
                    image_front_url?: string | null
                    image_top_url?: string | null
                    name: string
                    price: number
                }
                Update: {
                    category_id?: number
                    created_at?: string
                    description?: string | null
                    id?: number
                    image_front_url?: string | null
                    image_top_url?: string | null
                    name?: string
                    price?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

// Helper types for working with products
export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

export interface ProductWithCategory extends Product {
    category?: Category;
}

// User profile types
export interface UserAddress {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
}

export interface CartItem extends ProductWithCategory {
    quantity: number;
}

export interface Order {
    id: number;
    date: string;
    items: CartItem[];
    total: number;
    status: string;
    address: UserAddress;
}

export interface UserProfile {
    id?: string;
    name: string;
    email: string;
    address?: UserAddress;
    purchaseCount: number;
    free_cookie_earned?: boolean;
    orders: Order[];
}

