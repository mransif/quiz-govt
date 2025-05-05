import fs from 'fs';
import path from 'path';

// Path to the participants data file
const dataFilePath = path.join(process.cwd(), 'data', 'participants.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize empty participants file if it doesn't exist
const initializeDataFile = () => {
  ensureDataDir();
  
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));
  }
};

// Get all participants
export const getAllParticipants = () => {
  try {
    initializeDataFile();
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading participants data:', error);
    return [];
  }
};

// Add a new participant
export const addParticipant = (participant) => {
  try {
    initializeDataFile();
    
    const participants = getAllParticipants();
    
    // Check if participant with same phone number already exists
    const existingIndex = participants.findIndex(p => p.phone === participant.phone);
    
    if (existingIndex !== -1) {
      // Update existing participant's score if new score is higher
      if (participant.score > participants[existingIndex].score) {
        participants[existingIndex] = participant;
      }
    } else {
      // Add new participant
      participants.push(participant);
    }
    
    // Write updated data back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(participants, null, 2));
    
    return { success: true };
  } catch (error) {
    console.error('Error adding participant:', error);
    return { success: false, error: error.message };
  }
};

// Get leaderboard (sorted by score)
export const getLeaderboard = () => {
  const participants = getAllParticipants();
  return participants.sort((a, b) => b.score - a.score);
};