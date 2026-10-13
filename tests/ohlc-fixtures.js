'use strict';
// Deterministic data-integrity fixtures. These validate the market-data contract, not ICT pattern accuracy.
const core=require('../checker-core.js');
const valid=core.buildFixture('OHLC_VALID_CHRONOLOGICAL',[{t:1000,o:10,h:12,l:9,c:11},{t:2000,o:11,h:13,l:10,c:12}],{ok:true},'Chronological valid OHLC');
const badRange=core.buildFixture('OHLC_INVALID_RANGE',[{t:1000,o:10,h:8,l:9,c:10}],{ok:false,reason:'INVALID_OHLC'},'High below open/close');
const duplicate=core.buildFixture('OHLC_DUPLICATE_TIMESTAMP',[{t:1000,o:10,h:12,l:9,c:11},{t:1000,o:11,h:13,l:10,c:12}],{ok:false,reason:'NON_CHRONOLOGICAL_OR_DUPLICATE_TIMESTAMP'},'Duplicate timestamp');
const reversed=core.buildFixture('OHLC_REVERSED_TIME',[{t:2000,o:10,h:12,l:9,c:11},{t:1000,o:11,h:13,l:10,c:12}],{ok:false,reason:'NON_CHRONOLOGICAL_OR_DUPLICATE_TIMESTAMP'},'Non chronological candles');
const insufficient=core.buildFixture('OHLC_INSUFFICIENT',[],{ok:false,reason:'INSUFFICIENT_CANDLES'},'Empty candle series');
module.exports=[valid,badRange,duplicate,reversed,insufficient];
