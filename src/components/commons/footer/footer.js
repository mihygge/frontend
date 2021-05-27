import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Copyrights from '../copyrights';
import QuestionMark from '../../../assets/images/question.svg';
import './_footer.scss';
import Consumer_refund from '../../../assets/documents/consumer_refund.pdf';
import Terms_Of_Serivce from '../../../assets/documents/terms_of_service.pdf';
import ContentPolicy from '../../../assets/documents/contentPolicy.pdf';
import Copyright from '../../../assets/documents/copyright.pdf';
import PrivacyPolicy from '../../../assets/documents/privacyPolicy.pdf';
import Nondiscrimination from '../../../assets/documents/nondiscrimination.pdf';
import AboutUs from '../../../assets/documents/about_us.pdf';
import Faq from '../../../assets/documents/faq.pdf';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import { Collapse } from 'reactstrap';
import iconYoutube from '../../../assets/images/Youtube.svg';
import iconFacebook from '../../../assets/images/Facebook.png';
import iconTwitter from '../../../assets/images/Twitter.png';
import iconInstagram from '../../../assets/images/Instagram.png';
import iconPinterest from '../../../assets/images/Pinterest.png';
import iconLinkedin from '../../../assets/images/Linkedin.png';
import iconQuora from '../../../assets/images/Quora.png';
import iconMediumm from '../../../assets/images/Medium.png';

const Footer = () => {

    const [userDetails] = useLocalStorage('userDetails', {})
    const userRole = userDetails.role;

    const [isOpenSl, setIsOpenSl] = useState(false);
    const toggleCollapseSl = () => setIsOpenSl(!isOpenSl);

    const [isOpenHs, setIsOpenHs] = useState(false);
    const toggleCollapseHs = () => setIsOpenHs(!isOpenHs);
    
    return(
        <>
            {userRole === 'provider' ? '' :
                <div className="wrapper-footer">
                    <div className="custom-container">
                        <section className="items-footer">
                            <div className="card-items senior-living">
                                <h4>Senior Living</h4>
                                <ul className="list-unstyled p-0 m-0">
                                    <li>Assisted Living</li>
                                    <li>Independent Senior Living</li>
                                    <li>Care Homes</li>
                                    <li>Memory Care</li>
                                    <li>Continuing Care Retirement Communities</li>
                                    <li>Nursing Homes/Skilled Nursing Facilities</li>
                                    <li>Long term Care</li>
                                    <div>
                                        <Collapse isOpen={isOpenSl}>
                                            <li>Senior Apartments</li>
                                            <li>Co-operative Housing</li>
                                            <li>Retirement Villages</li>
                                            <li>Hospice/Palliative Care</li>
                                            <li>Respite Care</li>
                                            <li>Multi-unit housing</li>
                                            <li>Vacation Care</li>
                                            <li>Medical Tourism</li>
                                            <li>Adult day Care</li>
                                        </Collapse>
                                        <button className="btn-theme btn-transparent btn-no-box btn-show-more" onClick={toggleCollapseSl}>
                                            {
                                                isOpenSl ? "Show Less" : "Show More"
                                            }
                                        </button>
                                    </div>
                                </ul>
                            </div>
                            <div className="card-items home-share">
                                <h4>Home Share</h4>
                                <ul className="list-unstyled p-0 m-0">
                                    <li>Independent Home</li>
                                    <li>Apartment</li>
                                    <li>Share with Seniors</li>
                                    <div>
                                        <Collapse isOpen={isOpenHs}>
                                            <li>Pets allowed</li>
                                            <li>Lift accesss</li>
                                            <li>Direct access to Street/Ground floor</li>
                                            <li>Non-Smoking</li>
                                            <li>Private Entrance</li>
                                            <li>Medical Services Nearby</li>
                                            <li>Public Transport Nearby</li>
                                            <li>Places of Worship Nearby</li>
                                            <li>Parking</li>
                                            <li>Independent</li>
                                            <li>Assisted</li>
                                            <li>Bed Bound</li>
                                            <li>Multi-unit Housing</li>
                                        </Collapse>
                                        <button className="btn-theme btn-transparent btn-no-box btn-show-more" onClick={toggleCollapseHs}>
                                            {
                                                isOpenHs ? "Show Less" : "Show More"
                                            }
                                        </button>
                                    </div>
                                </ul>
                            </div>
                            <div className="card-items social-media-items">
                                <h4>Follow Us On</h4>
                                <ul className="list-unstyled p-0 m-0">
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/channel/UCtsPCUIr3Q7QmLRgnXSYktg/"><img src={iconYoutube} alt="YouTube" /> <span>YouTube</span></a></li>
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/mihyggeseniors/"><img src={iconFacebook} alt="Facebook" /> <span>Facebook</span></a></li>
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://twitter.com/mihygge18"><img src={iconTwitter} alt="Twitter" /> <span>Twitter</span></a></li>
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/mihyggeseniors/"><img src={iconInstagram} alt="Instagram" /> <span>Instagram</span></a></li>
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://www.pinterest.com/mihyggesm/"><img src={iconPinterest} alt="Pinterest" /> <span>Pinterest</span></a></li>
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://www.linkedin.com/company/mihygge/?viewAsMember=true"><img src={iconLinkedin} alt="LinkedIn" /> <span>LinkedIn</span></a></li>
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://www.quora.com/q/rapiwoozawixnhgf"><img src={iconQuora} alt="Quora" /> <span>Quora</span></a></li>
                                    <li><a rel="noopener noreferrer" target="_blank" href="https://medium.com/@mihyggesm"><img src={iconMediumm} alt="Medium" /> <span>Medium</span></a></li>
                                </ul>
                            </div>
                            <div className="card-items">
                                <h4>Company Policies</h4>
                                <ul className="list-unstyled p-0 m-0">
                                    <li><a href={Consumer_refund} target="_blank" rel="noopener noreferrer">Consumer Refund</a></li>
                                    <li><a href={ContentPolicy} target="_blank" rel="noopener noreferrer">Content</a></li>
                                    <li><a href={Copyright} target="_blank" rel="noopener noreferrer">Copyright</a></li>
                                    <li><a href={Nondiscrimination} target="_blank" rel="noopener noreferrer">Nondiscrimination</a></li>
                                    <li><a href={PrivacyPolicy} target="_blank" rel="noopener noreferrer">Privacy</a></li>
                                    <li><a href={Terms_Of_Serivce} target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
                                    <li><a href={AboutUs} target="_blank" rel="noopener noreferrer">About Us</a></li>
                                    <li><a href={Faq} target="_blank" rel="noopener noreferrer">FAQ</a></li> 
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            }
            <Copyrights />
        </>
    )
}

export default Footer;