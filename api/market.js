// Read-only normalized market-data adapter: Binance USDⓈ-M Futures primary, OKX USDT SWAP fallback.
// No credentials, private endpoints, or order execution.
const TF_BINANCE = new Set(['5','15','30','60','120','240','360','720','D']);
const TF_OKX = {'5':'5m','15':'15m','30':'30m','60':'1H','120':'2H','240':'4H','360':'6H','720':'12H','D':'1Dutc'};
const json = (res, status, body) => res.status(status).json(body);
async function getJson(url, timeoutMs=9000) {
  const c = new AbortController(); const timer = setTimeout(()=>c.abort(), timeoutMs);
  try { const r=await fetch(url,{headers:{accept:'application/json'},signal:c.signal}); const txt=await r.text(); let data; try{data=JSON.parse(txt)}catch{throw new Error(`HTTP ${r.status}: upstream returned non-JSON`)} if(!r.ok)throw new Error(`HTTP ${r.status}: ${data.msg||data.message||'upstream request failed'}`); return data; }
  finally { clearTimeout(timer); }
}
function intervalBinance(v){if(!TF_BINANCE.has(String(v)))throw new Error('Unsupported interval');return String(v)==='60'?'1h':String(v)==='120'?'2h':String(v)==='240'?'4h':String(v)==='360'?'6h':String(v)==='720'?'12h':String(v)==='D'?'1d':String(v)==='W'?'1w':`${v}m`;}
function okxInst(symbol){const s=String(symbol||'').toUpperCase();if(!/^[A-Z0-9]+USDT$/.test(s))throw new Error('Invalid USDT perpetual symbol');return s.slice(0,-4)+'-USDT-SWAP';}
async function binanceUniverse(){
  const [info,ticks]=await Promise.all([getJson('https://fapi.binance.com/fapi/v1/exchangeInfo'),getJson('https://fapi.binance.com/fapi/v1/ticker/24hr')]);
  const eligible=new Set((info.symbols||[]).filter(x=>x.status==='TRADING'&&x.contractType==='PERPETUAL'&&x.quoteAsset==='USDT'&&x.marginAsset==='USDT').map(x=>x.symbol));
  const symbols=(ticks||[]).filter(x=>eligible.has(x.symbol)&&Number(x.lastPrice)>0&&Number(x.quoteVolume)>0).map(x=>({symbol:x.symbol,price:Number(x.lastPrice),changePct:Number(x.priceChangePercent),turnover24h:Number(x.quoteVolume)})).sort((a,b)=>b.turnover24h-a.turnover24h);
  if(!symbols.length)throw new Error('Binance returned no eligible USDT perpetual instruments');return {provider:'Binance USDⓈ-M Futures',symbols};
}
async function okxUniverse(){
  const [info,ticks]=await Promise.all([getJson('https://www.okx.com/api/v5/public/instruments?instType=SWAP'),getJson('https://www.okx.com/api/v5/market/tickers?instType=SWAP')]);
  if(info.code!=='0'||ticks.code!=='0')throw new Error(`OKX error: ${info.msg||ticks.msg||info.code||ticks.code}`);
  const eligible=new Set((info.data||[]).filter(x=>x.state==='live'&&x.settleCcy==='USDT'&&String(x.instId).endsWith('-USDT-SWAP')).map(x=>String(x.instId).replace(/-/g,'').replace(/SWAP$/,'')));
  const symbols=(ticks.data||[]).filter(x=>eligible.has(String(x.instId).replace(/-/g,'').replace(/SWAP$/,''))&&Number(x.last)>0&&Number(x.volCcy24h)>0).map(x=>({symbol:String(x.instId).replace(/-/g,'').replace(/SWAP$/,''),price:Number(x.last),changePct:Number(x.open24h)>0?(Number(x.last)/Number(x.open24h)-1)*100:0,turnover24h:Number(x.volCcyQuote24h)||((Number(x.volCcy24h)||0)*(Number(x.last)||0))})).filter(x=>x.turnover24h>0).sort((a,b)=>b.turnover24h-a.turnover24h);
  if(!symbols.length)throw new Error('OKX returned no eligible USDT SWAP instruments');return {provider:'OKX USDT SWAP',symbols};
}
async function binanceCandles(symbol,interval,limit){const raw=await getJson(`https://fapi.binance.com/fapi/v1/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(intervalBinance(interval))}&limit=${limit}`);if(!Array.isArray(raw))throw new Error('Binance klines response is not an array');return {provider:'Binance USDⓈ-M Futures',candles:raw.map(x=>({t:Number(x[0]),o:Number(x[1]),h:Number(x[2]),l:Number(x[3]),c:Number(x[4]),v:Number(x[5]),closeTime:Number(x[6])}))};}
async function okxCandles(symbol,interval,limit){const bar=TF_OKX[String(interval)];if(!bar)throw new Error('Interval not supported by OKX fallback');const instId=okxInst(symbol);const raw=await getJson(`https://www.okx.com/api/v5/market/candles?instId=${encodeURIComponent(instId)}&bar=${encodeURIComponent(bar)}&limit=${Math.min(300,Math.max(30,limit))}`);if(raw.code!=='0'||!Array.isArray(raw.data))throw new Error(`OKX candles error: ${raw.msg||raw.code}`);return {provider:'OKX USDT SWAP',candles:raw.data.filter(x=>x[8]==='1').map(x=>({t:Number(x[0]),o:Number(x[1]),h:Number(x[2]),l:Number(x[3]),c:Number(x[4]),v:Number(x[6]||x[5]),closeTime:null})).reverse()};}
module.exports=async function(req,res){res.setHeader('Cache-Control','no-store');res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');if(req.method==='OPTIONS')return res.status(204).end();if(req.method!=='GET')return json(res,405,{ok:false,error:'GET only'});
 const action=String(req.query.action||'');
 if(action==='health'){
   const attempts=[];for(const [name,fn] of [['Binance USDⓈ-M Futures',()=>getJson('https://fapi.binance.com/fapi/v1/ping')],['OKX USDT SWAP',()=>getJson('https://www.okx.com/api/v5/public/instruments?instType=SWAP')]]){try{const d=await fn();if(d&&d.code&&d.code!=='0')throw new Error(d.msg||d.code);return json(res,200,{ok:true,data:{provider:name,status:'reachable',checkedAt:new Date().toISOString(),fallbackTested:attempts,marketDataOnly:true,orderExecution:false}})}catch(e){attempts.push({provider:name,error:e.message})}}
   return json(res,502,{ok:false,error:'Both public market-data providers failed from this Vercel function',attempts});
 }
 if(action==='universe'){
   const attempts=[];for(const [name,fn] of [['Binance USDⓈ-M Futures',binanceUniverse],['OKX USDT SWAP',okxUniverse]]){try{const data=await fn();return json(res,200,{ok:true,data:{...data,sourceAttempts:attempts}})}catch(e){attempts.push({provider:name,error:e.message})}}
   return json(res,502,{ok:false,error:'Binance primary and OKX fallback both failed to load the USDT perpetual universe',attempts});
 }
 if(action==='candles'){
   const symbol=String(req.query.symbol||'').toUpperCase(),interval=String(req.query.interval||'15'),limit=Math.min(500,Math.max(30,Number(req.query.limit)||150));if(!/^[A-Z0-9]+USDT$/.test(symbol))return json(res,400,{ok:false,error:'Only normalized USDT symbols are accepted'});if(!TF_BINANCE.has(interval)||!TF_OKX[interval])return json(res,400,{ok:false,error:'Unsupported timeframe. Minimum allowed timeframe is M5 (5 minutes).'});
   const attempts=[];for(const [name,fn] of [['Binance USDⓈ-M Futures',()=>binanceCandles(symbol,interval,limit)],['OKX USDT SWAP',()=>okxCandles(symbol,interval,limit)]]){try{const data=await fn();if(!data.candles.length)throw new Error('No closed candles returned');return json(res,200,{ok:true,data:{...data,symbol,interval,sourceAttempts:attempts}})}catch(e){attempts.push({provider:name,error:e.message})}}
   return json(res,502,{ok:false,error:`Candle request failed for ${symbol} ${interval} on both providers`,attempts});
 }
 return json(res,400,{ok:false,error:'Unknown action. Use action=health, universe, or candles.'});
};
