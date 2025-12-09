export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: number
                    name: string
                    description: string | null
                    price: number
                    category_id: number
                    created_at: string
                    image_top_url: string | null
                    image_front_url: string | null
                }
                Insert: {
                    id?: number
                    name: string
                    description?: string | null
                    price: number
                    category_id: number
                    created_at?: string
                    image_top_url?: string | null
                    image_front_url?: string | null
                }
                Update: {
                    id?: number
                    name?: string
                    description?: string | null
                    price?: number
                    category_id?: number
                    created_at?: string
                    image_top_url?: string | null
                    image_front_url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            categories: {
                Row: {
                    id: number
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    description?: string | null
                    created_at?: string
                }
                Relationships: []
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
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            orders: {
                Row: {
                    id: number
                    customer_name: string
                    total: number
                    created_at: string
                    user_id: string | null
                    status: string
                    address: Json
                }
                Insert: {
                    id?: number
                    customer_name: string
                    total: number
                    created_at?: string
                    user_id?: string | null
                    status: string
                    address: Json
                }
                Update: {
                    id?: number
                    customer_name?: string
                    total?: number
                    created_at?: string
                    user_id?: string | null
                    status?: string
                    address?: Json
                }
                Relationships: []
            }
            order_items: {
                Row: {
                    id: number
                    order_id: number
                    product_id: number
                    quantity: number
                    price: number
                }
                Insert: {
                    id?: number
                    order_id: number
                    product_id: number
                    quantity: number
                    price: number
                }
                Update: {
                    id?: number
                    order_id?: number
                    product_id?: number
                    quantity?: number
                    price?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            customer_users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    address: Json | null
                    created_at: string
                }
                Insert: {
                    id: string
                    name: string
                    email: string
                    address?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    address?: Json | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "customer_users_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            fidelity: {
                Row: {
                    id: number
                    user_id: string
                    points: number
                    free_cookie_earned: boolean
                    updated_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    points?: number
                    free_cookie_earned?: boolean
                    updated_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    points?: number
                    free_cookie_earned?: boolean
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "fidelity_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
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

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
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
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: 'Entregue' | 'Em andamento' | 'Cancelado';
    address: UserAddress;
}

export interface UserProfile {
    id?: string;
    name: string;
    email: string;
    address?: UserAddress;
    purchaseCount: number;
    orders: Order[];
}

