const assert=require('assert');
const core=require('../checker-core.js');
const fixtures=require('./ohlc-fixtures.js');
for(const f of fixtures){const actual=core.validateOHLC(f.candles);assert.strictEqual(actual.ok,f.expected.ok, f.fixtureId);if(!f.expected.ok)assert.strictEqual(actual.reasonCodes[0],f.expected.reason,f.fixtureId+' reason');}
const good=core.validateOHLC([{t:1,o:10,h:12,l:9,c:11},{t:2,o:11,h:13,l:10,c:12}]);assert.strictEqual(good.ok,true);
console.log('PASS Phase 36.2 OHLC integrity fixtures: '+fixtures.length+' fixtures. These are data-validation tests, not pattern-detector accuracy tests.');
