export const getTomorrowsDate = () => {
    const today = new Date()
    let tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}