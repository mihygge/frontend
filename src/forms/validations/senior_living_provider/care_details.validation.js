import * as Yup from "yup";
import { setLocale } from 'yup';

const noWhiteSpace = /(\S((\s){0,1}\S)*)+$/;

let CareDetailValidation;
const no_of_room_bed_bath_rest = /^[1-9][0-9]{0,3}$/

setLocale({
    mixed: {
        notType: '${path} is required',
    }
})

function checkIfFilesAreTooBig(file ){
    const isVideo = file?.[0]?.type?.includes('video') ? true : false;
    const isImage = file?.[0]?.type?.includes('image') ? true : false;

    let fileSize = 0;
    if(isImage){
        file && file.forEach((f) => {
            fileSize += f?.size;
        })
    }
    if(isVideo){
        fileSize = file?.[0]?.size
    }

    let valid = true
    if ((fileSize / 1024 / 1024) > 50) {
        valid = false
    }
    return valid
}
  
function checkIfImageFilesAreCorrectType(file){
    let valid = true
    if (file) {
      
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/tif', 'image/gif'].includes(file?.[0]?.type)) {
          valid = false
        }
    }
    return valid
}

function checkIfVideoFilesAreCorrectType(file){
    let valid = true
    if (file?.length) {
        if (!['video/mp4','video/x-m4v', 'video/avi', 'video/mpg', 'video/mkv',
            'video/webm', 'video/mp2', 'video/mpeg', 'video/mpe', 'video/mpv',
            'video/ogg', 'video/m4p', 'video/m4v', 'video/wmv', 'video/quicktime', 'video/x-quicktime', 'video/qt',
            'video/flv', 'video/swf', 'video/avchd'].includes(file?.[0]?.type)) {
            valid = false
        }
    }
    return valid
}

export default CareDetailValidation = Yup.object().shape({
    "image_file": Yup.array()
        .when('previous_image_file', {
            is: (previous_image_file) => previous_image_file && (previous_image_file.length === 0),
            then: Yup.array()
                .required('Upload an Image file')
                .test('is-correct-file', 'Upload valid image file format', checkIfImageFilesAreCorrectType)
                .test('is-big-file', 'Max size allowed in 50mb',checkIfFilesAreTooBig),
            otherwise: Yup.array().min(0),
        })
        .test({name: 'max_image_number', test: function(value){
            if(!value)
                return true
            if(value.length + this.parent.previous_image_file.length > 10){
                const error_message = 'You can only add 10 images. Please remove the Previously selected images first.'
                return this.createError({message: error_message, path: 'image_file'}) 
            }
            return true
        }}),
    "video_file": Yup.array()
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
        .test({name: 'max_video_number', test: function(value){
            if(!value)
                return true
            if(value.length + this.parent.previous_video_file.length > 1){
                const error_message = 'You can only add one video. Please remove the Previously selected video first.'
                return this.createError({message: error_message, path: 'video_file'}) 
            }
            return true
        }}),
    "no_of_rooms": Yup.string()
        .matches(no_of_room_bed_bath_rest, 'No of rooms should be numeric, must be between length of 1 and 4 digit')
        .required('No. Of Rooms should be filled'),
    "no_of_beds": Yup.string()
        .matches(no_of_room_bed_bath_rest, 'No of bedrooms should be numeric, must be between length of 1 and 4 digit')
        .required('No. Of bedrooms should be filled')
        .test('should-be-less-than-4-times-of-rooms', 'Should be less than or equal to 4 times that of no of rooms', function(value) {
            const no_of_rooms = this.parent.no_of_rooms
            if (!no_of_rooms) {
                return true;
            }
            if(value && (parseInt(value) <= 4 * parseInt(no_of_rooms))){
                return true
            }
            else{
                return false
            }
        }),
    "no_of_bathrooms": Yup.string()
        .matches(no_of_room_bed_bath_rest, 'No of bathrooms should be numeric, must be between length of 1 and 4 digit')
        .required('No. Of bathrooms should be filled'),
    "no_of_restrooms": Yup.string()
        .matches(no_of_room_bed_bath_rest, 'No of restrooms should be numeric, must be between length of 1 and 4 digit')
        .required('No. Of restrooms should be filled'),
    "description": Yup.string().trim('dgfs')
        .max(2500, "Description length shouldn't be greater 2500 characters."),
        // .matches(noWhiteSpace, 'Remove empty space'),
    "area_description": Yup.string().trim()
        .max(1000, "Area description length shouldn't be greater 1000 characters."),
        // .matches(noWhiteSpace, 'Remove empty space'),
})  