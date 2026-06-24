import { newJob } from '../state.js';

const TYPE = 'indeed'

function bodyReader(){
    const headerContainer = document.querySelector('.jobsearch-InfoHeaderContainer');
    let header = ""
    if (headerContainer)  header = headerContainer.textContent.trim();

    let description = ""

    return {header, description}
}

function urlReader(url) {
    const patterns = [
        /https:\/\/mx\.indeed\.com\/pagead\/clk\?mo/ , 
        /https:\/\/mx\.indeed\.com\/rc\/clk\?jk/
    ]
    
    for (const pattern of patterns) {
        if (url.match(pattern)) return newJob(url, TYPE)
    }

    return undefined
}

export const indeedReader = { type: TYPE, body: bodyReader, url: urlReader}
