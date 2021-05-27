import axiosInstance from '../';

export const mainSearchApi = (query_params) => {
   return axiosInstance().get(`cares/search?${query_params}`);
}

export const serviceTypeSLDescApi = () => {
   return axiosInstance().get('service_types/services?category=senior_living');
}

export const locationSuggestionApi = (searchLocationFor) => {
   return axiosInstance().get(`search/autocomplete?search[query]=${searchLocationFor}`);
}
