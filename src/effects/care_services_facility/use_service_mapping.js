import { useState, useEffect } from 'react'

export const useServiceMapping = (provided_services) => {
    
    const [serviceMapping, setServiceMapping] = useState({})
    const [formValues, setFormValues] = useState({})
    
    useEffect(() => {
        const servicetypeValues = Object.values(provided_services || {})
        let initialValues = {}
        const serviceTypeMapping = servicetypeValues.reduce((hash, obj) => {
            Object.keys(obj["services"]).map(key => 
                hash[key] = {serviceType: obj["id"], serviceId: obj["services"][key]["id"] }
            )
            return hash
        }, {})
        Object.keys(serviceTypeMapping).map( key => initialValues[key] = false)
        setServiceMapping(serviceTypeMapping)
        setFormValues(initialValues)
    }, [provided_services])

    return { serviceMapping, formValues }
} 