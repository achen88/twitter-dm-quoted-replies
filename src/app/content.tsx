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
                    const tweetContainer = addedNode.firstChild.firstChild;
                    const tweetSpan = tweetContainer.firstChild.nextSibling.firstChild.firstChild.firstChild as HTMLSpanElement;
                    const buttonMenu = tweetContainer.lastChild;
                    const button = buttonMenu.lastChild as HTMLDivElement;

                    if (button.getAttribute("aria-label") === "More actions") {
                        const container = document.createElement("div");
                        buttonMenu.appendChild(container);
                        ReactDOM.render(Reply({ data: tweetSpan.innerText }), container);
                    }
                } catch (error) {} // bro i dont give a fuuuuuuck, body that shit
            }
        }
    }
});
observer.observe(document, { childList: true, subtree: true });

const timer = setInterval(() => {
    if (document.readyState === "complete") {
        const s = document.createElement('script');
        s.src = chrome.extension.getURL('js/script.js');
        (document.head||document.documentElement).appendChild(s);
        s.onload = function() {
            s.remove();
        };
        clearInterval(timer);
    }
});

const Reply = (props) => {
    return (
        <div className="reply-container" onClick={() => {document.dispatchEvent(new CustomEvent('dataEntry', {detail: props})); console.log(props)}}>
            <img className="replySVG" src={ReplySVG} />
        </div>
    )
}
