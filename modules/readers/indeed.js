import { newJob } from '../state.js';

const SOURCE = 'indeed'

function bodyReader(){
    const headerContainer = document.querySelector('.jobsearch-InfoHeaderContainer');
    let header = ""
    if (headerContainer)  header = headerContainer.textContent.trim();

    const descriptionContainer = document.querySelector('.jobsearch-BodyContainer');
    let description = ""
    if (descriptionContainer)  description = descriptionContainer.textContent.trim();
    
    return {header, description}
}

function urlReader(url) {
    const patterns = [
        /https:\/\/mx\.indeed\.com\/pagead\/clk\?mo/ , 
        /https:\/\/mx\.indeed\.com\/rc\/clk\?jk/
    ]
    
    for (const pattern of patterns) {
        if (url.match(pattern)) return newJob(url, SOURCE)
    }

    return undefined
}

export const indeedReader = { source: SOURCE, body: bodyReader, url: urlReader}
