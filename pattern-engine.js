(function(root){'use strict';
function atr(a,n=14){if(a.length<n+1)return NaN;const z=[];for(let i=1;i<a.length;i++)z.push(Math.max(a[i].h-a[i].l,Math.abs(a[i].h-a[i-1].c),Math.abs(a[i].l-a[i-1].c)));return z.slice(-n).reduce((x,y)=>x+y,0)/n}
function swings(a,k=2){const hi=[],lo=[];for(let i=k;i<a.length-k;i++){if(Array.from({length:k},(_,j)=>j+1).every(j=>a[i].h>a[i-j].h&&a[i].h>a[i+j].h))hi.push({i,p:a[i].h,t:a[i].t});if(Array.from({length:k},(_,j)=>j+1).every(j=>a[i].l<a[i-j].l&&a[i].l<a[i+j].l))lo.push({i,p:a[i].l,t:a[i].t})}return{hi,lo}}
function detect(a,pattern,opts={}){const last=a.at(-1),prev=a.at(-2),av=atr(a),sw=swings(a);if(!last||!prev||a.length<30||!Number.isFinite(av)||av<=0)return{status:'DATA_ERROR',direction:'NONE',reason:'Insufficient valid closed candles or ATR unavailable'};
 const oldHi=sw.hi.filter(x=>x.i<a.length-2).at(-1),oldLo=sw.lo.filter(x=>x.i<a.length-2).at(-1);
 // Liquidity sweeps can occur before the displacement candle; inspect the last four closed bars.
 let bullSweep=false,bearSweep=false;for(let j=Math.max(2,a.length-4);j<a.length;j++){const prefix=a.slice(0,j),ps=swings(prefix,2),ph=ps.hi.at(-1),pl=ps.lo.at(-1),c=a[j];if(pl&&c.l<pl.p&&c.c>pl.p)bullSweep=true;if(ph&&c.h>ph.p&&c.c<ph.p)bearSweep=true;}
 const bullDisp=last.c>last.o&&(last.c-last.o)>=.8*av,bearDisp=last.c<last.o&&(last.o-last.c)>=.8*av;
 const recent=a.slice(-20),rh=Math.max(...recent.map(c=>c.h)),rl=Math.min(...recent.map(c=>c.l)),mid=(rh+rl)/2,range=rh-rl;
 const lastBullBreak=!!oldHi&&last.c>oldHi.p, lastBearBreak=!!oldLo&&last.c<oldLo.p;
 const gapBull=a.length>=3&&a.at(-1).l>a.at(-3).h, gapBear=a.length>=3&&a.at(-1).h<a.at(-3).l;
 const bullish=(bullSweep&&bullDisp)||(bullDisp&&lastBullBreak)||(gapBull&&bullDisp),bearish=(bearSweep&&bearDisp)||(bearDisp&&lastBearBreak)||(gapBear&&bearDisp);
 let status='NO_MATCH',dir='NONE',reason='No pattern-specific candidate detected on the latest closed candle';
 const set=(d,s,r)=>{dir=d;status=s;reason=r};
 const sessionMin=(()=>{const d=new Date(last.t);return d.getUTCHours()*60+d.getUTCMinutes()})();
 const inSilver=(sessionMin>=13*60&&sessionMin<15*60)||(sessionMin>=18*60&&sessionMin<20*60);
 const inMacro=sessionMin>=9*60+50&&sessionMin<10*60+10;
 const compression=range<av*5, raids=(bullSweep||bearSweep), threeHi=sw.hi.slice(-3),threeLo=sw.lo.slice(-3);
 switch(pattern){
 case 'ICT 2022 Mentorship Model': if(bullSweep&&bullDisp&& (lastBullBreak||gapBull))set('BUY','FORMING','Sell-side sweep + bullish displacement; MSS/FVG chain still requires review');else if(bearSweep&&bearDisp&&(lastBearBreak||gapBear))set('SELL','FORMING','Buy-side sweep + bearish displacement; MSS/FVG chain still requires review');else reason='Requires liquidity event, displacement and structural/POI sequence';break;
 case 'Silver Bullet': if(inSilver&&(bullish||bearish))set(bullish?'BUY':'SELL','FORMING','UTC candidate window + displacement/structure; configured market timezone and FVG confirmation required');else reason=inSilver?'In candidate window but no displacement/structure trigger':'Outside default UTC candidate window; session timezone is not configured';break;
 case 'Standard Deviation Projection': {const leg=Math.abs(last.c-prev.c);if(leg>=av){set(last.c>prev.c?'BUY':'SELL','WATCH','Measured leg >= 1 ATR; provisional 1.0/1.5/2.0 deviation projection, not a confirmed setup')}else reason='No measurable impulse leg >= 1 ATR';break}
 case 'Sell Profile': if((bearish||bearSweep)&&last.c<mid)set('SELL','WATCH','Bearish price/profile candidate below recent range equilibrium; full session profile not confirmed');else reason='No bearish profile candidate';break;
 case 'Sell Profile London Delayed Protraction': if((bearish||bearSweep)&&last.c<mid&&sessionMin>=7*60)set('SELL','WATCH','Delayed bearish session candidate; exact London session/DST model requires configuration');else reason='Delayed bearish profile conditions not present';break;
 case 'SMT': status='SPECIFICATION_REQUIRED';reason='Requires synchronized second-symbol swings; single-symbol candles cannot prove SMT divergence';break;
 case 'Power of 3 (PO3)': if(compression&&bullSweep&&bullDisp)set('BUY','FORMING','Compression + sell-side raid + bullish displacement; distribution confirmation required');else if(compression&&bearSweep&&bearDisp)set('SELL','FORMING','Compression + buy-side raid + bearish displacement; distribution confirmation required');else reason='No complete compression/raid/displacement candidate';break;
 case '3 Drives Pattern': {const hs=threeHi,ls=threeLo;const highsDescending=hs.length===3&&hs[0].p<hs[1].p&&hs[1].p<hs[2].p,highsAscending=hs.length===3&&hs[0].p>hs[1].p&&hs[1].p>hs[2].p;const lowsDescending=ls.length===3&&ls[0].p<ls[1].p&&ls[1].p<ls[2].p,lowsAscending=ls.length===3&&ls[0].p>ls[1].p&&ls[1].p>ls[2].p;if((highsAscending||lowsAscending)&&bearish)set('SELL','FORMING','Three-drive extension candidate with bearish confirmation');else if((highsDescending||lowsDescending)&&bullish)set('BUY','FORMING','Three-drive extension candidate with bullish confirmation');else reason='Three-drive geometry and reversal confirmation not both present';break}
 case 'ATM Model': status='SPECIFICATION_REQUIRED';reason='Cheat sheet provides only a diagram; exact ATM entry/invalidity rules require authoritative operational definition';break;
 case 'MXMM': status='SPECIFICATION_REQUIRED';reason='Cheat sheet does not define MXMM acronym or executable rules; no invented signal emitted';break;
 case 'Seek and Destroy Profile': if(compression&& (bullSweep||bearSweep))set(bullSweep?'BUY':'SELL','WATCH','Compression with liquidity raid candidate; distribution/continuation not confirmed');else reason='No compression plus liquidity-raid candidate';break;
 case 'IDM': status='SPECIFICATION_REQUIRED';reason='IDM meaning varies by source; exact operational definition must be confirmed before signals';break;
 case '09:50–10:10 Macro': if(inMacro&&raids)set(bullSweep?'BUY':'SELL','FORMING','UTC 09:50–10:10 liquidity raid candidate; this is not proof of a macro event');else reason=inMacro?'Macro window active but no confirmed sweep':'Outside default UTC 09:50–10:10 window; timezone configurable in future';break;
 case 'NY Judas Swing': if((sessionMin>=13*60&&sessionMin<17*60)&&raids)set(bullSweep?'BUY':'SELL','FORMING','NY UTC window + sweep/reclaim candidate; timezone/DST and later reversal confirmation required');else reason='No sweep/reclaim in default UTC NY candidate window';break;
 case 'London Swing → NY Open/London Close Reversal': if(raids&&(sessionMin>=12*60&&sessionMin<20*60))set(bullSweep?'BUY':'SELL','WATCH','Session-window raid/reclaim candidate; London range reference not independently confirmed');else reason='No session-window reversal candidate';break;
 case 'Classic Buy or Sell Day Template': if(bullish)set('BUY','WATCH','Bullish daily directional candidate; full session sequence not confirmed');else if(bearish)set('SELL','WATCH','Bearish daily directional candidate; full session sequence not confirmed');else reason='No directional displacement/structure candidate';break;
 case 'Range → NY Open/London Close Rally': if(compression&&bullish)set('BUY','FORMING','Range + bullish displacement candidate; session-specific rally confirmation required');else if(compression&&bearish)set('SELL','FORMING','Range + bearish displacement candidate; session-specific rally confirmation required');else reason='No compressed range followed by directional displacement';break;
 case 'Consolidation Raid on News Release': if(compression&&raids)set(bullSweep?'BUY':'SELL','WATCH','Consolidation raid candidate; news calendar unavailable, no causal news attribution');else reason='No consolidation and liquidity-raid candidate';break;
 }
 return{status,direction:dir,reason,atr:av,rangeHigh:rh,rangeLow:rl,mid,liquidity:bullSweep?'SELL-SIDE SWEEP':bearSweep?'BUY-SIDE SWEEP':'NO CONFIRMED SWEEP',structure:lastBullBreak?'BULLISH BOS CANDIDATE':lastBearBreak?'BEARISH BOS CANDIDATE':bullDisp?'BULLISH DISPLACEMENT':bearDisp?'BEARISH DISPLACEMENT':'NO CONFIRMED BREAK',location:last.c<mid?'DISCOUNT':last.c>mid?'PREMIUM':'EQUILIBRIUM',eventTimestamp:last.t,confirmationTimestamp:last.t,entry:null,stopLoss:null,takeProfit:null,rr:null};}
function scoreCandidate(a,d){
 const last=a.at(-1),prev=a.at(-2),av=d.atr;if(!last||!prev||!Number.isFinite(av)||av<=0)return 0;
 const pivots=swings(a),oldHi=pivots.hi.filter(x=>x.i<a.length-2).at(-1),oldLo=pivots.lo.filter(x=>x.i<a.length-2).at(-1);
 const bull=d.direction==='BUY',bear=d.direction==='SELL';
 const sweepBars=a.slice(-4);let sweep=false;for(let k=0;k<sweepBars.length;k++){const j=a.length-sweepBars.length+k,prefix=a.slice(0,j),ps=swings(prefix,2),ph=ps.hi.at(-1),pl=ps.lo.at(-1),c=a[j];if(bull&&pl&&c.l<pl.p&&c.c>pl.p)sweep=true;if(bear&&ph&&c.h>ph.p&&c.c<ph.p)sweep=true;}
 const displacement=bull?(last.c>last.o&&(last.c-last.o)>=.8*av):(bear?(last.c<last.o&&(last.o-last.c)>=.8*av):false);
 const structure=bull?(!!oldHi&&last.c>oldHi.p):(bear?(!!oldLo&&last.c<oldLo.p):false);
 const fvg=bull?(a.length>=3&&last.l>a.at(-3).h):(bear?(a.length>=3&&last.h<a.at(-3).l):false);
 const candidate=['FORMING','WATCH'].includes(d.status)&&['BUY','SELL'].includes(d.direction);
 // Explicit evidence weights; the detector's prose is never used to compute the score.
 return Math.min(100,(candidate?25:0)+(sweep?25:0)+(displacement?20:0)+(structure?15:0)+(fvg?10:0)+(candidate&&((bull&&d.location==='DISCOUNT')||(bear&&d.location==='PREMIUM'))?5:0));
}

function validateOHLC(rows){if(!Array.isArray(rows)||rows.length<1)return {ok:false,reasonCodes:['INSUFFICIENT_CANDLES']};let prev=-Infinity;for(let i=0;i<rows.length;i++){const c=rows[i];if(!Number.isFinite(c.t)||c.t<=prev)return {ok:false,reasonCodes:['NON_CHRONOLOGICAL_OR_DUPLICATE_TIMESTAMP'],index:i};if(![c.o,c.h,c.l,c.c].every(Number.isFinite)||c.l>Math.min(c.o,c.c)||c.h<Math.max(c.o,c.c)||c.l>c.h)return {ok:false,reasonCodes:['INVALID_OHLC'],index:i};prev=c.t;}return {ok:true,reasonCodes:[]};}
const api={atr,swings,detect,scoreCandidate,validateOHLC};root.ICTPatternEngine=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
