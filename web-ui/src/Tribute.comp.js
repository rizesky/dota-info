import posthog from "posthog-js";



const profileURL = "https://github.com/rizesky"
const featureURL = "https://github.com/rizesky/dota-info/issues";
const supportURL = "https://github.com/rizesky/dota-info/issues";
const Tribute = () => {

    const trackLinkClick = (event_name, url) => {
        posthog.capture(event_name, {
            url: url,
            capture_date: new Date().getUTCMilliseconds,
        });
    }


    return (
        <div className="tribute">
            <div>
                Made for fun 😁 by <a onClick={trackLinkClick('profile click', profileURL)} href={profileURL} target="_blank" rel="noopener noreferrer">zes</a>
            </div>
            <div className="tribute-links">
                <span>
                    Feature Suggestion? <a onClick={() => trackLinkClick('feature-suggestion click', featureURL)} href={featureURL} target="_blank" rel="noopener noreferrer">Request here</a>
                </span>
                <span className="tribute-divider">|</span>
                <span>
                    <a onClick={() => trackLinkClick('support-me click', supportURL)} href={supportURL} target="_blank" rel="noopener noreferrer">Support me</a>
                </span>
            </div>
        </div>)
}
export default Tribute;