import React, { Component } from "react";
import { Link } from "react-router-dom";
import FormStepCaption from "./FormStepCaption";


class FormStepHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progressBarPercent: this.props.percent,
            caption: this.props.caption,

        }
    }

    render() {
        return (
            <React.Fragment>

                <div //header div
                    style={{
                        marginTop: "5%",
                        fontSize: "0.7em",
                        width: "100%",
                        textAlign: "left"
                    }}
                >

                    <Link
                        style={{
                            float: "right",
                            marginRight: "7.5%",
                            marginTop: "1%",
                            color: "#4B4B4B",
                            fontSize: "1rem",
                            fontWeight: "600"
                        }}
                        to="/ProfilePage"
                    >
                        Exit
                    </Link>

                    <div
                        style={{
                            marginLeft: "7.5%",
                            overflow: "hidden",
                            color: "#00A7F3"
                        }}
                    >
                        <h1
                            style={{
                                color: "#755E94",
                                fontSize: "1.5rem",
                                fontWeight: "600"
                            }}
                        >
                            Add a Photo
                        </h1>

                        <FormStepCaption
                            caption={this.state.caption}
                        />
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default FormStepHeader;