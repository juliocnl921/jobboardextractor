async function download(){
  const state = await chrome.runtime.sendMessage({action: "get_state"});
  const json = JSON.stringify(state.jobs, null, 2);
  const blob = new Blob([json], {type: "application/json"});
  const objUrl = URL.createObjectURL(blob);
  await chrome.downloads.download({url: objUrl, filename: "jobs.json"});
}

function getElement(name){
  return document.getElementById(name)
}

function findjobsInInput(){
  return getElement("jobs").value
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(x => x !== "");
}

async function findjobsInTab(){
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return [];

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const anchors = document.querySelectorAll("a[href]");
      if (!anchors || anchors.length === 0) return [];
      return Array.from(anchors).map(a => a.href).filter(Boolean);
    }
  });
  return results?.[0]?.result ?? [];
}

async function refresh(state){
  const totalEl = getElement("total")
  totalEl.innerHTML = "TOTAL LINKS: "+ state.jobs.length

  const jobsEl = getElement("jobs")
  const logEl  = getElement("log")
  jobsEl.value = ""
  logEl.value  = ""

  for (let i = 0; i < state.jobs.length; i++) {
    const job = state.jobs[i]
    jobsEl.value += "\n"+job.url
    if (job.description.length>0) logEl.value += "\n" + job.url
  }

  const stateEl = getElement("state")
  const lastEl = getElement("last")
  lastEl.value = ""
    
  const processed = state.jobs.filter(x=> x.header.length>0)

  stateEl.innerHTML = "PROCESS: STOPPED"
  if (state.running){
    stateEl.innerHTML = `PROCESS: RUNNING ${processed.length}/${state.jobs.length}`
    logEl.scrollTop = logEl.scrollHeight;
  }

  if (processed.length>0){
    const last = processed[processed.length-1]
    lastEl.value = last.header+ "\n\n" + last.description
  } 
}

window.onload = async () => {
  const state = await chrome.runtime.sendMessage({action: "get_state"});
  await refresh(state)
};

chrome.runtime.onMessage.addListener(async (result) => {await refresh(result.state)});

getElement("clean").addEventListener("click", async () => {
  await chrome.runtime.sendMessage({action: "clean"});
});

getElement("add").addEventListener("click", async () => {
  const urls = await findjobsInTab()
  await chrome.runtime.sendMessage({action: "add", urls: urls});
}); 

getElement("edit").addEventListener("click", async () => {
  const urls = await findjobsInInput()
  await chrome.runtime.sendMessage({action: "edit", urls: urls });
});

getElement("run").addEventListener("click", async () => {
  const urls = await findjobsInInput()
  await chrome.runtime.sendMessage({action: "edit", urls: urls });
  const config ={duration:{min:5000, max:10000} }
  await chrome.runtime.sendMessage({action: "process", config});
});

getElement("download").addEventListener("click", async () => await download());