/**
 * Main storage service export
 *
 * This is the single point where we choose which storage implementation to use.
 * Currently using Google Sheets as the backend via Google Apps Script.
 */
export { storageService } from './googleSheetsService';

// Alternative implementations:
// export { storageService } from './localStorageService'; // Browser-only, no sync
// export { storageService } from './supabaseService'; // Future option
