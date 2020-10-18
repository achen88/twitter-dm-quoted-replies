import * as React from "react";
import * as ReactDOM from "react-dom";
import * as $ from "jquery";
import svgHash from "../reply.svg";
import "../styles/content.css";
import { truncateLength, delimiter } from "../constants";

const ReplySVG = chrome.runtime.getURL('js/' + svgHash);

const format = (replyHeader, replyText) => {
    // truncate reply header if original message was a reply
    if (replyText.lastIndexOf(delimiter) !== -1) {
        replyText = replyText.substring(replyText.lastIndexOf(delimiter) + delimiter.length);
    }
    // format Quoted Tweets
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
    const tweetContainer = addedNode.firstChild.firstChild.firstChild;
    const messageContainer = tweetContainer?.firstChild?.nextSibling?.firstChild?.firstChild as HTMLSpanElement;
    const buttonMenu = tweetContainer.firstChild;
    const button = buttonMenu.lastChild as HTMLDivElement;
    if (button.getAttribute("aria-label") === "More actions") {
        const container = document.createElement("div");
        buttonMenu.appendChild(container);
        const messageText = messageContainer.innerText;
        const messageOrigin = tweetContainer.childElementCount === 3 ? "you" : "me";
        const replyHeader = `Replied to ${messageOrigin}:\n`;
        ReactDOM.render(Reply({ data: format(replyHeader, messageText) }), container);
    }
}

let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
        for(let addedNode of mutation.addedNodes) {
            if (addedNode.nodeName === "DIV") {
                try {
                    inject(addedNode);
                } catch (error) {}
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

// special case where user clicks into quoted tweet preview in DMs, DOM mutation is not observed
// if you have a better idea PLEASE let me know
let currentURL = window.location.href;
setInterval(() => {
    if (currentURL !== window.location.href) {
        currentURL = window.location.href;
        const injectHandler = setInterval(() => {
            if ($("div[data-testid='messageEntry']").toArray().length > 0) {
                $("div[data-testid='messageEntry']").toArray().forEach((node) => {
                    try {
                        inject(node.parentElement);
                    } catch (error) {}
                })
                clearInterval(injectHandler);
            }
        });
        setTimeout(() => {clearInterval(injectHandler)}, 3000); // in the case nothing needs to be injected
    }
});

const Reply = (props) => {
    return (
        <div className="reply-container" onClick={() => {document.dispatchEvent(new CustomEvent('dataEntry', {detail: props}))}}>
            <img className="replySVG" src={ReplySVG} />
        </div>
    )
}
