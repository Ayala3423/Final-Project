import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/server.log');

export function log(message, data = null) {
    console.log(message, data);
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}\n`;
    fs.appendFile(logFilePath, logLine, err => {
        if (err) {
            console.error('Failed to write log:', err);
        }
    });
};