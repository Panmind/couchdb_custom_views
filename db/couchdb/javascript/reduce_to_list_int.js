// Panmind Pridoli - (C) 2010 Mind2Mind S.r.l
//
// -*- CouchDB Reduce Function -*-
//
// == Description ==
//
// This function reduces a mapped dataset to a list (Array)
// containing every *unique* value produced by the map.
//
// It differs from the reduce_to_list.js because it is supposed
// to be used on lists of integers, where the Array.indexof ()
// overhead is small because it is an integer comparison.
//
// If you plan returning list of strings, you'd better use the
// optimized reduce_to_list.js function.
//
// == Detailed explanation ==
//
// Please see the "reduce_to_hash.js" source, because it contains an
// extensive example to understand the data flow between functions,
// and the successive steps that the database performs.
//
//  - vjt  Sat Jan 23 16:37:56 CET 2010
//
function (keys, values, rereduce) {
  var targets = []

  if (rereduce == false) {

    for (var i = 0; i < values.length; ++i)
      if (targets.indexOf (values[i]) == -1)
        targets.push (values[i])


  } else {

    for (var i = 0; i < values.length; ++i)
      for (var j = 0; j < values[i].length; ++j)
        if (targets.indexOf (values[i][j]) == -1)
          targets.push (values[i][j])
  }

  return targets
}
