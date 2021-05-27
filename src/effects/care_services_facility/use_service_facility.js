import { useState, useEffect } from 'react';

import {FetchRoomTypes, GetServiceType, GetFacilityType } from '../../api/senior_living'

 
const buildMappingServiceType = (care_service_data, keyName="services") => {
    const string_to_keys = (name1) => {
        return name1.toLowerCase().split(' ').join('_')
    }
    let care_service_paramitize = {}
    for(let i=0;i < care_service_data.length;i++){
    
        let sub_services = care_service_data[i][keyName]
        let inner_service_detail =  sub_services.reduce(function(map, obj) {
            map[string_to_keys(obj.name)] = {labelText: obj.name,  id: obj.id};
            return map;
        }, {})
         
        care_service_paramitize[string_to_keys(care_service_data[i]['name'])] = {
            labelText: care_service_data[i]['name'],
            id: care_service_data[i]['id'],
            services: inner_service_detail
        }
    }
    return care_service_paramitize
}

const errorHandler = (reason) => {
    if(!reason.response.status === 422){
        reason.handleGlobally && reason.handleGlobally()
    }
}

export const useServiceFacility = (serviceType) => {
    const [provided_services, setProvidedServices] = useState([])
    const [room_types, setRoomTypes] = useState([])
    const [facilities, setFacilities] = useState([])
    
    const getRoomTypes = async() => {
        try{
            const response = await FetchRoomTypes();
            setRoomTypes(response.data);
        }
        catch(err){
            console.log(err);
            errorHandler(err)
        }
    }
    
    const getServiceType = async() => {
        try{
            const response = await GetServiceType(serviceType)
            setProvidedServices(buildMappingServiceType(response.data))
        }catch(err){
            errorHandler(err)
        }
    }
    
    const getFacilities = async() => {
        try{
            const response = await GetFacilityType()
            setFacilities(buildMappingServiceType(response.data, 'facilities'))
        }catch(err){
            console.log(err)
            errorHandler(err)
        }
    }
    
    useEffect(() =>{
        getRoomTypes();
        getServiceType()
        getFacilities()
    }, [])
    
    return { room_types, facilities, provided_services }
}