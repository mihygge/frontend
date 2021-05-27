export const totalNoOfDates = (checkin, checkout) => {
    const diffTime = Math.abs(checkout - checkin);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return totalDays === 0 ? 1 : totalDays;
}
