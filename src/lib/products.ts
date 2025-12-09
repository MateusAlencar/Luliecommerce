import { supabase } from './supabase';
import { ProductWithCategory } from '@/types/database';

/**
 * Fetch all products with their category information from Supabase
 */
export async function getProducts(): Promise<ProductWithCategory[]> {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(*)
    `)
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data as ProductWithCategory[];
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: number): Promise<ProductWithCategory | null> {
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(*)
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data as ProductWithCategory;
}
