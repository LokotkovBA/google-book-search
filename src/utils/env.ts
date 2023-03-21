export function getGoogleApiKey() {
    if (import.meta.env.VITE_GOOGLE_API_KEY) {
        return import.meta.env.VITE_GOOGLE_API_KEY;
    }
    throw Error('Environment virable for Google API key is not set');
}
