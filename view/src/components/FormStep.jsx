import React, { Component } from "react";
import TextArea from "antd/lib/input/TextArea";

class StepInForm extends Component {
  render() {
    if (this.props.currentStep !== this.props.renderStep) {
      return null
    }

    const containerStyle = {
      height: "100%",
      width: "inherit",
      display: "inline-flex",
      flexDirection: "column",
      flexFlow: "column wrap",
      justifyContent: "center",
      alignItems: "space-evenly",
      alignContent: "space-evenly",
      fontSize: "1rem",
      marginTop: "1em",
      marginBottom: "2%",
      fontFamily: "Assistant",
      fontWeight: "300",
    }

    const itemsStyle = {
      width: "100%",
      flex: "none",
      alignItems: "stretch",

    }

    const textArea = {
      backgroundColor: "white",
      fontSize: "1rem",
      width: "30rem",
      maxWidth: "85vw",
      display:"block",
      textAlign: "center",
      resize: "none",
      outline: "none",
      border: "1px solid transparent",
      transition: "box-shadow 150ms ease",
      boxShadow: "0 1px 3px 0 #e6ebf1",
      borderRadius: "4px",
  }

    return (
      <div style={containerStyle} className={`${this.props.classname}`}>
        <div style={itemsStyle}>
          <label htmlFor={`${this.props.labelName}`} style={{ textAlign: "left", marginBottom: "2%" }}>{`${this.props.labelText}`}{this.props.required && <span style={{ color: 'red' }}>*</span>}</label>
          <TextArea
            style={this.props.error ? { borderColor: "#fa755a" } : textArea}
            id={`${this.props.id}`}
            name={`${this.props.name}`}
            type={`${this.props.type}`}
            placeholder={`${this.props.placeholder}`}
            value={this.props.value}
            onChange={this.props.handleChange}
            onKeyDown={this.props.onKeyDown}
          />
        </div>

      </div>

    )
  }
}

export { StepInForm };
