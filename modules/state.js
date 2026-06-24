/**
 * Job format:
 * {
 *   url: string,
 *   source: 'linkedin' | 'indeed' | 'computrabajo',
 *   header: string,
 *   description: string,
 *   error: string
 * }
 */

export function emptyState(){
  return {running: false, jobs:[]}
}
export function newJob(url, source) {
  //const source="linkedin"//TODO
  return {url, source, header:'', description:'', error:''}
}

export async function getState(){
  const { state } = await chrome.storage.local.get({state: emptyState() });
  return state;
}
export async function setState(state){
  await chrome.storage.local.set({ state });
  chrome.runtime.sendMessage({ state });
}
