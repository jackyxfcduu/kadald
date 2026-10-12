const fs=require('fs');const assert=require('assert');
const root=__dirname+'/..';
const app=fs.readFileSync(root+'/app.js','utf8');const html=fs.readFileSync(root+'/index.html','utf8');const proxy=fs.readFileSync(root+'/api/market.js','utf8');
const names=['ICT 2022 Mentorship Model','Silver Bullet','Standard Deviation Projection','Sell Profile','Sell Profile London Delayed Protraction','SMT','Power of 3 (PO3)','3 Drives Pattern','ATM Model','MXMM','Seek and Destroy Profile','IDM','09:50–10:10 Macro','NY Judas Swing','London Swing → NY Open/London Close Reversal','Classic Buy or Sell Day Template','Range → NY Open/London Close Rally','Consolidation Raid on News Release'];
for(const n of names)assert(app.includes(n),'Missing pattern registry: '+n);
for(const n of ['Top 20','Top 50','Top 100','Top 200','All eligible pairs'])assert(app.includes(n),'Missing pair option '+n);
for(const n of ['M5','M15','M30','H1','H2','H4','H6','H12','D1'])assert(app.includes("['"+n+"'"),'Missing timeframe '+n);assert(!app.includes("['M1','1']")&&!app.includes("['M3','3']"),'Timeframes below M5 must not be offered');
for(const n of ['/fapi/v1/exchangeInfo','/fapi/v1/ticker/24hr','/fapi/v1/klines','/api/v5/public/instruments','/api/v5/market/tickers','/api/v5/market/candles'])assert(proxy.includes(n),'Missing provider endpoint '+n);
for(const n of ["action==='health'","action==='universe'","action==='candles'"])assert(proxy.includes(n),'Missing normalized action '+n);
assert(!/create-order|placeOrder|\/fapi\/v1\/order|\/api\/v5\/trade\/order/i.test(app+proxy),'Order execution code must not exist');
assert(html.includes('READ-ONLY')&&html.includes('Binance Futures'),'Read-only/provider UI labels missing');
(async()=>{
 const handler=require(root+'/api/market.js');
 async function call(query){let status=200,body;const res={setHeader(){},status(n){status=n;return this},json(x){body=x;return this},end(){return this}};await handler({method:'GET',query},res);return{status,body}}
 global.fetch=async(url)=>{url=String(url);if(url.endsWith('/fapi/v1/exchangeInfo'))return new Response(JSON.stringify({symbols:[{symbol:'BTCUSDT',status:'TRADING',contractType:'PERPETUAL',quoteAsset:'USDT',marginAsset:'USDT'}]}),{status:200});if(url.endsWith('/fapi/v1/ticker/24hr'))return new Response(JSON.stringify([{symbol:'BTCUSDT',lastPrice:'60000',priceChangePercent:'1.2',quoteVolume:'12345'}]),{status:200});if(url.includes('/fapi/v1/klines'))return new Response(JSON.stringify([[1700000000000,'10','12','9','11','100',1700000059999]]),{status:200});throw new Error('unexpected fetch '+url)};
 let r=await call({action:'universe'});assert.equal(r.status,200);assert.equal(r.body.data.provider,'Binance USDⓈ-M Futures');assert.equal(r.body.data.symbols[0].symbol,'BTCUSDT');
 r=await call({action:'candles',symbol:'BTCUSDT',interval:'15',limit:'60'});assert.equal(r.status,200);assert.equal(r.body.data.candles[0].c,11);
 r=await call({action:'candles',symbol:'BTCUSDT',interval:'1',limit:'60'});assert.equal(r.status,400);assert.match(r.body.error,/Minimum allowed timeframe is M5/);
 global.fetch=async(url)=>{url=String(url);if(url.includes('fapi.binance.com'))return new Response('<html>blocked</html>',{status:403});if(url.includes('/api/v5/public/instruments'))return new Response(JSON.stringify({code:'0',msg:'',data:[{instId:'BTC-USDT-SWAP',state:'live',settleCcy:'USDT'}]}),{status:200});if(url.includes('/api/v5/market/tickers'))return new Response(JSON.stringify({code:'0',msg:'',data:[{instId:'BTC-USDT-SWAP',last:'60000',open24h:'59000',volCcy24h:'1',volCcyQuote24h:'60000'}]}),{status:200});if(url.includes('/api/v5/market/candles'))return new Response(JSON.stringify({code:'0',msg:'',data:[['1700000000000','10','12','9','11','100','1000','1000','1']]}),{status:200});throw new Error('unexpected fetch '+url)};
 r=await call({action:'universe'});assert.equal(r.status,200);assert.equal(r.body.data.provider,'OKX USDT SWAP');
 r=await call({action:'candles',symbol:'BTCUSDT',interval:'15',limit:'60'});assert.equal(r.status,200);assert.equal(r.body.data.provider,'OKX USDT SWAP');assert.equal(r.body.data.candles[0].c,11);
 console.log('PASS: 18 pattern names; M5+ timeframe controls; M1 API rejection; Binance endpoint normalization; OKX fallback normalization; no order execution code. Live network NOT tested.');
})().catch(e=>{console.error(e);process.exit(1)});
