import React from 'react';
import FormCheck from '../../../../shared/formCheckOrRadio';
import { searchFilterRoomType, searchFilterBedType} from '../../../../../constants/customer/searchFiltersValues'

const Room = (props) => {

    const { values, setFieldValue, filterFormValues, handleCheckboxChange } = props;

    return (
        <div className="section-checks">
            <div className="section-checks-room section-checks-common">
                <div className="checks-room">
                    <span>Room Type:</span>
                    {
                        !!searchFilterRoomType?.length &&
                        searchFilterRoomType.map((filter, index) => (
                            <FormCheck
                                key={index}
                                type="checkbox"
                                name={filter.id}
                                id={filter.id}
                                labelText={filter.label}
                                checked={filterFormValues?.room_type?.[filter.id]}
                                onChange={(e) => {handleCheckboxChange(e, 'room_type', values, setFieldValue)}}
                            />
                        ))
                    }
                </div>
                <div className="checks-room">
                    <span>Bed Type:</span>
                    {
                        !!searchFilterBedType?.length &&
                        searchFilterBedType.map((filter, index) => (
                            <FormCheck
                                key={index}
                                type="checkbox"
                                name={filter.id}
                                id={filter.id}
                                labelText={filter.label}
                                checked={filterFormValues?.bed_type?.[filter.id]}
                                onChange={(e) => {handleCheckboxChange(e, 'bed_type', values, setFieldValue)}}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Room;

