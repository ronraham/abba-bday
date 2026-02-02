/**
 * Main storage service export
 *
 * This is the single point where we choose which storage implementation to use.
 * To switch from localStorage to Supabase, simply change the import here.
 */
export { storageService } from './localStorageService';

// Future: When Supabase is ready, uncomment below and comment out above:
// export { storageService } from './supabaseService';
