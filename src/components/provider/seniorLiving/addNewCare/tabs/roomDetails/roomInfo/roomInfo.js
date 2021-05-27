import React, { forwardRef } from 'react';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import cogoToast from 'cogo-toast'
import InfoIcon from '../../../../../../../assets/images/icon-info.svg';
import FormInput from '../../../../../../shared/formInput';
import FormSelect from '../../../../../../shared/formSelect';
import FormCheck from '../../../../../../shared/formCheckOrRadio';
import FileUpload from '../../../../../../shared/fileUpload';
import videoIcon from '../../../../../../../assets/images/video-upload.svg';
import fileIcon from '../../../../../../../assets/images/image-upload.svg';
import RoomDetailsSchema from '../../../../../../../forms/validations/senior_living_provider/room_details.validations'
import { StringToKey } from '../../../../../../../utils/users'
import BedDetails from './bed_details'
import {AddRoomApi, AddLicense as AddAssets} from '../../../../../../../api/senior_living'
import { getTomorrowsDate } from '../../../../../utils/dates';

const tomorrow = getTomorrowsDate();

const RoomInfoCheckBox = ({services, keyName, values, setFieldValue}) => (
    <div className="checks-holder"> 
        {services?.[keyName]?.['services'].map((oj, index) => 
            <FormCheck key={index} type="checkbox" name={StringToKey(oj['name'])} id={StringToKey(oj['name'])} labelText={oj['name']} onChange={(e) => setFieldValue(StringToKey(oj['name']), !values?.[StringToKey(oj['name'])])} checked={values?.[StringToKey(oj['name'])]}/>                                 
        )}
    </div>
)


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
const RoomInfo = (props)=>{
    const { Formindex, toggle, bindSubmitForm, submit,
            RoomServiceType:{serviceType, serviceMapping}, 
            care_id, available_services, available_room_details,
            activeRoomTab, updateAvailableRoomDetails, completeForm } = props
    
    const disabled_submission =  props.available_room_details.total_bedrooms <= 0
    // useImperativeHandle(ref, () => ({
    //     getAlert() {
    //       console.log(_formikProps)
    //       return _formikProps
    //     }
    // }));
    
    const room_type_options = [
        {value: 'single', label: 'Single'},
        {value: 'double', label: 'Double'},
        {value: 'for-three', label: 'Triple'},
        {value: 'for-four', label: 'Four'}
    ]
    
    const bathroom_type_options = [
        {value: 'attached', label: 'Attached'},
        {value: 'common', label: 'Common'}
    ]
    
    const selected_room_services = (values) => {
        let selected_room_services_attributes = []
        Object.keys(values).forEach(key => {
            if(values[key] && serviceMapping[key]){
                let room_service_type_id = serviceMapping[key]["service_type_id"]
                let room_service_id = serviceMapping[key]["service_id"]
                selected_room_services_attributes.push({
                    room_service_type_id,
                    room_service_id
                })
            }
        })
        return selected_room_services_attributes
    }
    const initialValues = {
        ...props.initialValues,
        available_beds: props.available_room_details.total_bedrooms
    }
    return(
        <div className="form-in-new-care form-in-new-care-room-details form-in-new-care-with-checks">
            <h3 className="title-room">Room No. {props.room_no}</h3>
            <Formik 
                initialValues={initialValues} 
                enableReinitialize={true}
                validationSchema={RoomDetailsSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, actions) => {
                    if(submit){
                        cogoToast.warn('Form has been already submitted')
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
                    Object.keys(values).forEach(key => {
                        if(!serviceMapping[key] ){
                            request_body['room'][key] = values[key]
                        }
                    })
                    delete request_body.image_file
                    delete request_body.video_file
                    delete request_body.serviceType
                    delete request_body.serviceMapping
                    delete request_body.available_beds
                    
                    request_body["room"]["care_id"] = props.care_id
                    request_body["room"]["available_from"] = available_from
                    request_body["room"]["available_to"] = available_to
                    request_body["room"]["beds_attributes"] = {...request_body["room"]["beds_attributes"]}
                    
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
                                const remain_bed_rooms = available_room_details.total_bedrooms - values.beds_attributes.length
                                const remain_rooms = available_room_details.total_rooms - 1
                                updateAvailableRoomDetails({total_bedrooms: remain_bed_rooms, total_rooms: remain_rooms})
                                completeForm(Formindex - 1, values, room_id)
                                toggle(`${Formindex + 1}`)
                            })
                            .catch((reason) => {
                                hideLoading();
                                console.log(reason)
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
                    
                }}
                >
                {(formikProps) => {
                    const { handleSubmit, setFieldValue, values, errors, touched } = formikProps;
                    bindSubmitForm(formikProps.submitForm, Formindex - 1);
                    window._formikProps[Formindex - 1] = formikProps
                    return(
                    <form>
                        <div className="three-inputs-holder">
                            <FormInput name="name" type="text" labelText="Room Name/ID" placeholder="Enter room name here" required/>
                            <FormSelect name="room_type" labelText="Room Type" placeholder="Select room type" 
                                options={room_type_options} onChange={(data) => {
                                    setFieldValue('room_type', data.value)
                                } } 
                                value={room_type_options.find((o) => o.value === values['room_type'])} error={errors?.room_type} required="required" />
                            <FormSelect name="bathroom_type" labelText="Bathroom" placeholder="Select bathroom type" 
                                options={bathroom_type_options} onChange={(data) => {
                                    setFieldValue('bathroom_type', data.value)
                                } } 
                                value={bathroom_type_options.find((o) => o.value === values['bathroom_type'])} error={errors?.bathroom_type} required/>
                        </div>
                        <div className="section-bed-details">
                            {/* Note to FE :: Repeat this section on clicking of "Add more" */}
                            { /* <FieldArray name="beds_attributes" component={BedDetails} /> */}
                            <FieldArray name="beds_attributes" >
                                {(childProps)=> {
                                    return (
                                        <BedDetails {...childProps} available_services={available_services}/>
                                    )
                                }}
                            </FieldArray>
                        </div>
                        <div className="calendar-input-holder">
                            <FormInput type="text" labelText="Price per Bed / day ($)" name="price" placeholder="Enter price/day" className="input-price" required/>
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
                                    onChange={(value) => {
                                        setFieldValue('available_date', value)}
                                    }
                                />
                                {touched['available_date'] &&
                                    errors['available_date'] && (
                                        <span className="error-message">{errors['available_date']}</span>
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
                                </div>
                                <div className="image-upload">
                                    <FileUpload 
                                        name="image_file"
                                        label={<span>Browse to local files </span>} 
                                        src={fileIcon}
                                        value={
                                            [values.image_file]
                                        } 
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
                        </div>
                        <div className="section-checks-one">
                            { ['utility', 'amenities'].map ((stype, index) => (
                                
                                <div className="section-care" key={index}>
                                    <h4>{serviceType[stype]?.['labelText']}</h4>
                                    <div className="checks-holder">
                                        { < RoomInfoCheckBox services={serviceType} keyName={stype} values={values} setFieldValue={setFieldValue} /> }
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
                                            { < RoomInfoCheckBox services={serviceType} keyName={stype} values={values} setFieldValue={setFieldValue} /> }
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
export default RoomInfo