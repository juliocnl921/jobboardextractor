/**
 * Job format:
 * {
 *   url: string,
 *   type: 'linkedin' | 'indeed' | 'computrabajo',
 *   header: string,
 *   description: string,
 *   error: string
 * }
 */

export function emptyState(){
  return {running: false, jobs:[]}
}
export function newJob(url, type) {
  //const type="linkedin"//TODO
  return {url, type, header:'', description:'', error:''}
}

export async function getState(){
  const { state } = await chrome.storage.local.get({state: emptyState() });
  return state;
}
export async function setState(state){
  await chrome.storage.local.set({ state });
  chrome.runtime.sendMessage({ state });
}
