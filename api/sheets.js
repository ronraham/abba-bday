import { google } from 'googleapis';

// Initialize Google Sheets API
const getSheets = () => {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';

  // Check if the key is base64 encoded (doesn't start with -----)
  if (!privateKey.startsWith('-----')) {
    // Decode from base64
    privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
  } else {
    // Handle escaped newlines for non-base64 keys
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const RSVP_SHEET = 'RSVPs';
const SONGS_SHEET = 'Songs';

// Helper to generate UUID
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Helper to get current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ==================== RSVP Functions ====================

async function getRSVPs(sheets) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${RSVP_SHEET}!A:F`,
  });

  const rows = response.data.values || [];
  if (rows.length <= 1) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const rsvp = {};
    headers.forEach((header, index) => {
      let value = row[index] || '';
      if (header === 'attending') {
        value = value === 'TRUE' || value === 'true' || value === true;
      }
      if (header === 'partySize') {
        value = parseInt(value) || 1;
      }
      rsvp[header] = value;
    });
    return rsvp;
  }).filter(rsvp => rsvp.id);
}

async function getRSVPByName(sheets, name) {
  const rsvps = await getRSVPs(sheets);
  return rsvps.find((r) => r.name.toLowerCase() === name.toLowerCase()) || null;
}

async function addRSVP(sheets, rsvpData) {
  // Check for duplicate
  const existing = await getRSVPByName(sheets, rsvpData.name);
  if (existing) {
    throw new Error('An RSVP with this name already exists');
  }

  const newRSVP = {
    id: generateId(),
    name: rsvpData.name,
    partySize: rsvpData.partySize || 1,
    attending: rsvpData.attending,
    notes: rsvpData.notes || '',
    createdAt: getCurrentTimestamp(),
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${RSVP_SHEET}!A:F`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[newRSVP.id, newRSVP.name, newRSVP.partySize, newRSVP.attending, newRSVP.notes, newRSVP.createdAt]],
    },
  });

  return newRSVP;
}

async function updateRSVP(sheets, id, updates) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${RSVP_SHEET}!A:F`,
  });

  const rows = response.data.values || [];
  if (rows.length <= 1) throw new Error('RSVP not found');

  const headers = rows[0];
  const idIndex = headers.indexOf('id');
  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) throw new Error('RSVP not found');

  // Check for duplicate name if updating name
  if (updates.name) {
    const rsvps = await getRSVPs(sheets);
    const duplicate = rsvps.find(
      (r) => r.id !== id && r.name.toLowerCase() === updates.name.toLowerCase()
    );
    if (duplicate) throw new Error('An RSVP with this name already exists');
  }

  // Update the row
  const currentRow = rows[rowIndex];
  const updatedRow = headers.map((header, index) => {
    if (updates.hasOwnProperty(header)) {
      return updates[header];
    }
    return currentRow[index];
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${RSVP_SHEET}!A${rowIndex + 1}:F${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [updatedRow],
    },
  });

  // Return updated RSVP
  const updatedRSVP = {};
  headers.forEach((header, index) => {
    let value = updatedRow[index];
    if (header === 'attending') {
      value = value === 'TRUE' || value === 'true' || value === true;
    }
    if (header === 'partySize') {
      value = parseInt(value) || 1;
    }
    updatedRSVP[header] = value;
  });

  return updatedRSVP;
}

async function deleteRSVP(sheets, id) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${RSVP_SHEET}!A:F`,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const idIndex = headers.indexOf('id');

  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) throw new Error('RSVP not found');

  // Get sheet ID
  const sheetMetadata = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const rsvpSheet = sheetMetadata.data.sheets.find(s => s.properties.title === RSVP_SHEET);
  const sheetId = rsvpSheet.properties.sheetId;

  // Delete the row
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex,
            endIndex: rowIndex + 1,
          },
        },
      }],
    },
  });

  return { success: true };
}

// ==================== Songs Functions ====================

async function getSongs(sheets) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SONGS_SHEET}!A:I`,
  });

  const rows = response.data.values || [];
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const songs = rows.slice(1).map((row) => {
    const song = {};
    headers.forEach((header, index) => {
      song[header] = row[index] || '';
    });
    return song;
  }).filter(song => song.id);

  // Sort by createdAt, newest first
  songs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return songs;
}

async function addSong(sheets, songData) {
  const newSong = {
    id: generateId(),
    youtubeId: songData.youtubeId,
    title: songData.title,
    artist: songData.artist,
    thumbnailUrl: songData.thumbnailUrl,
    dedicatedBy: songData.dedicatedBy,
    dedicationMessage: songData.dedicationMessage || '',
    happyBirthdayWords: songData.happyBirthdayWords || '',
    createdAt: getCurrentTimestamp(),
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SONGS_SHEET}!A:I`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        newSong.id,
        newSong.youtubeId,
        newSong.title,
        newSong.artist,
        newSong.thumbnailUrl,
        newSong.dedicatedBy,
        newSong.dedicationMessage,
        newSong.happyBirthdayWords,
        newSong.createdAt,
      ]],
    },
  });

  return newSong;
}

async function deleteSong(sheets, id) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SONGS_SHEET}!A:I`,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const idIndex = headers.indexOf('id');

  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) throw new Error('Song not found');

  // Get sheet ID
  const sheetMetadata = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const songsSheet = sheetMetadata.data.sheets.find(s => s.properties.title === SONGS_SHEET);
  const sheetId = songsSheet.properties.sheetId;

  // Delete the row
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex,
            endIndex: rowIndex + 1,
          },
        },
      }],
    },
  });

  return { success: true };
}

// ==================== Main Handler ====================

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const sheets = getSheets();
    const { action } = req.method === 'GET' ? req.query : req.body;

    let result;

    switch (action) {
      // RSVP actions
      case 'getRSVPs':
        result = await getRSVPs(sheets);
        break;
      case 'getRSVPByName':
        result = await getRSVPByName(sheets, req.query.name || req.body.name);
        break;
      case 'addRSVP':
        result = await addRSVP(sheets, req.body.rsvp);
        break;
      case 'updateRSVP':
        result = await updateRSVP(sheets, req.body.id, req.body.updates);
        break;
      case 'deleteRSVP':
        result = await deleteRSVP(sheets, req.body.id);
        break;

      // Songs actions
      case 'getSongs':
        result = await getSongs(sheets);
        break;
      case 'addSong':
        result = await addSong(sheets, req.body.song);
        break;
      case 'deleteSong':
        result = await deleteSong(sheets, req.body.id);
        break;

      // Test action
      case 'test':
        result = { success: true, message: 'API is working!' };
        break;

      default:
        result = {
          success: true,
          message: 'Birthday App API',
          actions: ['getRSVPs', 'getSongs', 'addRSVP', 'addSong', 'updateRSVP', 'deleteRSVP', 'deleteSong']
        };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
