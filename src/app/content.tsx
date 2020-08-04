import * as React from "react";
import * as ReactDOM from "react-dom";
import svgHash from "../reply.svg";
import "../styles/content.css";

const ReplySVG = chrome.runtime.getURL('js/' + svgHash);

const replyHeader = "Replied to you:\n"
const truncateLength = 100;

const format = (replyText) => {
    if (replyText.indexOf("Quote Tweet") === 0) {
        const nextNewLineIndex = replyText.indexOf("\n", 12);
        const lastNewLineIndex = replyText.indexOf("\n", nextNewLineIndex+1);
        const truncateIndicator = replyText.substring(lastNewLineIndex+1, lastNewLineIndex+1+truncateLength).length < replyText.substring(lastNewLineIndex+1).length ? "..." : "";
        return replyHeader + "Quote Tweet | " + replyText.substring(12, nextNewLineIndex) + " | " + replyText.substring(nextNewLineIndex+1, lastNewLineIndex) + replyText.substring(lastNewLineIndex+1, lastNewLineIndex+1+truncateLength) + truncateIndicator;
    } else {
        const truncateIndicator = replyText.substring(0, truncateLength).length < replyText.length ? "..." : "";
        return replyHeader + replyText.substring(0, truncateLength) + truncateIndicator;
    }
}

const inject = (addedNode) => {
    const tweetContainer = addedNode.firstChild.firstChild;
    const incomingMessageSpan = tweetContainer.firstChild.nextSibling.firstChild.firstChild.firstChild as HTMLSpanElement;
    const outgoingMessageSpan = tweetContainer.firstChild.firstChild.firstChild.firstChild as HTMLSpanElement;
    const buttonMenu = tweetContainer.lastChild;
    const button = buttonMenu.lastChild as HTMLDivElement;
    if (button.getAttribute("aria-label") === "More actions") {
        const container = document.createElement("div");
        buttonMenu.appendChild(container);
        const messageText = incomingMessageSpan.innerText || outgoingMessageSpan.innerText;
        ReactDOM.render(Reply({ data: format(messageText) }), container);
    }
}

let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
        for(let addedNode of mutation.addedNodes) {
            if (addedNode.nodeName === "DIV") {
                console.log(addedNode);
                try {
                    inject(addedNode);
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
