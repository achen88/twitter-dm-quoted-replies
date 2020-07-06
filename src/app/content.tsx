import * as React from "react";
import * as ReactDOM from "react-dom";
import svgHash from "../reply.svg";
import "../styles/content.css";

const ReplySVG = chrome.runtime.getURL('js/' + svgHash);

let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
        for(let addedNode of mutation.addedNodes) {
            if (addedNode.nodeName === "DIV") {
                try {
                    const buttonMenu = addedNode.firstChild.firstChild.lastChild;
                    const button = buttonMenu.lastChild as HTMLDivElement;
                    if (button.getAttribute("aria-label") === "More actions") {
                        const container = document.createElement("div");
                        buttonMenu.appendChild(container);
                        ReactDOM.render(<Reply />, container);
                    }
                } catch (error) {} // bro i dont give a fuuuuuuck, body that shit
            }
        }
    }
});
observer.observe(document, { childList: true, subtree: true });


class Reply extends React.Component {
    render() {
        return (
            <div className="reply-container" onClick={() => console.log("I GOT CLICKED")}>
                <img className="replySVG" src={ReplySVG} />
            </div>
        )
    }
}
