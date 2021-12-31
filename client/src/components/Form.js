import React from 'react';

// Form template to build forms on top of.
export default function Form(props) {

    // props values to fill in blanks below
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
        { /*ErrorsDisplay is only visible if errors prop is not null */}
            <ErrorsDisplay errors={errors} />
            <form onSubmit={handleSubmit}>
            {/* elements() is where we grab the actual form jsx from whichever other component is calling this Form template component */}
                {elements()}
                <button className="button" type="submit">{submitButtonText}</button>
                <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
            </form>
        </React.Fragment>
    );
}

function ErrorsDisplay(props) {
    let errorsDisplay = null;

    // checks if theres any existing errors
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
