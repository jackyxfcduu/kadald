const assert=require('assert');
const engine=require('../ict-snr-engine.js');
assert.equal(engine.MAX_HISTORY_BARS,150,'default historical context must be 150 bars per timeframe');
assert.deepEqual(engine.ALLOWED_HISTORY_BARS,[150,300,500],'settings should offer 150, 300, and 500 historical bars');
assert.equal(engine.CONFIRMATION_BARS,200,'ICT confirmation must use 200 closed bars');
function make(n,tf=300000){const a=[];for(let i=0;i<n;i++){const c=100+Math.sin(i/4)*2+i*.002;const o=c+(i%2?.15:-.15);a.push({t:1700000000000+i*tf,o,h:Math.max(o,c)+.5,l:Math.min(o,c)-.5,c})}return a}
const long=make(260), ctx={D1:make(190,86400000),H4:make(190,14400000),H1:make(190,3600000),M15:make(220,900000),M5:long,price:long.at(-1).c};
const out=engine.evaluate(ctx,{minScore:85,minRR:1.5,historyBars:150});
assert.equal(out.historyBars,150,'engine should preserve selected historical context limit');
assert.equal(out.confirmationBars,200,'engine should declare 200-bar ICT confirmation');
assert.equal(out.contextBarsByTimeframe.D1,150,'D1 context should respect selected 150-bar limit');
assert.equal(out.confirmationBarsByTimeframe.M15,200,'M15 should use the last 200 closed bars for confirmation');
assert.equal(out.confirmationBarsByTimeframe.M5,200,'M5 should use the last 200 closed bars for confirmation');
for(const n of [150,300,500]){const many={D1:make(520,86400000),H4:make(520,14400000),H1:make(520,3600000),M15:make(520,900000),M5:make(520),price:100};const result=engine.evaluate(many,{historyBars:n,minScore:85,minRR:1.5});assert.equal(result.historyBars,n,`engine should respect ${n}-bar setting`);assert.equal(result.confirmationBars,200,'ICT confirmation stays at 200 bars regardless of context setting')}
const shortCtx={D1:make(150,86400000),H4:make(150,14400000),H1:make(150,3600000),M15:make(150,900000),M5:make(150),price:100};
const short=engine.evaluate(shortCtx,{historyBars:150});
assert.equal(short.decision,'NO_TRADE','engine must not open a position when fewer than 200 M15/M5 bars are available');
assert(short.reasonCodes.includes('ICT_CONFIRMATION_HISTORY_INSUFFICIENT'),'insufficient confirmation data should be explicitly recorded');
const sweep=engine.findSweep(long,200);
assert(!sweep||sweep.index>=long.length-200,'liquidity sweep must be detected only within the latest 200 bars');
console.log('PASS 150/300/500 historical context with 200-closed-bar ICT confirmation.');
