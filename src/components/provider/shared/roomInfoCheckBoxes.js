import React from 'react';
import FormCheck from '../../shared/formCheckOrRadio';
import { StringToKey } from '../../../utils/users';

const RoomInfoCheckBoxes = ({ services, keyName, values, setFieldValue, hasBooking }) => {
    const isPreviouslySelected = (id) => {
        return (
            values.previous_selected_room_services.filter((srs) => srs.service.id === id).length ===
            1
        );
    };

    const servicesMap = services?.[keyName]?.services.map((oj) => {
        const key = StringToKey(oj.name);
        return { id: oj.id, name: oj.name, key, value: values?.selectedRoomServicesObj?.[key] };
    });

    return (
        <div className="checks-holder">
            {servicesMap?.map(({ id, key, name, value }, index) => {
                return (
                    <FormCheck
                        id={key}
                        name={key}
                        key={index}
                        type="checkbox"
                        checked={value}
                        labelText={name}
                        onChange={({ target: { checked } }) =>
                            setFieldValue('selectedRoomServicesObj', {
                                ...values?.selectedRoomServicesObj,
                                [key]: checked,
                            })
                        }
                        disabled={hasBooking && value && isPreviouslySelected(id)}
                    />
                );
            })}
        </div>
    );
};

export default RoomInfoCheckBoxes;
