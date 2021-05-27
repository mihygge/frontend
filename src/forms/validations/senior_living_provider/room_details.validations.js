import * as Yup from 'yup';
import {
    checkIfFilesAreTooBig,
    checkIfImageFilesAreCorrectType,
    checkIfVideoFilesAreCorrectType,
} from './attachements.validation';

let RoomDetailsSchema;
const priceRegex = /^\s*(?=.*[1-9])\d*(?:\.\d{2})?\s*$/;

export default RoomDetailsSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Room Name should be filled')
        .max(10, 'Room Name can not be greater than 10 characters.'),
    room_type: Yup.string().required('Room Type must be selected'),
    bathroom_type: Yup.string().required('Bathroom Type must be selected'),
    beds_attributes: Yup.array()
        .of(
            Yup.object().shape({
                bed_number: Yup.string()
                    .trim()
                    .required('Bed Number should be filled')
                    .max(10, 'Bed Number can not be greater than 10 characters.'),
                bed_type: Yup.string().required('Bed Type must be selected'),
                service_id: Yup.string().required('Care Type must be selected'),
            }),
        )
        .required('Must have Beds')
        .min(1, 'Minimum of 1 Bed')
        .max(4, 'More than 4 Beds can not be added in a room')
        .test({
            name: 'unique_bed_type',
            test: function (value) {
                if (!value) return true;
                const bedNumberList = value.map((bed) => bed.bed_number);
                function checkIfArrayIsUnique(myArray) {
                    return myArray.length === new Set(myArray).size;
                }
                if (!checkIfArrayIsUnique(bedNumberList)) {
                    return this.createError({
                        message: 'Bed Number should be unique',
                        path: `beds_attributes.${value.length - 1}.bed_number`,
                    });
                }
                return true;
            },
        })
        .test({
            name: 'beds_available_rooms',
            test: function (value) {
                let oldBedCount = 0;
                value.forEach((bed) => {
                    if (bed.id) {
                        oldBedCount++;
                    }
                });
                const newBedCount = this.parent.duplicate
                    ? value.length
                    : value.length - oldBedCount;
                if (!value) return true;
                if (newBedCount > this.parent.available_beds) {
                    const error_message = 'Available beds are less than added.';
                    return this.createError({ message: error_message, path: 'available_beds' });
                }
                return true;
            },
        })
        .test({
            name: 'beds_based_on_room_type',
            test: function (value) {
                const room_type = this.parent.room_type;
                if (!value) return false;
                let error = false,
                    message = '';
                if (room_type === 'single') {
                    error = value.length > 1;
                    if (error) message = `Room type single can have only one bed.`;
                } else if (room_type === 'double') {
                    error = value.length > 2;
                    if (error) message = `Room type double can have only two beds.`;
                } else if (room_type === 'for-three') {
                    error = value.length > 3;
                    if (error) message = `Room type triple can have only three beds.`;
                } else if (room_type === 'for-four') {
                    error = value.length > 4;
                    if (error) message = `Room type four can have only four beds.`;
                }
                return error ? this.createError({ message, path: 'room_type' }) : true;
            },
        }),
    price: Yup.string()
        .required('Price is mandatory')
        .matches(
            priceRegex,
            'Only positive value is allowed, decimal with a precision of 2 is optional',
        ),
    price_desc: Yup.string()
        .trim()
        .required('Price Description is mandatory')
        .max(200, "Price Description length shouldn't be greater 200 characters."),
    image_file: Yup.array()
        .when('previous_image_file', {
            is: (previous_image_file) => {
                if (!!!previous_image_file) {
                    return true;
                }
                return previous_image_file && previous_image_file.length === 0;
            },
            then: Yup.array()
                .required('Upload an Image file')
                .test(
                    'is-correct-file',
                    'Upload valid image file format',
                    checkIfImageFilesAreCorrectType,
                )
                .test('is-big-file', 'Max size allowed in 50mb', checkIfFilesAreTooBig),
            otherwise: Yup.array().min(0),
        })
        .test({
            name: 'max_image_number',
            test: function (value) {
                if (!value) return true;
                if (value?.length + this?.parent?.previous_image_file?.length > 10) {
                    const error_message =
                        'You can only add 10 images. Please remove the Previously selected images first.';
                    return this.createError({ message: error_message, path: 'image_file' });
                }
                return true;
            },
        }),
    video_file: Yup.array()
        .test('is-correct-file', 'Upload valid Video file format', checkIfVideoFilesAreCorrectType)
        .test('is-big-file', 'Max size allowed in 50mb', checkIfFilesAreTooBig)
        // May required later - for now Mandatory validation needs to be removed for video
        // .when('previous_video_file', {
        //     is: (previous_video_file) => previous_video_file && (previous_video_file.length === 0),
        //     then: Yup.array()
        //         // .required('Upload a Video file')
        //         .test('is-correct-file', 'Upload valid Video file format', checkIfVideoFilesAreCorrectType)
        //         .test('is-big-file', 'Max size allowed in 50mb',checkIfFilesAreTooBig),
        //     otherwise: Yup.array().min(0),
        // })
        .test({
            name: 'max_video_number',
            test: function (value) {
                if (!value) return true;
                if (value.length + this?.parent?.previous_video_file?.length > 1) {
                    const error_message =
                        'You can only add one video. Please remove the Previously selected video first.';
                    return this.createError({ message: error_message, path: 'video_file' });
                }
                return true;
            },
        }),
    available_beds: Yup.number().min(0, 'Available beds are less than added.'),
    available_date: Yup.string()
        .test('is-empty-date-ranges', 'Date Range must be selected', function (date_range) {
            if (!date_range) {
                return false;
            } else if (date_range?.[0] === '' || date_range?.[0] === ',') {
                return false;
            }
            return true;
        })
        .test({
            name: 'valid-date-range-for-booked-room',
            test: function (date_range) {
                const { previous_available_date, hasBooking } = this.parent;
                let error = false;
                let message = [];

                // If the room has booking, then we have to check two things.
                if (hasBooking) {
                    const [from, to] = date_range.split(',') || [];
                    const [prevFrom, prevTo] = previous_available_date || [];

                    // 1. available_from should not change.
                    if (+new Date(from) !== +new Date(prevFrom)) {
                        error = true;
                        message.push('Cannot change available_from date.');
                    }
                    // 2. available_to if changed, should be greater than the previous selected available_to.
                    if (+new Date(prevTo) > +new Date(to)) {
                        error = true;
                        message.push('Cannot select date less than previous available_to date.');
                    }
                    message = message.join(' ');
                    return error ? this.createError({ message, path: 'available_date' }) : true;
                }
                return true;
            },
        }),
});
