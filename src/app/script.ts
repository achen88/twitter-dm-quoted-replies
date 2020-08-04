import { delimiter } from "../constants";

document.addEventListener('dataEntry', function (event) {
    const element = document.getElementsByClassName("public-DraftEditor-content")[0].firstChild.firstChild.firstChild as HTMLElement;
    const evt = new Event('textInput', { bubbles: true });
    element.click();
    //@ts-ignore
    evt.data = event.detail.data + delimiter;
    element.dispatchEvent(evt);
});