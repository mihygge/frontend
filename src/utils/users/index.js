
export let findProviderRole = (roles) => {
    return roles.find((role) => role.name === 'provider')
}

export let findCustomerRole = (roles) => {
    return roles.find((role) => role.name === 'customer')
}

export let findWorkerRole = (roles) => {
    return roles.find((role) => role.name === 'social_worker')
}

export let StringToKey = (s) => (s.toLowerCase().split(" ").join('_'))

export let KeyToString = (item) => (item.split('_').map((e) => e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()).join(' '))