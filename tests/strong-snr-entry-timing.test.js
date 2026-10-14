const assert=require('assert');
const engine=require('../ict-snr-engine.js');
function candles(n,step=1,start=100,period=12){const out=[];for(let i=0;i<n;i++){const wave=Math.sin(i*Math.PI*2/period)*step*3;const prev=Math.sin((i-1)*Math.PI*2/period)*step*3;const c=start+i*step*.02+wave;const o=start+i*step*.02+prev;out.push({t:1700000000000+i*60000,o,h:Math.max(o,c)+step*.7,l:Math.min(o,c)-step*.7,c})}return out}
const d1=candles(120,1,100,16),h4=candles(120,.7,100,14),h1=candles(120,.4,100,12),m15=candles(120,.2,100,10),m5=candles(120,.1,100,8);
const zones=engine.zoneMap(d1,'D1');
assert(Array.isArray(zones),'zoneMap must return zones');
if(zones.length){assert(zones.every(z=>Number.isFinite(z.score)&&z.score>=0&&z.score<=100),'zones need normalized quality scores');assert(zones.every(z=>['STRONG','MODERATE','WEAK','INVALID'].includes(z.strength)),'zones need explicit strength labels');assert(zones.every(z=>z.low<z.high),'zones must be ranges, not just a single price');}
const far=engine.evaluate({D1:d1,H4:h4,H1:h1,M15:m15,M5:m5,price:100000},{minScore:85,minRR:1.5});
assert.equal(far.decision,'NO_TRADE','price far from any valid SNR must not create a trade');
assert(['WAIT','NO_SETUP','NO_DATA'].includes(far.status),'far price should wait or remain without a setup');
assert(far.locationState==='WAITING_FOR_ZONE'||far.locationState==='WAIT','far price should be labeled as waiting for a valid zone');
assert(far.strongSNR&&typeof far.strongSNR.isStrong==='boolean','strong SNR diagnostics must be returned');
const invalid=engine.evaluate({D1:[],H4:h4,H1:h1,M15:m15,M5:m5,price:100});
assert.equal(invalid.status,'NO_DATA','missing D1 must block entry');
console.log('PASS Strong SNR timing: scored zones, explicit strength/range, no chasing far-away price, and missing-data gate.');
