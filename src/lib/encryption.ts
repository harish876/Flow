// Encryption key - in production, this should be stored securely and not in the frontend
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Convert string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

// Convert ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Generate a random initialization vector
async function generateIV(): Promise<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(12));
}

// Encrypt data using AES-GCM
export async function encryptData(data: string): Promise<{ encryptedData: string; iv: string }> {
    try {
        // Convert the encryption key to a CryptoKey
        const keyData = stringToArrayBuffer(ENCRYPTION_KEY);
        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        );

        // Generate a random IV
        const iv = await generateIV();

        // Encrypt the data
        const encryptedBuffer = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: new Uint8Array(iv),
            },
            key,
            stringToArrayBuffer(data)
        );

        // Convert the encrypted data and IV to base64 strings
        return {
            encryptedData: arrayBufferToBase64(encryptedBuffer),
            iv: arrayBufferToBase64(iv),
        };
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

// Decrypt data using AES-GCM
export async function decryptData(encryptedData: string, iv: string): Promise<string> {
    try {
        // Convert the encryption key to a CryptoKey
        const keyData = stringToArrayBuffer(ENCRYPTION_KEY);
        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );

        // Convert base64 strings back to ArrayBuffers
        const encryptedBuffer = base64ToArrayBuffer(encryptedData);
        const ivBuffer = base64ToArrayBuffer(iv);

        // Decrypt the data
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: new Uint8Array(ivBuffer),
            },
            key,
            encryptedBuffer
        );

        // Convert the decrypted data back to a string
        return arrayBufferToString(decryptedBuffer);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

// Utility function to encrypt MongoDB URI
export async function encryptMongoUri(uri: string): Promise<{ encryptedUri: string; iv: string }> {
    const { encryptedData, iv } = await encryptData(uri);
    return {
        encryptedUri: encryptedData,
        iv,
    };
}

// Utility function to decrypt MongoDB URI
export async function decryptMongoUri(encryptedUri: string, iv: string): Promise<string> {
    return decryptData(encryptedUri, iv);
} 