// Public Bybit V5 market-data adapter with official-host failover. No credentials or order execution.
const INTERVALS = new Set(['5','15','30','60','120','240','360','720','D']);
const API_HOSTS = ['https://api.bybit.com','https://api.bytick.com','https://api.bybit.id'];
const json = (res,status,body)=>res.status(status).json(body);
async function requestJson(path, timeoutMs=9000) {
  const attempts=[];
  for (const host of API_HOSTS) {
    const c=new AbortController(),timer=setTimeout(()=>c.abort(),timeoutMs);
    try {
      const r=await fetch(`${host}${path}`,{headers:{accept:'application/json','user-agent':'KadalD-ICT-SNR/1.0'},signal:c.signal});
      const txt=await r.text();
      let data;
      try { data=JSON.parse(txt); }
      catch {
        const detail=txt.replace(/\s+/g,' ').trim().slice(0,120);
        throw new Error(`HTTP ${r.status}: upstream returned non-JSON${detail?` (${detail})`:''}`);
      }
      if(!r.ok) throw new Error(`HTTP ${r.status}: ${data.retMsg||'upstream request failed'}`);
      if(data.retCode!==undefined&&Number(data.retCode)!==0) throw new Error(`Bybit ${data.retCode}: ${data.retMsg||'market data request failed'}`);
      return {data,host};
    } catch(e) {
      attempts.push({host,error:e.name==='AbortError'?'request timed out':e.message});
    } finally { clearTimeout(timer); }
  }
  const summary=attempts.map(x=>`${new URL(x.host).hostname}: ${x.error}`).join(' | ');
  const err=new Error(`All official Bybit API hosts failed. ${summary}`);
  err.attempts=attempts;
  throw err;
}
async function getJson(path,timeoutMs=9000){return (await requestJson(path,timeoutMs)).data;}
function validSymbol(s){return /^[A-Z0-9]+USDT$/.test(String(s||'').toUpperCase())}
async function bybitUniverse(){
  const [tickerResponse,instrumentResponse]=await Promise.all([
    requestJson('/v5/market/tickers?category=linear'),
    (async()=>{
      const all=[]; let cursor='';
      for(let page=0;page<10;page++){
        const path='/v5/market/instruments-info?category=linear&limit=1000'+(cursor?'&cursor='+encodeURIComponent(cursor):'');
        const result=await requestJson(path);
        const payload=result.data.result||{}; all.push(...(payload.list||[]));
        cursor=payload.nextPageCursor||'';
        if(!cursor) return {data:result.data,host:result.host,all};
      }
      return {data:{result:{list:all}},host:API_HOSTS[0],all};
    })()
  ]);
  const instrumentList=instrumentResponse.all||((instrumentResponse.data.result||{}).list)||[];
  const eligible=new Set(instrumentList.filter(x=>x.status==='Trading'&&x.contractType==='LinearPerpetual'&&x.quoteCoin==='USDT'&&x.settleCoin==='USDT'&&validSymbol(x.symbol)).map(x=>x.symbol));
  const tickerList=((tickerResponse.data.result||{}).list)||[];
  const symbols=tickerList.filter(x=>eligible.has(x.symbol)&&Number(x.lastPrice)>0&&Number(x.turnover24h)>0).map(x=>({symbol:x.symbol,price:Number(x.lastPrice),changePct:Number(x.price24hPcnt)*100,turnover24h:Number(x.turnover24h)})).sort((a,b)=>b.turnover24h-a.turnover24h);
  if(!symbols.length)throw new Error('Bybit returned no eligible USDT linear perpetual instruments');
  return {provider:'Bybit V5 Linear Perpetual',apiHost:new URL(tickerResponse.host).hostname,instrumentCount:eligible.size,symbols};
}
async function bybitCandles(symbol,interval,limit){
  if(!INTERVALS.has(String(interval)))throw new Error('Unsupported Bybit interval');
  const raw=await getJson(`/v5/market/kline?category=linear&symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${Math.min(1000,Math.max(30,limit))}`);
  const list=((raw.result||{}).list)||[];
  const candles=list.map(x=>({t:Number(x[0]),o:Number(x[1]),h:Number(x[2]),l:Number(x[3]),c:Number(x[4]),v:Number(x[5]),turnover:Number(x[6])})).sort((a,b)=>a.t-b.t);
  if(!candles.length)throw new Error('Bybit returned no candles');
  return {provider:'Bybit V5 Linear Perpetual',candles};
}
module.exports=async function(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();if(req.method!=='GET')return json(res,405,{ok:false,error:'GET only'});
  const action=String(req.query.action||'');
  if(action==='health'){try{const result=await requestJson('/v5/market/time');return json(res,200,{ok:true,data:{provider:'Bybit V5 Public Market Data',apiHost:new URL(result.host).hostname,status:'reachable',checkedAt:new Date().toISOString(),marketDataOnly:true,orderExecution:false}})}catch(e){return json(res,502,{ok:false,error:'Bybit public market-data API is unreachable on all configured official hosts',attempts:e.attempts||[{provider:'Bybit V5',error:e.message}]})}}
  if(action==='universe'){try{return json(res,200,{ok:true,data:await bybitUniverse()})}catch(e){return json(res,502,{ok:false,error:'Failed to load Bybit USDT linear perpetual universe',attempts:e.attempts||[{provider:'Bybit V5',error:e.message}]})}}
  if(action==='candles'){const symbol=String(req.query.symbol||'').toUpperCase(),interval=String(req.query.interval||'15'),limit=Math.min(500,Math.max(30,Number(req.query.limit)||150));if(!validSymbol(symbol))return json(res,400,{ok:false,error:'Only normalized USDT symbols are accepted'});if(!INTERVALS.has(interval))return json(res,400,{ok:false,error:'Unsupported timeframe. Minimum allowed timeframe is M5 (5 minutes).'});try{const data=await bybitCandles(symbol,interval,limit);return json(res,200,{ok:true,data:{...data,symbol,interval}})}catch(e){return json(res,502,{ok:false,error:`Bybit candle request failed for ${symbol} ${interval}`,attempts:e.attempts||[{provider:'Bybit V5',error:e.message}]})}}
  return json(res,400,{ok:false,error:'Unknown action. Use action=health, universe, or candles.'});
};
