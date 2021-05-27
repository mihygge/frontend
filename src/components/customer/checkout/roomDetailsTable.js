import React from 'react';
import { Table } from 'reactstrap';
import capitalize from 'capitalize';
import { totalNoOfDates } from '../../accountDetailsCustomer/bookings/utils'

const RoomDetailsTable = ({ bookingDetails }) => {

    const { checkin, checkout, careName, roomName, roomType, selectedBed, pricePerBed, taxPerBed } = bookingDetails;

    const changeDateFormat = (ddmmyy) => {
        const ddmmyyArr = ddmmyy?.split('/');
        return `${ddmmyyArr[1]}/${ddmmyyArr[0]}/${ddmmyyArr[2]}`
    }
    
    const date_in = checkin && new Date(changeDateFormat(checkin));
    const date_out = checkout && new Date(changeDateFormat(checkout));
    const totalDays = totalNoOfDates(date_in, date_out)
    const noOfGuest = selectedBed?.length;

    return (
        <div className="table-suggested-plans table-room-details table-custom">
            <div className="table-responsive">
                <Table>
                    <thead>
                        <tr>
                            <th>Check-in</th>
                            <th>Check-OUT</th>
                            <th>Room & Guest Details</th>
                            <th>Price/Day</th>
                            <th>DAYS</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            <tr>
                                <td>{checkin && changeDateFormat(checkin)}</td>
                                <td>{checkin && changeDateFormat(checkout)}</td>
                                <td>
                                    <>
                                        <span>{`${careName}`}</span> <span>{`Room ID - ${roomName}`}</span>
                                        <span>{capitalize(roomType.split('-').join(' '))}</span>
                                        <span className="bed-count">{selectedBed?.length} {selectedBed?.length>1 ? 'beds' : 'bed'}</span>
                                        <br />
                                    </>
                                    {
                                        selectedBed?.length > 0 &&
                                        selectedBed.map((bed, index) => (
                                            <>
                                                <span>{`Bed ID - ${bed.bedNumber}`}</span>
                                                <span>{capitalize(bed.bedType)}</span>
                                                <span>{capitalize(bed.careType)}</span>
                                                <br />
                                            </>
                                        ))
                                    }
                                </td>
                                <td>{`$${pricePerBed.toFixed(2)}`}</td>
                                <td>{totalDays}</td>
                                <td>{`$${(pricePerBed * totalDays * noOfGuest).toFixed(2)}`}</td>
                            </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="heading" colspan="5">TAXES</td>
                            <td>{`$${(taxPerBed * totalDays * noOfGuest).toFixed(2)}`}</td>
                        </tr>  
                        <tr className="border-btm">
                            <td className="heading" colspan="5">Amount PayabLe</td>
                            <td>{`$${(pricePerBed * totalDays * noOfGuest + taxPerBed * totalDays * noOfGuest).toFixed(2)}`}</td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
};

export default RoomDetailsTable;