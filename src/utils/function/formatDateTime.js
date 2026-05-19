

export function formatDate(type) {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    switch (type) {
        case 0:
            return `${month}/${day}/${year}`;
        case 1:
            return `${day}/${month}/${year}`;
        case 2:
            return `${year}/${month}/${day}`;
        case 3:
            return null;
        default:
            return `${year}-${month}-${day}`;
    }
}
export function formatTime(type) {
    const date = new Date();
    let hours = date.getHours();
    // const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    switch (type) {
        case 0:
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${("0" + hours).slice(-2)}:${minutes} ${period}`;
        case 1:
            return `${("0" + hours).slice(-2)}:${minutes}`;
        case 2:
            return null;
        default:
            return `${("0" + hours).slice(-2)}:${minutes}`;
    }

}
