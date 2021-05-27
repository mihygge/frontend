import React, { useEffect, useRef } from "react";
import { Row, Col } from "reactstrap";
import seniorliving from '../../assets/images/celebrateus-senior-living.svg';
import seniorcare from '../../assets/images/senior-care.svg';
import hipaa from '../../assets/images/HIPAA-compliant.svg';
import geriatichealthcare from '../../assets/images/geriatic-health-care.svg';
import secure from '../../assets/images/secure.svg';
import sustainable from '../../assets/images/sustainable.svg';
import visionNvalue from '../../assets/images/vision-value.svg';
import ourLeaderShip from '../../assets/images/our-leadership.svg';
import growWithNature from '../../assets/images/growth-with-nature.svg';
// import angelina from '../../assets/images/angelina.png';
// import deshane from '../../assets/images/deshane.png';
// import jenny from '../../assets/images/jenny.png';
// import kenny from '../../assets/images/kenny.png';
import mail from '../../assets/images/mail.svg';
import call from '../../assets/images/call.svg';
import Header from '../commons/header';
import Footer from '../commons/footer';
import HeaderWithUser from '../commons/headerWithUserLogin';
import useLocalStorage from '../../effects/LocalStorage/use-local-storage';

const CelebrateUS = (props) => {

	const storyRef = useRef(null);
	const visionAndValuesRef = useRef(null);
	const leadershipAndCultureRef = useRef(null);
	const growthWithNatureRef = useRef(null);
	const missionRef = useRef(null);
	// const teamRef = useRef(null);
	const reachUsRef = useRef(null);

	const [userDetail] = useLocalStorage('userDetails', {});
    const userRole = userDetail.role;


	useEffect(() => { 

		switch(props.location.state.activeRef){
			case "storyRef" : 
						storyRef.current.scrollIntoView()
						break;
			case "visionAndValuesRef" : 
						visionAndValuesRef.current.scrollIntoView()
						break;
			case "leadershipAndCultureRef" : 
						leadershipAndCultureRef.current.scrollIntoView()
						break;
			case "growthWithNatureRef" : 
						growthWithNatureRef.current.scrollIntoView()
						break;
			case "missionRef" : 
						missionRef.current.scrollIntoView()
						break;
			// case "teamRef" : 
			// 			teamRef.current.scrollIntoView()
			// 			break;
			case "reachUsRef" : 
						reachUsRef.current.scrollIntoView()
						break;
			default : break;
		}
		// scroll to top when component unmounts
		return ( ()=>{
			window.scrollTo(0, 0);
		 });
		}, [props.location.state.activeRef]);

	return (
		
		<div className="celebrateus-container wrapper-ask-for-demo"> 
		{
	        !!userRole ? <HeaderWithUser /> : <Header />
        }
			<div className="wrapper-banner-customer wrapper-banner-demo">
					<div className="custom-container">
						<div className="banner-customer banner-demo">
							{/* <h1 className="title-page">Ask For Demo</h1> */}
						</div>
					</div>
            </div>
			<div className="mission-container" ref={missionRef}>
				<h3 className="title">Our Mission</h3>
				<p>miHygge is helps seniors find homes, access care and build communities.
				The aging population is challenged to find good housing options- while many
				residences, senior communities and homes have available rooms. Our mission is to
				bring people and housing options together to improve the lives of seniors.
				Each listing is verified and affordably priced so no senior goes without a
				 good home.</p>				
			</div>
			
			<div className="celeb-page-container">
			<div className="our-story-container" ref={storyRef}>
				<h4 className="sub-title">Our Story</h4>
				<Row>
					<Col sm={6}>
					<p>miHygge was founded on the concept that senior living and senior care
						 is something worth celebrating! We want to help our beloved elderly
						  find a cozy space where they can live, retire, or get care all 
						  while saving time, resources, and the environment. We want to promote 
						  the mental health and well-being of our seniors through education, 
						  empowerment, and experience. The focus of our company is “cozy living”, 
						  which is why we are dedicated to finding our elderly an environment that
						   they feel comfortable in where they can continue to make beautiful 
						   memories.</p>
					</Col>
					<Col sm={6}>
					<p>We strive to provide quality opportunities for senior living and 
						senior care providers to grow and thrive. The goal is helping our 
						beloved elderly thrive through cozy living and life’s simple 
						pleasures. Our website connects seniors with wonderful, pre-vetted,
						 and secure choices in senior living and cares. Discover the place 
						 where you want to live, retire, or get care today with miHygge!</p>
					</Col>
				</Row>
			</div>

			<div className="img-div-container">
				<Row>
					<Col sm={2} className="img-container-mini">
						<div className="img-text">
							<img alt="" src={seniorliving} className="img-container"></img>
							<p>Senior Living</p>
						</div>
					</Col>
					<Col sm={2} className="img-container-mini">
						<div className="img-text">
							<img alt="" src={seniorcare} className="img-container"></img>
							<p>Senior Care</p>
						</div>
					</Col>
					<Col sm={2} className="img-container-mini">
						<div className="img-text">
							<img alt="" src={hipaa} className="img-container"></img>
							<p>HIPAA compliant</p>
						</div>
					</Col>
					<Col sm={2} className="img-container-mini">
						<div className="img-text">
							<img alt="" src={geriatichealthcare} className="img-container"></img>
							<p>Geriatric Health Care</p>
						</div>
					</Col>
					<Col sm={2} className="img-container-mini">
						<div className="img-text">
							<img alt="" src={secure} className="img-container"></img>
							<p>Secure</p>
						</div>
					</Col>
					<Col sm={2} className="img-container-mini">
						<div className="img-text">
							<img alt="" src={sustainable} className="img-container"></img>
							<p>Sustainable</p>
						</div>
					</Col>
				</Row>
			</div>

			<div className="visionNvalue-container" ref={visionAndValuesRef}>
				<h4 className="sub-title">Vision & Values</h4>
				<h5 className="child-heading red-font">Vision</h5>
				<p className="vision-value">Celebrate Aging, Senior Living & Care in every way through life’s 
					simple pleasures.</p>
				<Row className="align-items-center">
					<Col sm={6}>
						<p><img alt="" src={visionNvalue} className="vision-img"/></p>
						</Col>
						<Col sm={6}>
						<p className="vision-bullets-main-cotainer">
							<h5 className="child-heading red-font left-align">Values</h5>
							<ol className="vison-bullets">
								<li>We believe in empowering everyone, our providers & consumers</li>
								<li>We appreciate every question, nothing is unimportant, as we are always growing with you</li>
								<li>We thrive on challenging the status quo to make dreams come true for families & elderly</li>
								<li>We are committed to Celebrating Aging as one of Life’s Simple Pleasures or miHygge</li>
								<li>We Love diversity, creativity in everything & the beauty of growing old together on Mother Earth</li>
								<li>We want to make every search experience, a wonderful journey of learning & appreciation.</li>
							</ol>
						</p>
					</Col>
				</Row>
			</div>
			
			<div className="ourLeaderShip-container" ref={leadershipAndCultureRef}>
				<Row className="align-items-center">
					<Col sm={6}>
						<h4  className="sub-title">Our Leadership & Culture</h4>
						<p>Dr. Purnima Sreenivasan started her journey in Medicine & Healthcare
						in 1989. A serial Geriatric Specialist physician entrepreneur 
						founder, miHygge is a company of dedicated professionals with a 						
						mission, vision and values. We are here to serve you, please come, 
						join the journey of empowering our amazing aging population with 
						life’s simple pleasures. Thank you</p>
					</Col>
					<Col sm={6}>
						<img alt="" src={ourLeaderShip} className="img-container"/>
					</Col>
				</Row>
			</div>

			<div className="growth-nature-container" ref={growthWithNatureRef}>
				<Row className="align-items-center">
					<Col sm={6}>
						<img alt="" src={growWithNature} className="img-container"/>
					</Col>
					<Col sm={6}>
						<h4 className="sub-title">Growth With Nature</h4>
						<p>miHygge has taken the 1% pledge. We have chosen five unique 
						non profit charities to donate to, benefiting our Mother Earth.</p>
					</Col>
				</Row>
			</div>
		</div>
		{/* <div className="ourTeam-container" ref={teamRef}>
				<h4 className="title">Our Team</h4>
				<Row>
					<Col sm={3}>
						<div>
							<img alt="Angelina" src={angelina} className="image-dimension"/>
							<div className="info-container">
								<h6><b>Angelina Healy</b></h6>
								<p>Marketing Strategy Consultant</p>
								<p> - Spirit Emoji: 💃🏼</p>
								<p> - Fun! Hiking, Biking, and Brunching</p>
							</div>
						</div>
					</Col>
					<Col sm={3}>
						<div>
							<img alt="Deshane" src={deshane} className="image-dimension"/>
							<div className="info-container">
								<h6><b>Deshane James</b></h6>
								<p>Marketing Strategy Consultant</p>
								<p> - Spirit Emoji: 💃🏼</p>
								<p> - Fun! Hiking, Biking, and Brunching</p>
							</div>
						</div>
					</Col>
					<Col sm={3}>
						<div>
							<img alt="Jenny" src={jenny} className="image-dimension"/>
							<div className="info-container">
								<h6><b>Jenny Wilson</b></h6>
								<p>Marketing Strategy Consultant</p>
								<p> - Spirit Emoji: 💃🏼</p>
								<p> - Fun! Hiking, Biking, and Brunching</p>
							</div>
						</div>
					</Col>
					<Col sm={3}>
						<div>
							<img alt="Kenny" src={kenny} className="image-dimension"/>
							<div className="info-container">
								<h6><b>Kenny Lane</b></h6>
								<p>Marketing Strategy Consultant</p>
								<p> - Spirit Emoji: 💃🏼</p>
								<p> - Fun! Hiking, Biking, and Brunching</p>
							</div>
						</div>
					</Col>
				</Row>
			</div> */}
			<div className="contact-info-container" ref={reachUsRef}>
				<h4 className="title">Contact Info</h4>
				<Row className="mobile-cont-container">
					<Col sm={6} className="right-align">
						<img src={mail} className="img-dimension" alt=""/>contact@mihygge.com							
					</Col>
					<Col sm={6}>
						<img src={call} className="img-dimension" alt=""/>Call (925) 639-5891												
					</Col>
				</Row>
			</div>
		
		<Footer />
	</div>
		
	);
};

export default CelebrateUS;