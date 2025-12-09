import { supabase } from './supabase';
import { Category } from '@/types/database';

/**
 * Fetch all categories from Supabase
 */
export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data as Category[];
}
