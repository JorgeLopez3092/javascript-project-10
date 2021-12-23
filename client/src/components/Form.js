import React from 'react';

export default function Form(props) {
    const {
        cancel,
        errors,
        submit,
        submitButtonText,
        elements,
    } = props;

    function handleSubmit(event) {
        event.preventDefault();
        submit();
    }

    function handleCancel(event) {
        event.preventDefault();
        cancel();
    }

    return (
        <React.Fragment>
            <ErrorsDisplay errors={errors} />
            <form onSubmit={handleSubmit}>
                {elements()}
                <button className="button" type="submit">{submitButtonText}</button>
                <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
            </form>
        </React.Fragment>
    );
}

function ErrorsDisplay(props) {
    let errorsDisplay = null;

    if (props.errors.length) {
        errorsDisplay = (
            <div className="validation--errors">
                <h3>Validation errors</h3>
                <ul>
                    {props.errors.map((error, i) => <li key={i}>{error}</li>)}
                </ul>
            </div>
        );
    }

    return errorsDisplay;
}
