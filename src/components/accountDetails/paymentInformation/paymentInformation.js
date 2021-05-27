import React, {useState, useEffect} from 'react';
import { Table } from 'reactstrap';
import CreditCardPop from './creditCardPop';
import listCards from '../../../api/accounts/listCards';
import useLocalStorage from '../../../effects/LocalStorage/use-local-storage';
import addCard from '../../../api/accounts/addCard';
import cogoToast from 'cogo-toast';
import removeCard from '../../../api/accounts/removeCard';

const ProfileInfo = () => {
    const [modalCrad, setModalCard] = useState(false);
    const toggleCardPop = () => setModalCard(!modalCrad);
    const [cards, setCards] = useState([]);
    const [userDetail] = useLocalStorage('userDetails', {})

    const loadCards = () => {
        listCards()
            .then(res => {
                setCards(res.data)
            })  
            .catch(err => console.log(err))
    }

    const deleteCard = (id) => {
        const { hide: hideLoading } = cogoToast.loading("Deleting card. Please wait...", { hideAfter: 0 });
        removeCard(id)
            .then(() => {
                loadCards();
                hideLoading();
                cogoToast.success("Card deleted successfully")
            })
            .catch(() => cogoToast.error("Unable remove card. Please try later"))
    }

    useEffect(() => {
        loadCards()
    }, [])

    const paymentSubmit = (stripe) => {
        let userName = userDetail.first_name + '' + userDetail.last_name

        const { hide: hideLoading } = cogoToast.loading("Adding the card. Please wait...", { hideAfter: 0 });
        stripe.createToken({type: 'card', name: userName})
            .then((result) => {
                addCard(result.token.id)
                    .then(() => {
                        hideLoading();
                        cogoToast.success("Added cards successfully.")
                        loadCards();
                        setModalCard(!modalCrad);
                    })
                    .catch(() => {
                        hideLoading();
                        cogoToast.error("Unable to add card. Please try later")
                    })
                
            }).catch(() => {
                hideLoading();
                cogoToast.error("Please enter valid card details")
            });
    }

    return(
        <div className="section-payment-info">
            <div className="btn-new-card">
                <button className="btn-theme" onClick={toggleCardPop}>Add New Card</button>
            </div>
            <div className="table-custom table-payment-info table-responsive">
                {
                    cards.length === 0 ? 'No cards are available' :
                    <Table>
                        <thead>
                            <tr>
                                <th>Card Holder Name</th>
                                <th>Card Number</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { 
                                cards.map((card, _index) => (
                                    <tr>
                                        <td>{card.holder_name}</td>
                                        <td>xxxx xxxx {card.last4}</td>
                                        <td>
                                            <button className="btn-theme btn-no-box" onClick={() => deleteCard(card.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )) 
                            }
                            
                        </tbody>
                    </Table>
                }
            </div>
            <CreditCardPop isOpen={modalCrad} toggle={toggleCardPop} paymentSubmit={paymentSubmit}/>
        </div>
    )
}

export default ProfileInfo;