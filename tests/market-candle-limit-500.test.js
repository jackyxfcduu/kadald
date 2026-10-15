const assert=require('assert');
const handler=require('../api/market.js');
async function call(query){let status=200,body;const res={setHeader(){},status(n){status=n;return this},json(x){body=x;return this},end(){return this}};await handler({method:'GET',query},res);return{status,body}}
(async()=>{
 let urlSeen='';
 global.fetch=async url=>{urlSeen=String(url);const rows=Array.from({length:500},(_,i)=>{const t=1700000000+i*300;return [String(t),'100','101','99','100.5','10','0','1000']});return new Response(JSON.stringify(rows),{status:200,headers:{'content-type':'application/json'}})};
 const r=await call({action:'candles',symbol:'BTCUSDT',interval:'5',limit:'500'});
 assert.equal(r.status,200);assert.equal(r.body.data.candles.length,500);assert.equal(r.body.data.requestedBars,500);assert.equal(r.body.data.returnedBars,500);assert(urlSeen.includes('gateio.ws'),'500-bar requests should use provider capable of up to 500 bars');
 console.log('PASS: 500-bar market request returns up to 500 bars from supported provider.');
})().catch(e=>{console.error(e);process.exit(1)});
