import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { withRouter } from 'react-router-dom';
import cogoToast from 'cogo-toast'
import axios from 'axios'
import FormInput from '../../../../shared/formInput';
import RadioButtons from '../../../../shared/radioButton';
import FileUpload from '../../../../shared/fileUpload';
import videoIcon from '../../../../../assets/images/video-upload.svg';
import fileIcon from '../../../../../assets/images/image-upload.svg';
import CareDetailSchema from '../../../../../forms/validations/senior_living_provider/care_details.validation'
import {UpdateCareDetails, AddLicense} from '../../../../../api/senior_living'
import { getServiceDetailsApi } from '../../../../../api/updateServiceFunctionality/getServiceDetails';
import SortableImages from '../../../../shared/sortbleImages/sortbleImages';
import CrossBtn from '../../../../../assets/images/close.svg';
import { deleteAssetApi } from '../../../../../api/updateServiceFunctionality/updateServiceDetails';
import InfoIcon from "../../../../../assets/images/icon-info.svg";

let isUpdate = false;
let initialValues = {
    "image_file": [],
    "video_file": [],
    "description": "",
    "area_description": "",
    "no_of_rooms" : "",
    "no_of_beds": "",
    "no_of_bathrooms": "",
    "no_of_restrooms": "",
    "previous_video_file": [],
    "previous_image_file": [],
    "imageOrder": [],
}
const initialValue = initialValues;
let careStatus = '';
let fieldDisabledInState = ['active', 'in-progress'];

const CareDetails = (props) => {
    isUpdate = props.isUpdate;
    const [ FormValues, setFormValues ] = useState(initialValues)
    const { setAvailableCareDetails } = props;
    
    useEffect(() => {
        if(isUpdate){
            fetchCareDetails();
        }
        else{
            setFormValues(initialValue);
        }
    }, [])

    const fetchCareDetails = async() => {
        try{
            const response = await getServiceDetailsApi(props.match?.params?.careId, 'care_details');
            const { status, care_details, selected_rooms, files } = response.data;
            careStatus = status;
            const { description, area_description, no_of_rooms, no_of_beds, no_of_bathrooms, no_of_restrooms } = care_details;
            setAvailableCareDetails({total_bedrooms: no_of_beds, total_rooms: no_of_rooms})
            let previouslySelectedRoomTypes = {};
            for(let i=0;i<selected_rooms.length;i+=1){
                const key = selected_rooms[i].room_type.toLowerCase()?.split(' ')?.join('_')
                previouslySelectedRoomTypes[key] = selected_rooms[i]?.id +""
            }
            let videoIndex;
            let video_file = [];
            let image_file = [];
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
            
            initialValues = {
                ...initialValues,
                previous_video_file: video_file,
                previous_image_file: image_file,
                description, area_description, no_of_rooms, no_of_beds, no_of_bathrooms, no_of_restrooms,
                previouslySelectedRoomTypes,
                currentSelectedRoomTypes: previouslySelectedRoomTypes,
            }
            setFormValues(initialValues);
        }
        catch(error){
            console.log(error);
        }
    }
    
    return (
        <CareDetails1 {...props} fieldDisabledInState={fieldDisabledInState} careStatus={careStatus} FormValues={FormValues} setFormValues={setFormValues} />
    )
}

const DynamicRadioButtonBuilder = (props) => {
    const { room_type, values, setFieldValue, errors } = props
    const name = room_type.name.toLowerCase().split(' ').join('_')
    const error_message = errors?.[name]
    const labelText = room_type.name
    const checked = isUpdate ? 
                    (values?.currentSelectedRoomTypes?.hasOwnProperty(name) || values[name] === room_type.id)
                    : values[name] === room_type.id
    const onClickVal = (e) => {setFieldValue(name, room_type.id)}
    const onClickValForNonAvailable = (e) => {
        setFieldValue(name, null);
        delete values.currentSelectedRoomTypes[name];}

    return (
        <RadioButtons key={room_type.id} name={name} labelText={labelText} checked={checked} onClickVal={onClickVal} onClickValForNonAvailable={onClickValForNonAvailable} value={room_type.id} error_message={error_message} />
    )
}

