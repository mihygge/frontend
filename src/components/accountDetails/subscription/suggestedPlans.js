import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'reactstrap';
import IconInfo from '../../../assets/images/icon-info.svg';
import TermsAndConditions from '../termsAndConditionsPop';
import CancelSubscriptionPop from '../cancelSubPop';
import getSuggestedPlans from '../../../api/plans/suggestedPlans';
import cancelSub from '../../../api/subscription/cancel';
import showUser from '../../../api/users/showUser';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import cogoToast from 'cogo-toast'

const SuggestedPlans = props => {
    const [user] = useLocalStorage("userDetails", {});
    const [modalTerms, setModalTerms] = useState(false);
    const [modalCancelSub, setModalCancelSub] = useState(false);
    const [firstTimeUser, setFirstTimeUser] = useState(false);
    const [plans, setPlans] = useState([]);
    const [care, setCare] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [disablePurchaseButton, setDisablePurchaseButton] = useState(false);

    const toggleTerms = () => {
        showUser(user.id).then(res => {
            if (
                res.data["docusign_status"] === "" ||
                res.data["docusign_status"] === null
            ) {
                setModalTerms(!modalTerms);
            } else {
                if (res.data["docusign_status"].toLowerCase() === "pending") {
                    let loadingMsg = 'Verification is in-progress. We will notify you once verification has been done.';
                    cogoToast.loading(loadingMsg);
                }
                if (res.data["docusign_status"].toLowerCase() === "completed") {
                    setRedirect(true);
                }
            }
            
        });
    };
    const toggleCancelSub = () => setModalCancelSub(!modalCancelSub);

    if (redirect) {
        props.history.push("/checkout");
        props.history.go();
    }

    useEffect(() => {
        getSuggestedPlans().then(res => {
            setPlans(res.data.details);
            setFirstTimeUser(res.data.first_time);
        });
    }, []);

    const parsePlan = plan => {
        return `${plan.min} - ${plan.max} beds at $${plan.price / 100}`;
    };

    const totalPrice = () => {
        const pendingPlans = plans.filter(plan => plan.status === "pending");
        return pendingPlans.reduce(
            (amt, plan) => plan.applicable_plan.price + amt,
            0
        );
    };

    const discountPrice = () => {
        const price = totalPrice();
        return price - price * 0.1;
    };

    const cancelPlan = care_id => {
        setCare(care_id);
        setModalCancelSub(true);
    };

    const cancelSubscription = care_id => {
        cancelSub(care_id)
            .then(() => {
                getSuggestedPlans()
                    .then(res => {
                        setPlans(res.data.details);
                        setModalCancelSub(false);
                        cogoToast.info("Successfully cancelled");
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => {
                setModalCancelSub(false);
                console.log(err);
                cogoToast.error("Unable to cancel subscription");
            });
    };

    const capitalizeFirstLetter = (string) => {
        const words = string.split("-")
        const constantizedWords = words.map((word, _) => (
            word.charAt(0).toUpperCase() + word.slice(1)
        ))

        return constantizedWords.join("-")
    }

    return (
        <div className="table-suggested-plans table-custom">
            <div className="table-responsive">
                <Table>
                    <thead>
                        <tr>
                            <th>Care Name</th>
                            <th>No. of Beds</th>
                            <th>Active Plan/Year</th>
                            <th>Plan Validity</th>
                            <th>Suggested Plan /Year</th>
                            <th>Taxes</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan, _index) => (
                            <tr key={plan.care_id}>
                                <td>{plan.name}</td>
                                <td>{plan.bed}</td>
                                <td>
                                    {plan.status === "pending"
                                        ? "-"
                                        : parsePlan(plan.active_plan[0])}
                                </td>
                                <td>
                                    {plan.status === "pending"
                                        ? "-"
                                        : plan.plan_validity}
                                </td>
                                <td>
                                    {plan.status === "pending"
                                        ? parsePlan(plan.applicable_plan)
                                        : "-"}
                                </td>
                                <td>{plan.taxes}%</td>
                                <td>{capitalizeFirstLetter(plan.status)}</td>
                                <td>
                                    {plan.status === "active" ||
                                        plan.status === "in-progress" ? (
                                            <button
                                                className="btn-theme btn-no-box"
                                                onClick={() =>
                                                    cancelPlan(plan.care_id)
                                                }
                                            >
                                                Cancel
                                        </button>
                                        ) : (
                                            ""
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="section-info-and-purchase">
                <div>
                    {firstTimeUser ? (
                        <p className="info">
                            <img src={IconInfo} alt="Info Icon" /> Discount is
                            offered if you register all your facilities at first
                            go
                        </p>
                    ) : (
                            ""
                        )}
                    <button
                        className="btn-theme"
                        onClick={toggleTerms}
                        disabled={
                            disablePurchaseButton ||
                            plans.length === 0 ||
                            totalPrice() === 0 ||
                            discountPrice() === 0
                        }
                    >
                        Purchase Subscription at $
                        {firstTimeUser ? (
                            <strike>{(totalPrice() / 100).toFixed(2)}</strike>
                        ) : (
                                (totalPrice() / 100).toFixed(2)
                            )}
                        {firstTimeUser &&
                            `${(discountPrice() / 100).toFixed(2)}`}
                    </button>
                </div>
            </div>
            <TermsAndConditions isOpen={modalTerms} toggle={toggleTerms} />
            <CancelSubscriptionPop
                isOpen={modalCancelSub}
                toggle={toggleCancelSub}
                api={() => cancelSubscription(care)}
            />
        </div>
    );
};

export default withRouter(SuggestedPlans);
