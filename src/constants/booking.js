import { careCategory } from './customerSearchDropDown';

export const careTypeOptions = [{ label: 'ALL', value: '' }, ...careCategory];

export const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Terminated', value: 'terminated' },
];
