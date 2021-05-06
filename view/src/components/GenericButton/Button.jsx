import React from 'react';
import './Button.css';

export default function GenericButton ({...props}) {

    return (
        <button
            className='generic-button'
            style={props.overrideStyles}
            disabled={props.disabled}
            onClick={props.onClick}
            type={props.type}
        >
            {props.content}
        </button>
    )
}