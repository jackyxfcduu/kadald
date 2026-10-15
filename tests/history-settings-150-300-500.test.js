const assert=require('assert');
const fs=require('fs');
const app=fs.readFileSync(require('path').join(__dirname,'..','app.js'),'utf8');
const engine=require('../ict-snr-engine.js');
assert(app.includes("['150','150 bars — light / faster'],['300','300 bars — balanced'],['500','500 bars — deeper structure']"),'Settings must expose 150/300/500 bar choices');
assert(app.includes('limit:requestLimit'),'Market download limit must include the selected context and 200-bar ICT confirmation requirement');
assert(app.includes('ctx[tfName]=cs.slice(-analysisLimit)'),'Scanner must cap each timeframe to its context/confirmation analysis window');
assert(app.includes('historyBars:state.currentHistoryLimit'),'Selected context limit must be passed into strategy engine');
assert(app.includes('Math.max(state.currentHistoryLimit,window.ICTSNR.CONFIRMATION_BARS)'),'M15/M5 must load at least 200 closed bars for ICT confirmation');
assert.deepEqual(engine.ALLOWED_HISTORY_BARS,[150,300,500]);
function bars(n){return Array.from({length:n},(_,i)=>({t:1700000000000+i*300000,o:100+i*.01,h:101+i*.01,l:99+i*.01,c:100.5+i*.01}));}
for(const n of [150,300,500]){const a=bars(520);const ctx={D1:a,H4:a,H1:a,M15:a,M5:a,price:a.at(-1).c};assert.equal(engine.evaluate(ctx,{historyBars:n}).historyBars,n,`engine should honor ${n} bars`)}
console.log('PASS: Settings supports 150/300/500; scanner download, context slicing, and engine use selected limit.');
