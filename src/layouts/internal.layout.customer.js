import React, { useState, useEffect } from 'react';
import Footer from '../components/commons/footer';
import Values from '../components/commons/values';
import HeaderWithUser from '../components/commons/headerWithUserLogin';
import BannerCustomer from '../components/customer/banner';
import MakeBooking from '../components/customer/makeBooking'
import useLocalStorage from '../effects/LocalStorage/use-local-storage';
import { mainSearchApi } from '../api/customer/searchCategory';
import cogoToast from 'cogo-toast';
import Header from '../components/commons/header';
import { serviceTypeSLDescApi } from '../api/customer/searchCategory';
import { withRouter } from 'react-router-dom';

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

const InternalLayoutCustomer = (props) => {

    const initialValues = {
        location: '',
        care_types: {value: "Assisted Living", label:"Assisted Living"},
        checkin_checkout: [],
        category: {value: "senior_living", label:"SENIOR LIVING"},
        bedsNo: 1,
        type: '',
    }

    const [userDetail] = useLocalStorage('userDetails', {});
    const userRole = userDetail.role;
    const [formValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        if(props?.location?.search){
            const decodedUri = decodeURI(props?.location?.search);
            const searchAt = decodedUri?.substr(1)?.split('&')?.[0]?.split('=')[1]
            const locType = decodedUri?.substr(1)?.split('&')?.[1]?.split('=')[1]

            const checkin = new Date();
            let checkout = new Date(checkin);
            checkout.setDate(checkout.getDate()+15);
            checkout = new Date(checkout);

            setFormValues({
                ...formValues,
                location: searchAt,
                type: locType,
                checkin_checkout: [checkin, checkout]
            })
            getCareOrHomesList({location: searchAt, type: locType}, 1,'home_page')
        }
    }, [props.location.search])

    useEffect(() => {
        if(props?.location?.state){
            const updatedFormValues = {
                ...formValues,
                ...props?.location?.state,
            }
            setFormValues({...updatedFormValues})
            getCareOrHomesList(updatedFormValues, 1,'result_page')
        }
    }, [props.location.state])

    const filterValues = {
        room_type: {},
        bed_type: {},
        licence_type: {},
        amenities: {},
        services: {},
        max: "",
        min: "",
        distance: "",
        clearAll: false,
        applyFilter: false,
    }

    const [searchType, setSearchType] = useState(null);
    const [filterFormValues, setFilterFormValues] = useState(filterValues);
    const [careOrHomes, setCareOrHomes] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totatlRecords, setTotalRecords] = useState(0);
    const [recordsPerPage, setRecordsPerPage] = useState(0);
    const [serviceTypeSLDescList, setServiceTypeSLDescList] = useState(null);
    const [careType, setCareType] = useState('Assisted Living');

    useEffect(() => {
        getServiceTypeSLDescList();
    }, [])

    const getServiceTypeSLDescList = async() => {
        try{
            const response = await serviceTypeSLDescApi();
            let list = new Map();
            response.data.data.forEach((service) => 
                list.set(service.attributes.name, service.attributes.desc) 
            )
            setServiceTypeSLDescList(list);
        }
        catch(error){
            console.log(error);
        } 
    }

    const getCareOrHomesList = async (values, page, requestType) => {

        let query_params = ''
        
        if(requestType==='result_page'){
            !values.hasOwnProperty('applyFilter') ? setSearchType('main') : setSearchType('filter');
            values = {
                ...values, 
                checkin: values.checkin_checkout?.[0],
                checkout: values.checkin_checkout?.[1],
            }
            
            delete values.checkin_checkout;
            const { location, care_types, checkin, checkout, category, bedsNo, type } = values;
            if(!(location && care_types && checkin && checkout && category && bedsNo)){
                alert('Please enter all the fields from main search');
                return;
            }
            const careTypesArray = category.value==='home_share' ? care_types?.map(ct => ct.value) : [care_types?.value]
    
            query_params += `location=${location}`
            query_params += `&type=${type}`
            for(let i=0; i<careTypesArray?.length; i++){
                query_params += `&care_types[]=${careTypesArray[i]}`
            }
            query_params += `&checkin=${formatDate(checkin)}`
            query_params += `&checkout=${formatDate(checkout)}`
            query_params += `&category=${category?.value}`
            query_params += `&bedsNo=${bedsNo}`
            query_params += `&page=${page}`
            query_params += `&request_page=${requestType}`
    
            if(values?.applyFilter){
                const formattedValues = {...values};
                const filtersMultiSelectInArray = ['room_type', 'bed_type', 'licence_type', 'amenities', 'services']
                const filtersSingleSelectInArray = ['max', 'min', 'distance']
                Object.keys(values).forEach(param => {
                    if(filtersMultiSelectInArray.includes(param)){
                        formattedValues[param] = [];
                        Object.keys(values[param]).forEach(key => {
                            if(values[param][key]){
                                formattedValues[param].push(key)
                            }
                        })
                        if(!(Object.keys(formattedValues[param]).length === 0)){
                            for(let i=0; i<formattedValues[param]?.length; i++){
                                query_params += `&${param}[]=${formattedValues[param][i]}`
                            }
                        }
                    }
                    else if(filtersSingleSelectInArray.includes(param)){
                        if(values[param]){
                            query_params += `&${param}=${values[param]}`
                        }
                    }
                    
                })
            }
        }
        else if(requestType==='home_page'){
            const { location, type } = values;
            query_params += `request_page=${requestType}`
            query_params += `&query=${location}`
            query_params += `&type=${type}`
            query_params += `&page=${page}`
        }

        const loadingMsg = 'Loading...';
        const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
        try{
            const response = await mainSearchApi(query_params);
            hideLoading();
            setCareOrHomes(response.data.data);
            setRecordsPerPage(response.data.meta['per_page'])
            setTotalRecords(response.data.meta['total-records'])
        }
        catch(error){
            console.log(error);
            hideLoading();
            cogoToast.error('Something went wrong');
            error.handleGlobally && error.handleGlobally()
        }
    }
    
    return (
        <div className="layout-internal">
            {
                !!userRole ? <HeaderWithUser /> : <Header />
            }
            <BannerCustomer
                getCareOrHomesList={getCareOrHomesList}
                formValues={formValues}
                setFormValues={setFormValues}
                setCareType={setCareType}
                filterInitialValues={filterValues}
                setFilterFormValues={setFilterFormValues}
            />
            <MakeBooking
                careOrHomes={careOrHomes}
                currentPage={currentPage}
                totatlRecords={totatlRecords}
                recordsPerPage={recordsPerPage}
                setCurrentPage={setCurrentPage}
                getCareOrHomesList={getCareOrHomesList}
                formValues={formValues}
                serviceTypeSLDescList={serviceTypeSLDescList}
                careType={careType}
                filterValues={filterValues}
                filterFormValues={filterFormValues}
                setFilterFormValues={setFilterFormValues}
                searchType={searchType}
            />
            {
                userRole === 'provider' ? '' :
                <Values />
            }
            <Footer />
        </div>
    )
}

export default withRouter(InternalLayoutCustomer);
