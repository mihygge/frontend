import React from 'react';
import ValueCard from './valueCard';
import IconMission from '../../../assets/images/mision-vision.png';
import IconTeam from '../../../assets/images/team-member.png';
import IconLeadership from '../../../assets/images/leadership.png';
import IconGrowth from '../../../assets/images/growth.png';
import './_values.scss';
import { Nav, NavItem, NavLink } from 'reactstrap';

const Values = (props) => {

    return (
        <div className="custom-container container-values">
            <Nav tabs className="section-values">
                <NavItem>
                    <NavLink>
                        <ValueCard src={IconTeam} title="Our Story" activeRef="storyRef" />
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink>
                        <ValueCard src={IconMission} title="Mission, Vision & Values" activeRef="visionAndValuesRef" />
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink>
                        <ValueCard src={IconLeadership} title="Our Leadership & Culture" activeRef="leadershipAndCultureRef" />
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink>
                        <ValueCard src={IconGrowth} title="Growth with Nature" activeRef="growthWithNatureRef" />
                    </NavLink>
                </NavItem>
            </Nav>
        </div>
    )
}

export default Values;