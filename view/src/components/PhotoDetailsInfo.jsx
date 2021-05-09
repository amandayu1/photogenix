import React, { Component } from 'react';
import { getPhotoDocument } from "../firebase";
import "./PhotoDetails.css";
import { getPromoCodes } from '../firebase';

let eventObject;

class PhotoDetailsInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photoInfo: { price: {} },
            descLength: 0,
            instrLength: 0,
            descSeeMore: false,
            instrSeeMore: false,
            promoCodes: [],
        }
    }
    componentDidMount = async () => {
        this.unsubscribe = getPhotoDocument(this.props.userID, this.props.purchaseID, (photoInfo) => {

            this.setState({
                photoInfo: photoInfo,
                descLength: photoInfo.caption.length,
            })

            eventObject = {
                title: photoInfo.title + " by " + photoInfo.ownerName,
                caption: "",
            }
            if (photoInfo.caption !== "") {
                eventObject.caption = "Caption:\n" + photoInfo.caption;
            }
        });
        const promoCodes = await getPromoCodes(this.props.userID, this.props.purchaseID);
        if (promoCodes) {
            this.setState({
                promoCodes: promoCodes
            })

        }
    }

    componentWillUnmount() {
        this.unsubscribe()
    }
    handleMoreDesc = () => {
        this.setState({
            descSeeMore: !this.state.descSeeMore
        })
    };
    handleMoreInstr = () => {
        this.setState({
            instrSeeMore: !this.state.instrSeeMore
        })
    };
    renderPrice = () => {
        if (this.state.photoInfo.price.type === 'free') {
            return 'Free'
        }
        else {
            return (
                '$' + (this.state.photoInfo.price.amount / 100).toFixed(2) + " " + this.state.photoInfo.price.currency
            );
        }

    }

    render() {

        const photoInfo = this.state.photoInfo;
        return (
            <div>
                <div className="photo-title">
                    {photoInfo.title}
                </div>

                <div className="photo-price">
                    {this.renderPrice()}
                </div>
                {photoInfo.caption ?
                    <>
                        <div className="section-header">
                            Caption
                    </div>

                        <div className="section-text">
                            {photoInfo["caption"]}
                        </div>

                    </>
                    : null}

                { this.state.promoCodes && this.state.promoCodes.length > 0 ?
                    <>
                        <div className="section-header">
                            Promo Codes
                    </div>
                        {this.state.promoCodes.map(promo =>
                            <div className="section-text">
                                {promo.code} - {promo.discount}% off
                        </div>
                        )}
                    </>
                    : null
                }

                <div className="buyer-list-title">
                    Buyer List
                </div>
            </div>
        );
    }
}

export default PhotoDetailsInfo;