import React, { Component } from "react";


class FormStepCaption extends Component {
    constructor(props) {
        super(props)

        this.state = {
            caption: this.props.caption,
            defaultDesc: 'Please fill out the field(s) below.',
        }

    }


    render() {
        if (this.state.caption) {
            return (
                <h2
                    style={{ fontWeight: '300' }}
                >
                    {this.state.caption}
                </h2>
            );
        }

        return (
            <h2
                style={{ fontWeight: '300' }}
            >
                {this.state.defaultDesc}
            </h2>
        )
    }


}
export default FormStepCaption;