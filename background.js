import { randomMiliseconds,waitForTabLoad,waitForElement,uniqueByKey  } from './modules/utils.js';
import { emptyState, getState, setState } from './modules/state.js';
import { jobBoardsReaders} from './modules/jobboardsreaders.js';

async function clean(){
  const state = await getState()
  if(state.running) return

  await setState(emptyState())
}

function extractJobs(urls) {
  let filtered = []
  for (const url of urls) {
    for (const reader of jobBoardsReaders) {
      const job = reader.url(url)
      if(job) filtered.push(job)
    }
  }
  return uniqueByKey(filtered, 'url');
}

async function add(urls){
  const state = await getState()
  if(state.running) return
  state.running = false
  state.jobs.push(...extractJobs(urls));
  await setState(state);
}

async function edit(urls){
  const state = await getState()
  if(state.running) return
  state.running = false;
  state.jobs = extractJobs(urls)
  await setState(state);
}

async function process(sendResponse, config){
  const state = await getState()
  state.running = true

  for (let i = 0; i < state.jobs.length; i++) {
    try {

      const [tab] = await chrome.tabs.query({active: true,currentWindow: true});
      await chrome.tabs.update(tab.id, {url: state.jobs[i].url});

      state.jobs[i].header =  ''
      state.jobs[i].description =  ''
      state.jobs[i].error = ''

      await waitForTabLoad(tab.id);
      await waitForElement(tab.id, "body");
      const extra_time_out = randomMiliseconds(config.duration.min, config.duration.max)
      await new Promise(resolve => setTimeout(resolve, extra_time_out));
      let toExecute = () => {return {header:"", description:""}}

      for (const reader of jobBoardsReaders) {
        if (state.jobs[i].source == reader.source) toExecute = reader.body
      }

      const [res] = await chrome.scripting.executeScript({target: { tabId:tab.id} , func:toExecute})

      state.jobs[i].header =  res.result.header
      state.jobs[i].description =  res.result.description

    } catch (error) {
      state.jobs[i].error = error.message
    }
    await setState(state);
  }
  
  state.running = false
  await setState(state);
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {  
  if (message.action === "clean") await clean()
  if (message.action === "edit") await edit(message.urls)
  if (message.action === "add") await add(message.urls)
  if (message.action === "process") await process(sendResponse, message.config)
  if (message.action === "get_state") {
    const state = await getState()
    await sendResponse(state)
  }
});