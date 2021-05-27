import React from 'react';
import CardEmpower from './cardEmpower';
import seniorLiving from '../../../assets/images/senior-living.png';
import seniorCare from '../../../assets/images/senior-care.png';
import careGiving from '../../../assets/images/care-giving.png';
import ageAtHome from '../../../assets/images/age-at-home.png';
import lifeSimplePleasures from '../../../assets/images/life-simple-pleasures.png';
import { Row, Col} from 'reactstrap';
import './_empowerment.scss';

const Empowerment = () => {
    return(
        <div className="custom-container-mini"> 
            <section className="section-empowerment">
                <h2>Empowerment With miHygge</h2>
                <Row className="empower-list">
                    <Col xs="6" sm="4">
                        <CardEmpower src={seniorLiving} title="Senior Living" link="https://blog.mihygge.com/category/senior-living/" />
                    </Col>
                    <Col xs="6" sm="4">
                        <CardEmpower src={seniorCare} title="Senior Care" link="https://blog.mihygge.com/category/senior-care/" />
                    </Col>
                    <Col xs="6" sm="4">
                        <CardEmpower src={careGiving} title="Care Giving" link="https://blog.mihygge.com/category/care-giving/" />
                    </Col>
                    <Col xs="6" sm="4">
                        <CardEmpower src={ageAtHome} title="Age At Home" link="https://blog.mihygge.com/category/age-at-home/" />
                    </Col>
                    <Col xs="12" sm="8">
                        <CardEmpower src={lifeSimplePleasures} title="Life's Simple Pleasures (miHygge)" link="https://blog.mihygge.com/category/lifes-simple-pleasures/" />
                    </Col>
                </Row>
            </section>
        </div>
    )
}

export default Empowerment;
