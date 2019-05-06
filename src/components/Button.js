import React from "react";

const RetryButton = (props) => {
    return (
        <button className="retryButton" onClick={props.reload}>Try again!</button>
    )
}

export default RetryButton;