const CareDetails1 = (props) => {
    const { bindSubmitForm, room_types, care_id, setactiveTab, FormValues, setFormValues, setAvailableCareDetails,
        fieldDisabledInState, careStatus, 
    } = props 

    const handleDescChange = (e, fieldName, setFieldValue) => {
       setFieldValue(fieldName, e.target.value);
    }

    useEffect(() => {
        if(props.activeMainTab === '3' ){
            props.setSaveNextButton(true)
        }
    }, [props.activeMainTab])

    let formatted_room_types = [];
 
    let room_attributes_values = {}

    for(let i=0;i<room_types.length;i+=2){
        formatted_room_types.push(room_types.slice(i,i+2))
    }
    for(let i=0;i<room_types.length;i+=1){
        room_attributes_values[room_types[i].name.toLowerCase()?.split(' ')?.join('_')] = room_types[i].id +""
    }
    initialValues = {
        ...initialValues,
        room_attributes_values,
    }
    useEffect(() => {
        setFormValues(initialValues);
    }, [])

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

        deleteAssetApi(assetId).then(() => {
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
    return (
        <div className="form-in-new-care form-in-new-care-details">
            <Formik
                enableReinitialize
                initialValues={
                    props.FormValues
                }
                
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={CareDetailSchema}
                onSubmit={(values, actions) => {

                    if(isUpdate){
                        values.previouslySelectedRoomTypes && Object.keys(values.previouslySelectedRoomTypes).forEach((roomType)=>{
                            values.previouslySelectedRoomTypes[roomType] = values.room_attributes_values[roomType]
                        })
    
                        values = {
                            ...values,
                            ...values.previouslySelectedRoomTypes
                        }
                    }

                    let selected_rooms_attributes = [], care_detail_attributes = {}
                    Object.keys(values).forEach(key => {
                        if(isUpdate && room_attributes_values[key] && values[key]){ // execute for update care details
                            selected_rooms_attributes.push({room_type_id: values[key]})
                        }else if(!isUpdate && room_attributes_values[key]){ // execute for add care details
                            selected_rooms_attributes.push({room_type_id: values[key]})
                        }else if(!['image_file', 'video_file'].includes(key)){
                            care_detail_attributes[key] = values[key]
                        }
                    })
                    
                    let formData = new FormData();
                    let updateAssets = false;

                    if(values?.video_file?.length || values?.image_file?.length){
                        updateAssets = true;
                        formData.append('assetable_type', 'care')
                        formData.append('assetable_id', care_id)
                        if(!isUpdate){ // execute for add care details - 1 video (non - mandatory) and 1 image
                            if(values['video_file'].length){
                                formData.append('assets[]', values['video_file'][0])
                            } 
                            formData.append('assets[]', values['image_file'][0])
                        }else{ // execute for update care - total 1 video and 10 images
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
                    }

                    let req_body = {
                        care: {
                            care_detail_attributes: care_detail_attributes,
                            selected_rooms_attributes: selected_rooms_attributes
                        },
                        type: "care_details"
                    }
                    
                    const care_api = UpdateCareDetails(care_id, req_body)
                    const assets_api = updateAssets ? AddLicense(formData) : null;
                    
                    const loadingMsg = !isUpdate ? 'Adding Care Details...' : 'Updating Care Details...';
                    const successMsg = !isUpdate ? 'Care Details added successfully.' : 'Care Details updated successfully.';

                    const { hide: hideLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
                    axios.all([care_api, assets_api])
                    .then(axios.spread(function (care_response, assets_response) {
                                // Both requests are now complete
                                hideLoading();
                                cogoToast.success(successMsg)
                                
                                // ordering images only in case of update
                                if(isUpdate && values?.previous_image_file?.length && values?.imageOrder?.length){
                                    const loadingMsg = 'Saving Image order...';
                                    const successMsg = 'Image order updated successfully';
                                    const { hide: hideImageOrderingLoading } = cogoToast.loading(loadingMsg, { hideAfter: 0 })
                                    let imageOrderingFormData = new FormData();
                                    imageOrderingFormData.append('assetable_type', 'care')
                                    imageOrderingFormData.append('assetable_id', care_id)
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

                                setactiveTab("4")
                                setAvailableCareDetails({total_bedrooms: parseInt(values.no_of_beds), total_rooms: parseInt(values.no_of_rooms)})
                    }))
                    .catch((err) => {
                        hideLoading();
                        if(err?.response?.status === 422){
                            if(err?.response?.data?.[0] === 'Remove room in room details tab before changing room count'){
                                cogoToast.error('Your updated rooms count is less than current added room. Please remove room in room details tab before changing here.', { hideAfter: 15 })
                            }
                            else if(err?.response?.data?.[0] === 'Remove bed in room details tab before modifying total no of beds'){
                                cogoToast.error('Your updated beds count is less than current added beds. Please remove bed in room details tab before changing here.', { hideAfter: 15 })
                            }
                            else{
                                cogoToast.error('Unable to save form data')
                            }
                        }
                        else{
                            cogoToast.error('Error on server.')
                        }
                        console.log(err)
                    })

                }}
            >
                {(formikProps) => {
                    const { handleSubmit, setFieldValue, values, errors } = formikProps;;
                    bindSubmitForm(formikProps.submitForm, 2);
                    return(
                    <form noValidate onSubmit={handleSubmit}>
                        <div className="section-top">
                            <div className="section-video-image-upload">
                                <label>
                                    {`Upload a video and ${!isUpdate ? 'an image' : 'images'} of your Facility/Care in the below section`}
                                </label>
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
                                                isUpdate && props?.FormValues?.previous_video_file?.[0] &&
                                                <>
                                                    <strong>Previously selected Video:</strong>
                                                    <div>
                                                        <a
                                                            href={props?.FormValues?.previous_video_file?.[0]?.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >video</a>
                                                        <span>
                                                            <img
                                                                src={CrossBtn}
                                                                alt="Cross button"
                                                                onClick={() => {
                                                                    const removableAssetId = props?.FormValues?.previous_video_file?.[0]?.id
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
                                            value={
                                                [values.image_file]
                                            }
                                            multiple={isUpdate}
                                            onChange={(files) => {
                                                setFieldValue("image_file", files);
                                            }}
                                        />
                                        <ErrorMessage
                                            name="image_file"
                                            component="span"
                                            className="error-message"
                                        />
                                    </div>
                            </div>
                            {
                                isUpdate && props?.FormValues?.previous_image_file?.length > 0 &&
                                <>
                                    <strong className="img-list">Previously selected Images:</strong> 
                                    {
                                        props?.FormValues?.previous_image_file && <SortableImages
                                            images={props?.FormValues?.previous_image_file}
                                            handleRemoveAsset={handleRemoveAsset}
                                            FormValues={FormValues}
                                            setFormValues={setFormValues}
                                        />
                                    }
                                </>
                            }
                            <p className="note"><img src={InfoIcon} alt="Info Icon" />Please try to upload only one video & one image during submitting details for 1st time. You can always add more by editing later on.</p>
                        </div>
                        <div className="form-group">
                            <label>General Care Description </label>
                            <Field name="description">
                                {({ field, form }) => {
                                    return (
                                        <React.Fragment>
                                            <textarea
                                                {...field}
                                                className="form-control message-textarea"
                                                placeholder="Provide details on how your property differs from others what it offers..."
                                                onChange={(e) => {handleDescChange(e, 'description', setFieldValue)}}
                                            />
                                            {form.touched[field.name] &&
                                                form.errors[field.name] && (
                                                    <span className="error-message">{form.errors[field.name]}</span>
                                                )}
                                        </React.Fragment>
                                    );
                                }}
                            </Field>
                        </div>
                        <div className="form-group">
                            <label>Location/Area Description </label>
                            <Field name="area_description">
                                {({ field, form }) => {
                                    return (
                                        <React.Fragment>
                                            <textarea
                                                {...field}
                                                className="form-control message-textarea"
                                                placeholder="Tell us about any interesting sights to visit near your property including landmarks..."
                                                onChange={(e) => {handleDescChange(e, 'area_description', setFieldValue)}}
                                            />
                                            {form.touched[field.name] &&
                                                form.errors[field.name] && (
                                                    <span className="error-message">{form.errors[field.name]}</span>
                                                )}
                                        </React.Fragment>
                                    );
                                }}
                            </Field>
                        </div>
                    </div> 
                    <div className="section-bottom">
                        <div className="four-inputs-holder">
                            <FormInput type="text" labelText="Total Rooms" name="no_of_rooms" placeholder="Enter no. of total rooms" disabled={fieldDisabledInState.includes(careStatus)} required />
                            <FormInput type="text" labelText="Total No. of Beds" name="no_of_beds" placeholder="Enter no. of bedrooms" disabled={fieldDisabledInState.includes(careStatus)} required />
                            <FormInput type="text" labelText="Number of bathrooms" name="no_of_bathrooms" placeholder="Enter no. of bathrooms" required />
                            <FormInput type="text" labelText="Number of restrooms" name="no_of_restrooms" placeholder="Enter no. of restrooms" required />
                        </div>
                        <div className="section-radio-buttons">
                            {
                                formatted_room_types.map((r, index) => {
                                    return(
                                        <div key={index} className="two-inputs-holder">
                                            {r[0] && <DynamicRadioButtonBuilder room_type={r[0]} values={values} setFieldValue={setFieldValue} errors={errors}/> }
                                            {r[1] && <DynamicRadioButtonBuilder room_type={r[1]} values={values} setFieldValue={setFieldValue} errors={errors}/> }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </form>)
                }}
            </Formik>
        </div>
    )
}

export default withRouter(CareDetails)