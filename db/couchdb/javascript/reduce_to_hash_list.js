// Panmind Pridoli - (C) 2010 Mind2Mind S.r.l
//
// -*- CouchDB Reduce Function -*-
//
// == Description ==
//
// This function reduces a mapped dataset to a dictionary (Object)
// keyed by string, values are lists (Array) containing all the keys
// for which the value was generated.
//
// == Detailed explanation ==
//
// Please see the "reduce_to_hash.js" source, because it contains an
// extensive example to understand the data flow between functions,
// and the successive steps that the database performs.
//
//  - vjt  Sat Jan 23 16:32:18 CET 2010
//
function (keys, values, rereduce) {
  var hash_list = {}

  if (rereduce == false) {

    for (var i = 0; i < values.length; ++i)
      if (!hash_list[values[i]])
        hash_list[values[i]] = [keys[i][0]];
      else
        hash_list[values[i]].push (keys[i][0]);

  } else {

    for (var i = 0; i < values.length; ++i)
      for (var j in values[i])
        if (!hash_list[j])
          hash_list[j] = [values[i][j]]
        else
          hash_list[j].push (values[i][j])

  }

  return hash_list
}
