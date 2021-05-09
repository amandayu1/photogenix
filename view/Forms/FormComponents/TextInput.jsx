import React, {Component} from "react";
import './TextInput.css'
//props accepted:
// input type
// container classname
// input id
// input placeholder
// input value
// input onChangeHandler
// onKeyDown handler (for when enter is pressed)
// isRequired (for visual asterix)
// labelName
// labelText
// 
class TextInput extends Component {
    render() {
      //The markup for the Step 1 UI    
      

    return(
        <div /* style = {containerStyle} */ className={`${this.props.classname} outer-container`}>
            <div /* style = {itemsStyle}  */className={'inner-container'}>
                <label htmlFor={`${this.props.labelName}`} className={'label'}>
                    {`${this.props.labelText}`}
                    {this.props.required && 
                        <span style = {{color: 'red'}}>*</span>
                    }
                </label>

                <input /* bordered = {false} */ //change styling here!!!
                    style={this.props.error ? {borderColor: "#fa755a"} : null}
                    className={'text-input'}
                    id={`${this.props.id}`}
                    name={`${this.props.name}`}
                    type={`${this.props.type}`}
                    placeholder={`${this.props.placeholder}`}
                    //pattern={`${this.props.pattern}`}
                    value={this.props.value} 
                    onChange={this.props.handleChange} // Prop: Puts data into state
                    onKeyDown={this.props.onKeyDown}
                />
            </div>
         
        </div>
        
    )}
    
}

export default TextInput;