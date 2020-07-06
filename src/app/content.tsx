import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";
import svgHash from "../reply.svg";
import "../styles/content.css";

const ReplySVG = chrome.runtime.getURL('js/' + svgHash);

chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(() => {
        if (document.readyState === "complete" && $("div[aria-label='Add reaction']").toArray().length > 0) {
            clearInterval(checkReady);

            const targets = $("div[aria-label='Add reaction']").toArray();
            for (const target of targets) {
                let container = document.createElement("div");
                container.className = "Reply";
                target.parentElement.parentElement.append(container);
            }

            for (const container of $(".Reply")) {
                ReactDOM.render(<Reply />, container);
            }
        }
    })
});

class Reply extends React.Component {
    render() {
        return (
            <div className="reply-container" onClick={() => console.log("I GOT CLICKED")}>
                <img className="replySVG" src={ReplySVG} />
            </div>
        )
    }
}

// parent().addreact
// ReactDOM.render(
//     <Reply />,
//     document.getElementsByTagName('body')[0]
// )