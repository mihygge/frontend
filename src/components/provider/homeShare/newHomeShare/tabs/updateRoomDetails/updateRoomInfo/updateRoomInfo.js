import React, { useState, useEffect } from 'react';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import cogoToast from 'cogo-toast';
import axios from 'axios';
import FormInput from '../../../../../../shared/formInput';
import FormSelect from '../../../../../../shared/formSelect';
import FormCheck from '../../../../../../shared/formCheckOrRadio';
import FileUpload from '../../../../../../shared/fileUpload';
import videoIcon from '../../../../../../../assets/images/video-upload.svg';
import fileIcon from '../../../../../../../assets/images/image-upload.svg';
import RoomDetailsSchema from '../../../../../../../forms/validations/senior_living_provider/room_details.validations'
import { StringToKey, KeyToString } from '../../../../../../../utils/users'
import UpdateBedDetails from './updateBed_details'
import {AddRoomApi, AddLicense as AddAssets, AddLicense} from '../../../../../../../api/senior_living'
import CrossBtn from '../../../../../../../assets/images/close.svg';
import InfoIcon from '../../../../../../../assets/images/icon-info.svg';
import SortableImages from '../../../../../../shared/sortbleImages/sortbleImages';
import { deleteAssetApi } from '../../../../../../../api/updateServiceFunctionality/updateServiceDetails';
import UpdateRoomApi from '../../../../../../../api/senior_living/update_room.api';

import RoomInfoCheckBoxes from '../../../../../shared/roomInfoCheckBoxes';
import {roomTypeOptions, bathroomTypeOptions} from "../../../../../constants";

import { getTomorrowsDate } from '../../../../../utils/dates';

const tomorrow = getTomorrowsDate();

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}

