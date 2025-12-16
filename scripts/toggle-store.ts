
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function toggleStore(isOpen: boolean) {
    console.log(`Setting store to ${isOpen ? 'OPEN' : 'CLOSED'}...`);

    // First, check if a row exists
    const { data: existingData, error: fetchError } = await supabase
        .from('store_settings')
        .select('id')
        .limit(1)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching settings:', fetchError);
        return;
    }

    let error;
    if (existingData) {
        // Update
        const { error: updateError } = await supabase
            .from('store_settings')
            .update({ is_open: isOpen, updated_at: new Date().toISOString() })
            .eq('id', existingData.id);
        error = updateError;
    } else {
        // Insert
        const { error: insertError } = await supabase
            .from('store_settings')
            .insert({ is_open: isOpen, updated_at: new Date().toISOString() });
        error = insertError;
    }

    if (error) {
        console.error('Error updating store settings:', error);
    } else {
        console.log(`Successfully set store to ${isOpen ? 'OPEN' : 'CLOSED'}`);
    }
}

const args = process.argv.slice(2);
const command = args[0];

if (command === 'open') {
    toggleStore(true);
} else if (command === 'closed') {
    toggleStore(false);
} else {
    console.log('Usage: npx tsx scripts/toggle-store.ts [open|closed]');
}
