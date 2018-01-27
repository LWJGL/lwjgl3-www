'use strict';
const Benchmark = require('benchmark');

const { cc } = require('../../client/theme/cc');

new Benchmark.Suite()
  .add('cc', () => cc('one', 'two', 'three'))
  // add listeners
  .on('cycle', ({ target: { name, hz, stats } }) => {
    console.log(`${name} × ${Math.floor(hz).toLocaleString()} ops/sec`);
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ async: true });
