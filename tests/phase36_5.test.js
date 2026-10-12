const fs=require('fs'),assert=require('assert');
const root=__dirname+'/..',app=fs.readFileSync(root+'/app.js','utf8'),html=fs.readFileSync(root+'/index.html','utf8');
assert(app.includes('Math.max(29,maxEnd-9)'),'Must evaluate latest 10 eligible candle endpoints');
assert(app.includes('setTimeout(()=>scan(true),60000)'),'Continuous scan must refresh every 60 seconds');
assert(app.includes("state.auto=true;clearTimeout(state.timer)"),'Starting scan must enable continuous mode');
assert(app.includes('state.auto=false;clearTimeout(state.timer)'),'Stop/pause must cancel scheduled refresh');
assert(app.includes('new AbortController()')&&app.includes('state.controller.abort()'),'Current scan cancellation must remain available');
assert(html.includes('Continuous Scan')&&html.includes('setiap 60 detik'),'UI must explain rolling scan and refresh cadence');
console.log('PASS Phase 36.5 static tests: rolling 10 endpoints, 60-second continuous refresh, pause/stop cancellation, UI copy. Live market and browser automation not tested.');
