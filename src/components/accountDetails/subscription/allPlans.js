import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import getAllPlans from '../../../api/plans/all'

const AllPlans = () => {
    const [plans, setPlans] = useState([])
    
    useEffect(() =>{
        getAllPlans()
            .then((res) => {
                setPlans(res.data.data)
            })
    }, [])

    return(
        <div className="table-all-plans table-custom">
            <h3 className="title-plans">All Plans Available</h3>
            <Table>
                <thead>
                    <tr>
                        <th>No. of Beds</th>
                        <th>Price/year</th>
                    </tr>
                </thead>
                <tbody> 
                    { 
                        plans.map((plan, _index) => (
                            <tr key={plan.id}>
                                <td>{plan.nickname}</td>
                                <td>$ {(plan.amount / 100).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default AllPlans;