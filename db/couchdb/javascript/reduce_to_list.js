// Panmind Pridoli - (C) 2010 Mind2Mind S.r.l
//
// -*- CouchDB Reduce Function -*-
//
// == Description ==
//
// This function reduces a mapped dataset to a list (Array)
// containing every *unique* value produced by the map.
//
// At the beginnging, an hash is used for fast lookup of yet
// processed strings, in order to avoid the slow string matches
// implied by the use of Array.indexOf (string).
//
// == Detailed explanation ==
//
// Please see the "reduce_to_hash.js" source, because it contains an
// extensive example to understand the data flow between functions,
// and the successive steps that the database performs.
//
//  - vjt  Sat Jan 23 16:27:26 CET 2010
//
function (keys, values, rereduce) {
  var hash = {}

  if (rereduce == false) {
    // Reduce case:
    //
    // [ 'foo', 'bar', 'bar', 'baz' ] -> { 'foo':true, 'bar':true, 'baz':true }
    // [ 'bar', 'bar', 'baz', 'yay' ] -> { 'bar':true, 'baz':true }
    //
    for (var i = 0; i < values.length; ++i)
      hash[values[i]] = true;

  } else {
    // Rereduce case:
    //
    // [ [ 'foo', 'bar', 'baz' ], [ 'bar', 'baz' ] ]
    // ->
    // { 'foo':true, 'bar':true, 'baz':true }
    //
    for (var i = 0; i < values.length; ++i)
      for (var j = 0; j < values[i].length; ++j)
        hash[values[i][j]] = true
  }

  // Each hash key holds a tag, all of them are flattened into an array.
  //
  // { 'foo':true, 'bar':true, 'baz':true } -> [ 'foo', 'bar', 'baz' ]
  //
  var list = []

  for (var key in hash)
    list.push (key)

  return list
}
