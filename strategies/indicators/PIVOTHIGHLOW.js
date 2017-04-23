var log = require('../../core/log');
var _ = require('underscore');

var Indicator = function(settings) {
  this.history = [];
  this.currentPivotHigh = null;
  this.currentPivotLow = null;

  this.candlesBeforePivot = settings.candlesBeforePivot;
  this.candlesAfterPivot = settings.candlesAfterPivot;
  this.minimumHistoryNeeded = this.candlesBeforePivot + this.candlesAfterPivot;
  
  this.age = 0;

  this.result = false;
}

Indicator.prototype.update = function(candle) {
  this.history.push({high: candle.high, low: candle.low});
  if(this.history.length > this.minimumHistoryNeeded) {
    this.history.shift();
  } 

  this.age++;

  if(this.age >= this.minimumHistoryNeeded) 
    this.calculate();

  return this.result;
}

Indicator.prototype.calculate = function() {
  // If 3 candles before Pivot we will studied the 4th element in the array and check if it is a max/min in the array to determine if it is a Pivot high / low
  // So if we have a candlesBeforePivot set to 3, we will need to study the 4th element of the array, which is located at the index 3
  var studiedCandle = this.history[this.candlesBeforePivot];

  var currentHistoryMaxHigh = _.max(this.history, function(candle) { return candle.high; });
  var currentHistoryMinLow = _.min(this.history, function(candle) { return candle.low; });
  
  var isPivotHigh = studiedCandle.high >= currentHistoryMaxHigh;
  var isPivotLow = studiedCandle.low <= currentHistoryMinLow;

  var result = {isPivotHigh: isPivotHigh, isPivotLow: isPivotLow};

  log.write('Calculated Pivot high/low data for history:');
  log.write('\t', this.history);
  log.write('\t', result)

  this.result = result;
}

module.exports = Indicator;