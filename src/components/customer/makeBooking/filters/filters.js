import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { Formik, Form } from 'formik';
import { Collapse} from 'reactstrap';
import Room from './tabs/room';
import Distance from './tabs/distance';
import PriceRange from './tabs/priceRange';
import License from './tabs/license';
import Amenities from './tabs/amenities';
import Services from './tabs/services';
import './_filters.scss';
import { searchFilterTabDetails } from '../../../../constants/customer/searchFilterTabDetails'
import { homePageFilterSearch } from '../../../../forms/validations/customer/homePageFilterSearch.validation';

const Filters = (props) => {

    const { formValues, getCareOrHomesList, filterValues, filterFormValues, setFilterFormValues } = props;
    const [activeTab, setActiveTab] = useState('1');

    const [isOpenSl, setIsOpenSl] = useState(false);
    const toggleCollapseSl = () => setIsOpenSl(!isOpenSl);

    const [isOpenHs, setIsOpenHs] = useState(false);
    const toggleCollapseHs = () => setIsOpenHs(!isOpenHs);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const handleApplyFilters = (setFieldValue) => {
        setFieldValue('applyFilter', true);
        setFieldValue('clearAll', false);
    }
    
    const handleClearAllFilters = (setValues) => {
        setValues({
            ...filterValues,
            clearAll: true,
            applyFilter: false
        });
    }

    const handleCheckboxChange = (e, param, values, setFieldValue) => {
        setFieldValue([param], {
            ...values?.[param],
            [e.target.id]: e.target.checked
        })
        setFilterFormValues({
            ...values,
            [param]: {
                ...values?.[param],
                [e.target.id]: e.target.checked
            }
        })
    }

    return (
        <div className="section-filters-make-booking">
            <div>
            <button className="btn-theme title-filters" onClick={toggleCollapseSl}>
                                            {
                                                isOpenSl ? "Filter by" : "Filter by"
                                            }
            </button>
            <Collapse isOpen={isOpenSl}>
            <div className="filter-tabs">
                <Formik
                    enableReinitialize
                    initialValues={filterFormValues}
                    validationSchema={homePageFilterSearch}
                    onSubmit={async(values, actions) => {
                        const { clearAll, applyFilter } = values;
                        if(clearAll){
                            getCareOrHomesList({...formValues}, 1, 'result_page');
                            setFilterFormValues(filterValues);
                        }
                        else if(applyFilter){
                            getCareOrHomesList({...formValues, ...values}, 1, 'result_page');
                        }
                    }}
                >
                {(formikProps) => {
                    
                    const { setFieldValue, values, setValues } = formikProps;

                    return(
                    <Form className="nav-custom-tabs">
                        <Nav>
                            {
                                !!searchFilterTabDetails?.length &&
                                searchFilterTabDetails.map((tab, index) => (
                                    <NavItem key={index}>
                                        <NavLink
                                            className={classnames({ active: activeTab === tab.tabId })}
                                            onClick={() => { toggle(tab.tabId); }}
                                        >
                                            {tab.tabHeading}
                                        </NavLink>
                                    </NavItem>
                                ))
                            }
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Room
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    filterFormValues={filterFormValues}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            </TabPane>
                            <TabPane tabId="2">
                                <PriceRange />
                            </TabPane>
                            <TabPane tabId="3">
                                <Distance
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                            </TabPane>
                            <TabPane tabId="4">
                                <License
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    filterFormValues={filterFormValues}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            </TabPane>
                            <TabPane tabId="5">
                                <Amenities
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    filterFormValues={filterFormValues}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            </TabPane>
                            <TabPane tabId="6">
                                <Services
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    filterFormValues={filterFormValues}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
                            </TabPane>
                        </TabContent>
                        <div className="buttons-container">
                            <button
                                className="btn-theme btn-no-box"
                                onClick={() => {handleApplyFilters(setFieldValue)}}
                            >
                                Apply Filters
                            </button>
                            <button
                                className="btn-theme btn-no-box"
                                onClick={() => {handleClearAllFilters(setValues)}}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </Form>
                    )
                }}
                </Formik>
                </div>
                </Collapse>
                </div>
        </div>
    )
}

export default Filters;