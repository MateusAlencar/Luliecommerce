import { supabase } from './supabase';

export interface AuthUser {
    id: string;
    email: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email!,
    };
}

/**
 * Get the current session
 */
export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
