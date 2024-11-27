export default {
    getCurrentDateTime() {
        const now = new Date();

        const pad = (num) => String(num).padStart(2, '0');

        const month = pad(now.getMonth() + 1); // Months are 0-based
        const day = pad(now.getDate());
        const year = now.getFullYear();

        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        return `${month}_${day}_${year}_${hours}${minutes}${seconds}`;
    }
}