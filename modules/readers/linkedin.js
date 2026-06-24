import { newJob } from '../state.js';

function bodyReader(){
    const section = document.querySelector('section[aria-label="Contenido principal"]');
    const root = section?.firstElementChild ?.firstElementChild?.firstElementChild;
    const header = root?.children[1]?.innerText ?? "";
    const description = root?.children[2]?.children[2]?.innerText ?? "";
    return {header, description}
}

function urlReader(url) {
    const regex = /https:\/\/www\.linkedin\.com\/jobs\/view\/\d+/;
    const match = url.match(regex);
    if (match) return newJob(match[0], 'linkedin')
    return undefined
}

export const linkedinReader =
    {
        type: "linkedin",
        body: bodyReader, 
        url: urlReader
    }
