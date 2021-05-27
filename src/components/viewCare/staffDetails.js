import React, { useState, useEffect } from 'react';
import StaffDetailsPop from './staffDetailsPop';
import capitalize from 'capitalize';

const StaffDetails = (props) => {

    const { boardMembers, staffDetails } = props;

    const [staffModal, setStaffModal] = useState(false);
    const [owner, setOwner] = useState({});
    const toggleStaffModal = () => setStaffModal(!staffModal);

    useEffect(() => {
        getOwnerAndStaffs();
    }, [])
    
    const getOwnerAndStaffs = () => {
        let ownerIndex;
        staffDetails && staffDetails.length > 0 &&
        staffDetails.forEach((staff, index) => {
            if(staff.staff_role === "Owner"){
                setOwner(staff)
                ownerIndex = index;
            }
        })
        staffDetails.splice(ownerIndex, 1);
        staffDetails.sort((previousStaff, nextStaff) => 
            previousStaff.staff_role < nextStaff.staff_role ? -1 : 1
        )
    }
    
    return (
        <div className="section-facilities-list">
            <h2>Staff Details</h2>
            <div className="list-staff">
                <ul className="list-unstyled m-0 p-0">
                    {
                        boardMembers &&
                        <li>
                            <strong>{boardMembers ? `${boardMembers.staff_role}: ` : 'Board Members: '}</strong>
                            <span>{boardMembers.name && capitalize(boardMembers.name)}</span>
                        </li>
                    }
                    {
                        owner.staff_role==="Owner" &&
                        <li>
                            <strong>{owner.staff_role}: </strong>
                            <span>{owner.name && capitalize(owner.name)}</span>
                        </li>
                    }
                    {
                        staffDetails && staffDetails.length > 0 &&
                        <button className="btn-theme" onClick={toggleStaffModal}>See More Details</button>
                    }
                </ul>
            </div>
            <StaffDetailsPop toggle={toggleStaffModal} isOpen={staffModal} staffDetails={staffDetails} />
        </div>
    )
}

export default StaffDetails;