let _formikProps;
const UpdateRoomInfo = (props)=>{
    const { Formindex, toggle, bindSubmitForm, submit,
            RoomServiceType:{serviceType, serviceMapping}, 
            available_services, available_room_details,
            updateAvailableRoomDetails, completeForm,
            previous_room_details, savedEarlier, hasBooking } = props
    const disabled_submission =  props.available_room_details.total_bedrooms < 0
    
    const selected_room_services = (values) => {
        if (!values.selectedRoomServicesObj) {
            return [];
        }

        let selected_room_services_attributes = []
        Object.entries(values.selectedRoomServicesObj).forEach(([key, value]) => {
            if(value && serviceMapping[key]){
                let room_service_type_id = serviceMapping[key]["service_type_id"]
                let room_service_id = serviceMapping[key]["service_id"]
                selected_room_services_attributes.push({
                    id: values.selected_room_services.find(
                        (ser) =>
                            room_service_id === ser.service.id &&
                            room_service_type_id === ser.service_type.id,
                    )?.id,
                    room_service_type_id,
                    room_service_id,
                });
            }
        })
        return selected_room_services_attributes
    }

    let initialValues = {
        ...props.initialValues,
        available_beds: props.available_room_details.total_bedrooms,
        hasBooking,
    }
    const [FormValues, setFormValues] = useState(initialValues);

    useEffect(() => {
        const updatedFormValues = {
            ...FormValues,
            available_beds: props.available_room_details.total_bedrooms
        }
        setFormValues(updatedFormValues)
    }, [props.available_room_details])

    useEffect(() => {
        if(initialValues)
            setFormValues(initialValues)
    }, [initialValues?.id])
    
    const[previousRoomDetails, setPreviousRoomDetails] = useState(previous_room_details);

    useEffect(() => {
        if(available_services.length && savedEarlier && previousRoomDetails){
            savedEarlier && setPreviousRoomValues();
        }
    }, [available_services, savedEarlier, previousRoomDetails])

    const setPreviousRoomValues = () => {
        const { name, room_type, bathroom_type, 
            beds, price, price_desc, available_from, available_to,
            files, selected_room_services, no_of_beds_allowed
        } = previousRoomDetails;

        const available_date = [];
        available_date.push(available_from);
        available_date.push(available_to);

        let videoIndex;
        let video_file = [];
        let image_file = [];
        if(files && files.length>0 && image_file.length===0){
            files.forEach((file, index) => {
            if(
                file?.asset_type === 'video/mp4' || file?.asset_type === 'video/x-m4v'
                || file?.asset_type === 'video/avi' || file?.asset_type === 'video/mpg'
                || file?.asset_type === 'video/mkv' || file?.asset_type === 'video/webm'
                || file?.asset_type === 'video/mp2' || file?.asset_type === 'video/mpeg'
                || file?.asset_type === 'video/mpe' || file?.asset_type === 'video/mpv'
                || file?.asset_type === 'video/ogg' || file?.asset_type === 'video/m4p'
                || file?.asset_type === 'video/m4v' || file?.asset_type === 'video/wmv'
                || file?.asset_type === 'video/quicktime' || file?.asset_type === 'video/x-quicktime'
                || file?.asset_type === 'video/qt' || file?.asset_type === 'video/flv' 
                || file?.asset_type === 'video/swf' || file?.asset_type === 'video/avchd'
            ){
                videoIndex = index;
                video_file = [file];
            }
            })
            if(video_file.length){
                files.splice(videoIndex,1);
            }
            image_file = files;
        }

        let previouslySelectedRoomServices = {};
        for(let i=0;i<selected_room_services?.length;i+=1){
            const key = StringToKey(selected_room_services[i]?.service?.name);
            previouslySelectedRoomServices[key] = true
        }

        const findServiceId = (serviceName) => {
            let formattedServiceName = StringToKey(serviceName);
            formattedServiceName = KeyToString(formattedServiceName);

            let serviceId;
            available_services.forEach((service, index) => {
                if(service.name === formattedServiceName){
                    serviceId = service.value;
                    return serviceId;
                }
            })
            return serviceId;
        }


        let updatedBeds = beds;
        updatedBeds.forEach((bed, index) => {
            updatedBeds[index] = {
                ...updatedBeds[index],
                service_id: findServiceId(updatedBeds?.[index]?.service_name),
            }
        })

        const updatedFormValues = {
            ...FormValues,
            selectedRoomServicesObj: previouslySelectedRoomServices,
            beds_attributes: beds && savedEarlier ? updatedBeds : [
                {
                    bed_type: "",
                    bed_number: "",
                    service_id: ""
                }
            ],
            previous_video_file: video_file,
            previous_image_file: image_file,
            name, room_type, bathroom_type, price, price_desc, available_date, files,
            previous_available_date: available_date,
            available_beds: no_of_beds_allowed,
            selected_room_services,
            previous_selected_room_services: selected_room_services,
            destroyBed: []
        }
        setFormValues(updatedFormValues);
    }

    const handleRemoveAsset = (assetId, imageOrVideo) => {

        const previousImageFile = FormValues?.previous_image_file;
        let removableImageIndex;
        if(imageOrVideo === 'image'){
            previousImageFile && previousImageFile.length && previousImageFile.forEach((image, index) => {
                if(image.id === assetId){
                    removableImageIndex = index;
                }
            })
        }

        const loadingMsg = 'Removing media file...';
        const successMsg = 'Media file removed.'
        const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })

        deleteAssetApi (assetId).then(() => {
            hideLoading();
            cogoToast.success(successMsg);

            let updatedFormValues;
            
            if(imageOrVideo === 'video'){
                const previous_video_file = [];
                updatedFormValues = {
                    ...FormValues,
                    previous_video_file
                }
            }
            else if(imageOrVideo === 'image'){
                previousImageFile.splice(removableImageIndex, 1);
                updatedFormValues = {
                    ...FormValues,
                    previous_image_file: [...previousImageFile]
                }
            }

            setFormValues(updatedFormValues)
        }).catch((err) => {
            hideLoading();
            console.log(err);
        })
    }

    const updateRoomFunctionality = (values, actions, request_body, available_from, available_to) => {
        const roomId = request_body?.room?.id
        delete request_body.room.id

        // For deleting the beds
        const destroyBedIds = request_body?.room?.destroyBed;
        if(destroyBedIds?.length){
            const updatedBedAttributes = request_body.room.beds_attributes;
            request_body.room.beds_attributes = [];

            for(let i=0; i<destroyBedIds.length; i++){
                request_body["room"]["beds_attributes"].push({
                    _destroy: true,
                    id: destroyBedIds[i]
                })
                
            }
            updatedBedAttributes.forEach((bed, index) => {
                request_body["room"]["beds_attributes"].push(bed)
            })
        }
        request_body["room"]["beds_attributes"] = {...request_body["room"]["beds_attributes"]}

        // for Availability field
        request_body["room"]["available_from"] = available_from;
        request_body["room"]["available_to"] = available_to;
        const formatted_available_from = available_from;
        const formatted_today_date = formatDate(new Date());
        const formatted_available_from_array = formatted_available_from.split('-');
        const formatted_today_date_array = formatted_today_date.split('-');
        let available_from_mmdd = formatted_available_from_array[1]+'-'+formatted_available_from_array[0]+'-'+formatted_available_from_array[2];
        let today_date_mmdd = formatted_today_date_array[1]+'-'+formatted_today_date_array[0]+'-'+formatted_today_date_array[2];
        available_from_mmdd = new Date(available_from_mmdd);
        today_date_mmdd = new Date(today_date_mmdd);

        // if 'available_from' is less than today's date, change it to today's date
        if(available_from_mmdd.getTime()<=today_date_mmdd.getTime()){
            request_body.room.available_from = formatted_today_date;
        }

        // for room services
        const previousRoomServices = values.previous_selected_room_services
        const currentRoomServices = request_body.room.selected_room_services_attributes

        // Compare previousRoomServices and currentRoomServices for 3 cases
        // case 1 : No Change - Remove from body request
        // case 2 : New Check - Let it go with body request - do nothing
        // case 3 : New Uncheck - add destroy in the beginning of array

        // Fetch all the objects which does not have id because they are the new ones.
        const newSelectedServices = currentRoomServices.filter((ser) => !ser.id);
        // Fetch the ones that are not there in the previous services.
        // Those were removed from the form.
        const destroyableServices = previousRoomServices.filter(
            (pre) => !currentRoomServices.find((c) => c.id === pre.id)
        );

        const updatedRoomServicesRequestBody = [
            ...destroyableServices.map(ser => {
                return {
                    _destroy: true,
                    id: ser.id
                }
            }),
            ...newSelectedServices,
        ]
        
        request_body.room.selected_room_services_attributes = {...updatedRoomServicesRequestBody};

        // For Assets Update
        let formData = new FormData();
        let updateAssets = false;

        if(values?.video_file?.length || values?.image_file?.length){
            updateAssets = true;
            formData.append('assetable_type', 'room')
            formData.append('assetable_id', roomId)
            formData.append('type', 'update');
            if(values?.image_file?.length){
                for(let i=0; i<values?.image_file?.length; i++){
                    formData.append(`assets[${i}][sort]`, values?.previous_image_file?.length + i + 1)
                    formData.append(`assets[${i}][file]`, values?.image_file[i])
                }
            }
            if(values?.video_file?.length){
                formData.append(`assets[11][sort]`, 1)
                formData.append(`assets[11][file]`, values?.video_file[0])
            }
        }

        const room_api = UpdateRoomApi(roomId, request_body)
        const assets_api = updateAssets ? AddLicense(formData) : null;

        const loadingMsg = 'Updating Room Details...';
        const successMsg = 'Room Details updated successfully.';

        const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
        axios.all([room_api, assets_api])
        .then(axios.spread((res) => {
            // Both room update and assets update requests are now complete
            hideLoading();
            cogoToast.success(successMsg)
            const { name, room_type, bathroom_type, beds, price, price_desc, available_from, available_to, files, selected_room_services, no_of_beds_allowed } = res.data;
            setPreviousRoomDetails({
                ...previousRoomDetails,
                name, room_type, bathroom_type, 
                beds, price, price_desc, available_from, available_to,
                files, selected_room_services, no_of_beds_allowed,
            })
            
            // ordering images only in case of update and more than one picture available for a room
            if(values?.previous_image_file?.length>1 && values?.imageOrder?.length){
                const loadingMsg = 'Saving Image order...';
                const successMsg = 'Image order updated successfully';
                const { hide: hideImageOrderingLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
                let imageOrderingFormData = new FormData();
                imageOrderingFormData.append('assetable_type', 'room')
                imageOrderingFormData.append('assetable_id', roomId)
                imageOrderingFormData.append('type', 'update');
                for(let i=0; i<values?.imageOrder?.length; i++){
                    imageOrderingFormData.append(`assets[${i}][id]`, values?.imageOrder[i]?.imageId)
                    imageOrderingFormData.append(`assets[${i}][sort]`, i+1)
                }
                AddLicense(imageOrderingFormData).then((res) => {
                    hideImageOrderingLoading();
                    cogoToast.success(successMsg);
                })
                .catch((reason) => {
                    hideImageOrderingLoading();
                    console.log(reason);
                    cogoToast.error('Error on server.')
                })
            }

            const remain_rooms = available_room_details.total_rooms; // after update, room will be as it is
            updateAvailableRoomDetails({total_bedrooms: no_of_beds_allowed, total_rooms: remain_rooms})
            completeForm(Formindex - 1, values, roomId, false, true)
        }))
        .catch((reason) => {
            hideLoading();
            console.log(reason)
            if(reason.response?.status === 422){
                cogoToast.error('Validation Failure, Invalid data being sent')
                let all_error_keys =Object.keys(reason.response.data[0])
                let errors = {}
                for(let i = 0;i < all_error_keys.length;i++){
                    if(all_error_keys[i].startsWith('beds')){
                        errors['available_beds'] = [reason.response.data[0][all_error_keys[i]]]
                    } else if(all_error_keys[i].startsWith('available')){
                        errors['available_date'] = [reason.response.data[0][all_error_keys[i]]]
                    } else{
                        errors[all_error_keys[i]] = reason.response.data[0][all_error_keys[i]]
                    }
                }

                actions.setErrors(errors)
            } else{
                cogoToast.error('Error on server.')
                reason.handleGlobally && reason.handleGlobally()
            }
        })
    }
    
    const addNewRoomFunctionality = (values, actions, request_body, available_from, available_to, updatedBed_attribute) => {
        // have to delete these values from request_body in case of duplicate from previously added data
        delete request_body.room.id
        delete request_body.room.care_id
        delete request_body.available_date
        delete request_body.room.beds
        delete request_body.room.files
        delete request_body.room.previous_video_file
        delete request_body.room.previous_image_file
        delete request_body.room.imageOrder
        delete request_body.room.selected_room_services

        request_body["room"]["care_id"] = props.care_id
        request_body["room"]["available_from"] = available_from
        request_body["room"]["available_to"] = available_to
        request_body.room.beds_attributes = {...updatedBed_attribute}
        
        const loadingMsg = 'Please wait while the room data is being created';
        const successMsg = 'Room Details has been successfully saved.';

        const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
        try{
            AddRoomApi(request_body).then(async (room_detail_res) => {
                hideLoading();
                const room_id = room_detail_res.data.id
                let formData = new FormData();
                let video = values.video_file
                let image = values.image_file
                if(video.length){ //video (non - mandatory)
                    formData.append('assets[]', video[0])
                }
                formData.append('assets[]', image[0])
                formData.append('assetable_type', 'room')
                formData.append('assetable_id', room_id)

                const loadingMsg = 'Uploading assets...';
                const { hide: UploadAssetsLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
                AddAssets(formData).then((res) => {
                    UploadAssetsLoading();
                    cogoToast.success(successMsg);
                })

                const remain_rooms = available_room_details.total_rooms - 1
                updateAvailableRoomDetails({total_bedrooms: room_detail_res.data.no_of_beds_allowed, total_rooms: remain_rooms})
                completeForm(Formindex - 1, values, room_id, true, false)
                setFormValues(values)
            })
            .catch((reason) => {
                hideLoading();
                if(reason.response?.status === 422){
                    cogoToast.error('Validation Failure, Invalid data being sent')
                    let all_error_keys =Object.keys(reason.response.data[0])
                    let errors = {}
                    for(let i = 0;i < all_error_keys.length;i++){
                        if(all_error_keys[i].startsWith('beds')){
                            errors['available_beds'] = [...errors['available_beds'], reason.response.data[0][all_error_keys[i]]]
                        } else if(all_error_keys[i].startsWith('available')){
                            errors['available_date'] = [...errors['available_beds'], reason.response.data[0][all_error_keys[i]]]
                        } else{
                            errors[all_error_keys[i]] = reason.response.data[0][all_error_keys[i]]
                        }
                    }

                    actions.setErrors(errors)
                } else{
                    reason.handleGlobally && reason.handleGlobally()
                }
            
            })
        }
        catch(reason){
            cogoToast.error('Unknown error')
        }
    }

    const onSubmitFunction = (values, actions) => {
        if(submit){
            cogoToast.warn('Form has been already submitted. For editing the same, you need to refresh the page.')
            return
        } else if(disabled_submission){
            cogoToast.warn('No Available beds rooms.')
            return 
        }
        
        let request_body = {
            room: {
                selected_room_services_attributes: selected_room_services(values)
            }
        }
        const date_range = values['available_date']
        const available_from = formatDate(date_range[0])
        const available_to  =  formatDate(date_range[1])
        let updatedBed_attribute = [];
        Object.keys(values).forEach(key => {
            if(key==='beds_attributes'){
                values.beds_attributes.forEach((bed) => {
                    let updatedBed = {
                        bed_number: bed.bed_number,
                        bed_type: bed.bed_type,
                        service_id: bed.service_id
                    }
                    updatedBed_attribute.push(updatedBed)
                })
            }
            if(!serviceMapping[key] ){
                request_body['room'][key] = values[key]
            }
        })

        delete request_body.image_file
        delete request_body.video_file
        delete request_body.serviceType
        delete request_body.serviceMapping
        delete request_body.available_beds
        
        if(request_body?.room?.id){ // Update
            updateRoomFunctionality(values, actions, request_body, available_from, available_to);
        }
        else{ // Add new room / duplicate room details in update room details tab
            addNewRoomFunctionality(values, actions, request_body, available_from, available_to, updatedBed_attribute);
        }
    }
    
    return(
        <div className="form-in-new-care form-in-new-care-room-details form-in-new-care-with-checks">
            <h3 className="title-room">Room No. {props.room_no}</h3>
            <Formik 
                initialValues={FormValues} 
                enableReinitialize={true}
                validationSchema={RoomDetailsSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, actions) => {
                    onSubmitFunction(values, actions);
                }}
                >
                {(formikProps) => {
                    const { handleSubmit, setFieldValue, values, errors, touched } = formikProps;
                    bindSubmitForm(formikProps.submitForm, Formindex - 1);
                    window._formikProps[Formindex - 1] = formikProps
                    return(
                    <form>
                        <div className="three-inputs-holder">
                            <FormInput
                                name="name"
                                type="text"
                                labelText="Room Name/ID"
                                placeholder="Enter room name here"
                                required
                                disabled={hasBooking}
                            />
                            <FormSelect
                                name="room_type"
                                labelText="Room Type"
                                placeholder="Select room type" 
                                options={roomTypeOptions}
                                onChange={(data) => setFieldValue('room_type', data.value)} 
                                value={roomTypeOptions.find((o) => o.value === values['room_type'])}
                                error={errors?.room_type}
                                required="required"
                                isDisabled={hasBooking}
                            />
                            <FormSelect
                                name="bathroom_type"
                                labelText="Bathroom"
                                placeholder="Select bathroom type" 
                                options={bathroomTypeOptions}
                                onChange={(data) => setFieldValue('bathroom_type', data.value)} 
                                value={bathroomTypeOptions.find((o) => o.value === values['bathroom_type'])}
                                error={errors?.bathroom_type}
                                required
                                isDisabled={hasBooking}
                            />
                        </div>
                        <div className="section-bed-details">
                            {/* Note to FE :: Repeat this section on clicking of "Add more" */}
                            { /* <FieldArray name="beds_attributes" component={UpdateBedDetails} /> */}
                            <FieldArray name="beds_attributes" >
                                {(childProps)=> {
                                    return (
                                        <UpdateBedDetails
                                            {...childProps}
                                            available_services={available_services}
                                            savedEarlier={savedEarlier}
                                            previous_bed_details={FormValues?.beds_attributes}
                                            hasBooking={hasBooking}
                                        />
                                    )
                                }}
                            </FieldArray>
                        </div>
                        <div className="calendar-input-holder">
                            <FormInput
                                type="text"
                                labelText="Price per Bed / day ($)"
                                name="price"
                                placeholder="Enter price/day"
                                className="input-price"
                                required
                                disabled={hasBooking}
                            />
                            <div className="calendar-room form-group">
                                <label className="availability">
                                    Availability* &nbsp;
                                    <p className="note">
                                        <img src={InfoIcon} alt="Info Icon" />
                                        Date must be selected between tomorrow and any future date.
                                    </p>
                                </label>
                                <DateRangePicker 
                                    name="available_date"
                                    value={values['available_date']}
                                    aria-label="Date"
                                    required="required"
                                    placeholderText="DD/MM/YYYY - DD/MM/YYYY"
                                    minDate={tomorrow}
                                    onChange={(value) => setFieldValue('available_date', value)}
                                />
                                {touched['available_date'] &&
                                    errors['available_date'] && (
                                        <span className="error-message">
                                            {errors['available_date']}
                                        </span>
                                    )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Price Includes*</label>
                            <Field name="price_desc">
                                {({ field, form }) => {
                                    return (
                                        <React.Fragment>
                                            <textarea
                                                {...field}
                                                className="form-control message-textarea"
                                                placeholder="Enter details about add ons the customers can avail upon booking this home share"
                                                disabled={hasBooking}
                                            />
                                            {form.touched[field.name] &&
                                                form.errors[field.name] && (
                                                    <span className="error-message">
                                                        {form.errors[field.name]}
                                                    </span>
                                                )}
                                        </React.Fragment>
                                    );
                                }}
                            </Field>
                        </div>
                        <div className="section-video-image-upload">
                            <div className="section-video-image-upload-inner">
                                <div className="video-upload">
                                    <FileUpload 
                                        name="video_file"
                                        label="Browse to upload video" 
                                        src={videoIcon}
                                        value={
                                            [values.video_file?.[0]?.name]
                                        } 
                                        onChange={(files) => {
                                            setFieldValue("video_file", files);
                                        }}
                                    />
                                    <ErrorMessage
                                        name="video_file"
                                        component="span"
                                        className="error-message"
                                    />
                                     <div className="prev-video">
                                            {
                                                FormValues?.previous_video_file?.[0] &&
                                                <>
                                                    <strong>Previously selected Video:</strong>
                                                    <div>
                                                    <a
                                                        href={FormValues?.previous_video_file?.[0]?.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >video</a>
                                                    <span>
                                                        <img
                                                            src={CrossBtn}
                                                            alt="Cross button"
                                                            onClick={() => {
                                                                const removableAssetId = FormValues?.previous_video_file?.[0]?.id
                                                                handleRemoveAsset(removableAssetId, 'video');
                                                            }}
                                                        />
                                                    </span>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                </div>
                                <div className="image-upload">
                                    <FileUpload 
                                        name="image_file"
                                        label={<span>Browse to local files </span>} 
                                        src={fileIcon}
                                        multiple={savedEarlier}
                                        value={[values.image_file]}
                                        onChange={(files) => setFieldValue("image_file", files)}
                                    />
                                    <ErrorMessage
                                        name="image_file"
                                        component="span"
                                        className="error-message"
                                    />
                                </div>
                            </div>
                            {
                                FormValues?.previous_image_file?.length > 0 &&
                                <>
                                    <strong className="img-list">Previously selected Images:</strong> 
                                    {
                                        FormValues?.previous_image_file && <SortableImages
                                            images={FormValues?.previous_image_file}
                                            handleRemoveAsset={handleRemoveAsset}
                                            FormValues={FormValues}
                                            setFormValues={setFormValues}
                                        />
                                    }
                                </>
                            }
                            <p className="note"><img src={InfoIcon} alt="Info Icon" />Please try to upload only one video & one image during submitting details for 1st time. You can always add more by editing later on.</p>
                        </div>
                        <div className="section-checks-one">
                            { ['utility', 'amenities'].map ((stype, index) => (
                                <div className="section-care" key={index}>
                                    <h4>{serviceType[stype]?.['labelText']}</h4>
                                    <div className="checks-holder">
                                        {
                                            <RoomInfoCheckBoxes
                                                services={serviceType}
                                                keyName={stype}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                hasBooking={hasBooking}
                                            />
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="section-checks-two">
                            <h3>Safety Facilities</h3>
                            { 
                                ['bathroom/toilet', 'shower', 'lighting', 'fire'].map((stype, index) => (
                                    <div className="section-care" key={index}>
                                        <h4>{serviceType[stype]?.['labelText']}</h4>
                                        <div className="checks-holder">
                                        {
                                            <RoomInfoCheckBoxes
                                                services={serviceType}
                                                keyName={stype}
                                                values={values}
                                                setFieldValue={setFieldValue}
                                                hasBooking={hasBooking}
                                            />
                                        }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </form>)
                }}
            </Formik>
        </div>    
    
    )    
}
export default UpdateRoomInfo