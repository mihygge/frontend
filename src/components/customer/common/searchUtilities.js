import cogoToast from 'cogo-toast';

import { mainSearchApi } from '../../../api/customer/searchCategory';

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export const getCareOrHomesList = (values, page, requestType) => {
    let response = {};
    let searchType = !values.hasOwnProperty('applyFilter') ? 'main' : 'filter';

    requestType = 'result_page'; 

    values = {
        ...values, 
        checkin: values.checkin_checkout?.[0],
        checkout: values.checkin_checkout?.[1],
    }
    
    delete values.checkin_checkout;
    const { location, care_types, checkin, checkout, category, bedsNo } = values;
    const careTypesArray = category==='home_share' ? care_types?.map(ct => ct.value) : [care_types?.value]

    let query_params = ''
    query_params += 'location='+location
    for(let i=0; i<careTypesArray?.length; i++){
        query_params += '&care_types[]='+careTypesArray[i]
    }
    query_params += '&checkin='+formatDate(checkin)
    query_params += '&checkout='+formatDate(checkout)
    query_params += '&category='+category
    query_params += '&bedsNo='+bedsNo
    query_params += '&page='+page

    // need to implement later while doing location suggestion
    // query_params += '&request_page'+'result_page'/'home_page'; 
    // home_page - for location prediction
    // result_page - main serach + with filter
    query_params += '&request_page='+requestType


    const loadingMsg = 'Loading...';
    const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
    try{
        const response = mainSearchApi(query_params);
        hideLoading();
        response = response.data;
    }
    catch(error){
        console.log(error);
        hideLoading();
        cogoToast.error('Something went wrong');
        error.handleGlobally && error.handleGlobally()
    }

    return response;
}