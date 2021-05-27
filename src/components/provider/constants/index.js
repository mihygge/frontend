export const roomTypeOptions = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'for-three', label: 'Triple' },
    { value: 'for-four', label: 'Four' },
];

export const bathroomTypeOptions = [
    { value: 'attached', label: 'Attached' },
    { value: 'common', label: 'Common' },
];

export const roomInitDetails = ({ care_id }) => ({
    room_type: '',
    bathroom_type: '',
    available_date: ['', ''],
    previous_available_date: ['', ''],
    name: '',
    price: '',
    price_desc: '',
    beds_attributes: [
        {
            bed_type: '',
            bed_number: '',
            service_id: '',
        },
    ],
    care_id,
    video_file: '',
    image_file: '',
    previous_video_file: [],
    previous_image_file: [],
    imageOrder: [],
    destroyBed: [],
});

export const bedTypeOptions = [
    { value: 'king', label: 'King' },
    { value: 'queen', label: 'Queen' },
    { value: 'twin', label: 'Twin' },
    { value: 'hospital', label: 'Hospital' },
];
