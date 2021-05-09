import React from "react";

import FormStepHeader from './FormComponents/FormStepHeader'
import NavigationButtons from './FormComponents/NavigationButtons';
import TextInput from './FormComponents/TextInput'

const TitleDescStep = (props) => {


    //structure for each step should be 

    return (
        <React.Fragment>
            <FormStepHeader
                caption='Share some basic info to get you set up'
                percent={0}
            />
            <div className='form-body'>
                <TextInput
                    name="title"
                    labelName="title"
                    labelText="Title"
                    required
                    handleChange={props.handleTextChange}
                    value={props.title}
                    // could be wrong
                    photoName="form-group"
                    id="title"
                    type="text"
                    autoSize={{ "minRows": "1", "maxRows": "2" }}
                    placeholder="Yin Yoga"
                />
                <TextInput
                    name="caption"
                    labelName="caption"
                    labelText="Caption"
                    handleChange={props.handleTextChange}
                    value={props.caption}
                    // could be wrong
                    photoName="form-group"
                    id="caption"
                    type="text"
                    autoSize={{ "minRows": "1", "maxRows": "3" }}
                    placeholder="Bring your yoga mats and good vibes"
                />
            </div>

            <NavigationButtons
                nextStep={props.nextStep}
                disabled={props.advanceDisabled}
            />

        </React.Fragment>
    )

}

export default TitleDescStep;