export const sortFacility = (arrayTobeSorted) => {
    return arrayTobeSorted
        .sort((previousCategory, nextCategory) => Object.keys(nextCategory)[0] > Object.keys(previousCategory)[0] ? -1 : 1)
        .map(eachCategory => (
            Object.values(eachCategory)[0]
            .sort((previousFacility, nextFacility) => Object.values(nextFacility)[0] > Object.values(previousFacility)[0] ? -1 : 1)
        )
    )
}


