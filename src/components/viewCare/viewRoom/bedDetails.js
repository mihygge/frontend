import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import Back from '../../shared/back';
import capitalize from 'capitalize';
import AvailabilityFilters from '../availabilityFilters';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage'
import { Link } from 'react-router-dom';

const BedDetails = ({ bedDetails, roomDetail, checkin, checkout, beds, careName, serviceId, roomName, getAvailableBeds }) => {

    const { price, tax, room_type, price_dec } = roomDetail;

    const [userDetail] = useLocalStorage('userDetails', {});
    const userRole = userDetail.role;

    const [touchedBed, setTouchedBed] = useState(null);
    const [selectedBed, setSelectedBed] = useState(null);

    const handleSelectBed = (e, bed_id, bedNumber, bedType, careType) => {
        setTouchedBed({
            ...touchedBed,
            [bedNumber]: {
                ...touchedBed?.[bedNumber],
                isSelected: e.target.checked,
                bed_id, bedNumber, bedType, careType
            }
        })
    }

    useEffect(() => {
        const filteredBed = touchedBed && Object.keys(touchedBed)?.filter(key => touchedBed[key].isSelected === true)?.map(key => touchedBed[key])
        setSelectedBed(filteredBed)
    }, [touchedBed])

    return (
        <div className="section-bed-details">
            {
                userRole!=='provider' &&
                <AvailabilityFilters
                    text="Update Search"
                    getAvailableBeds={getAvailableBeds}
                    checkin={checkin}
                    checkout={checkout}
                    beds={beds}
                />
            }
            { bedDetails.length>0 && <>
            <Table>
                <thead>
                    <tr>
                        <th>Bed Details</th>
                        {
                            userRole!=='provider' &&
                            <th>Select Beds</th>
                        }
                        <th>Price Details</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bedDetails.length>0 &&
                        bedDetails.map((bed, index) => (
                            <tr key={index}>
                                <td>
                                    {`Bed No. ${bed.bed_number} - ${capitalize(bed.bed_type)} Bed - ${capitalize.words(bed.care_type)}`}
                                </td>
                                {
                                    userRole!=='provider' &&
                                    <td>
                                        <div className="form-group-radio-checkbox">
                                            <input
                                                name="king_bed1"
                                                type="checkbox"
                                                className="form-control"
                                                onChange={(e) => {handleSelectBed(e, bed.id, bed.bed_number, bed.bed_type, bed.care_type)}}
                                            />
                                        </div>
                                    </td>
                                }
                                {
                                    index===0 &&
                                    <td rowSpan={bedDetails.length} className="cell-price-per-day">
                                        <div className="price-per-day">
                                            <label>Price for 1 day</label>
                                            <strong>$ {roomDetail.price} <span>+ ${roomDetail.tax} taxes & charges</span></strong>
                                        </div>
                                    </td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <div className="section-total-price">
                <div className="price-box">
                    Price Includes - {roomDetail.price_dec && capitalize(roomDetail.price_dec?.split('+').join(' '))}
                </div>
                {
                    userRole!=='provider' ?
                        selectedBed?.length>0 ?
                            <Link
                                className="btn-theme btn-proceed"
                                to={{
                                    pathname: `/checkout-customer`,
                                    state: {
                                        checkin, checkout, serviceId, careName, roomName, selectedBed, price_dec,
                                        roomType: room_type,
                                        pricePerBed: price,
                                        taxPerBed: tax,
                                    }
                                }}
                            >
                                Proceed to checkout 
                            </Link>
                            : <Link
                                className="btn-transparent-small btn-proceed"
                                style={{ pointerEvents: 'none' }} 
                            >
                                Proceed to checkout 
                            </Link>
                        : <Back />
                }
            </div>
            </> }
        </div>
    )
}

export default BedDetails;