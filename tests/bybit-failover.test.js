const assert=require('assert');
const handler=require('../api/market.js');
async function call(query){let status=200,body;const res={setHeader(){},status(n){status=n;return this},json(x){body=x;return this},end(){return this}};await handler({method:'GET',query},res);return{status,body}}
(async()=>{
  let seen=[];
  global.fetch=async url=>{url=String(url);seen.push(url);if(url.startsWith('https://api.bybit.com'))return new Response('<html>blocked upstream</html>',{status:403,headers:{'content-type':'text/html'}});if(url.startsWith('https://api.bytick.com'))return new Response(JSON.stringify({retCode:0,retMsg:'OK',result:{timeSecond:'1700000000'}}),{status:200});throw new Error('unexpected host '+url)};
  const r=await call({action:'health'});
  assert.equal(r.status,200);assert.equal(r.body.data.apiHost,'api.bytick.com');assert.equal(seen.length,2);assert(seen[0].startsWith('https://api.bybit.com'));assert(seen[1].startsWith('https://api.bytick.com'));
  console.log('PASS: 403 HTML from primary host automatically fails over to official Bytick host.');
})().catch(e=>{console.error(e);process.exit(1)});
