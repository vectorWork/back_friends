import {Comanda} from '../models/comanda.model';

let lastCode: string | null = null;

async function getLastCodeFromDatabase(): Promise<string | null> {
    try {
        const lastComanda = await Comanda.findOne().sort({ createdAt: -1 }).select('codigo').exec();
        return lastComanda ? lastComanda.codigo : null;
    } catch (error) {
        console.error('Error fetching last code from database:', error);
        return null;
    }
}

function incrementCode(code: string): string {
    const numericPart = parseInt(code.substring(1), 10);
    const letterPart = code.charAt(0);

    if (numericPart < 999) {
        return `${letterPart}${numericPart + 1}`;
    } else {
        const nextCharCode = letterPart.charCodeAt(0) + 1;
        if (nextCharCode <= 'Z'.charCodeAt(0)) {
            return `${String.fromCharCode(nextCharCode)}1`;
        } else {
            // Handle case where it exceeds 'Z' (e.g., AA1, AB1, etc.) -
            // This implementation only goes up to Z999.
            // For a more complex alphanumeric sequence, additional logic is needed.
            return 'Error: Code sequence exceeded Z999';
        }
    }
}

export async function generateNextCode(): Promise<string> {
    if (lastCode === null) {
        lastCode = await getLastCodeFromDatabase();
    }

    if (lastCode === null) {
        lastCode = '1';
    } else {
        const num = parseInt(lastCode, 10);
        if (!isNaN(num) && num < 999) {
            lastCode = (num + 1).toString();
        } else if (lastCode.match(/^[A-Z]\d{1,3}$/)) {
            lastCode = incrementCode(lastCode);
        } else if (num === 999) {
             lastCode = 'A1';
        }
         else {
            // Handle unexpected code format
             lastCode = '1'; // Reset or handle error appropriately
         }
    }

    return lastCode;
}