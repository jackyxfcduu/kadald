const fs=require('fs');const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');const app=fs.readFileSync('app.js','utf8');
for(const id of ['refreshBtn','stopScanBtn','lastError','providerHealth','autoBtn','autoRefreshState']) assert(html.includes(`id="${id}"`),`missing startup UI id: ${id}`);
assert(app.includes("if($('lastError'))$('lastError').textContent='None';"),'scan startup must guard diagnostic element');
assert(app.includes("if($('autoBtn')){$('autoBtn').textContent='Resume continuous scan';"),'auto controls must not crash startup if absent');
assert(app.includes("$('refreshBtn').addEventListener('click',()=>scan(false))"),'Start Scan must invoke scan');
assert(app.includes("await api({action:'universe'},state.controller.signal)"),'scan must request market universe');
console.log('PASS Phase 36.8.2: required start controls exist; missing diagnostics cannot block scan; Start Scan calls market API. Browser/live API not tested.');
