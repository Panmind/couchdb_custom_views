// Panmind Pridoli - (C) 2010 Mind2Mind S.r.l
//
// -*- CouchDB Reduce Function -*-
//
// == Description ==
//
// This function reduces a dataset mapped as follows:
//
// [ {kind: 'a', item: 1}, {kind: 'b', item: 2}, ...]
//
// to a dictionary (Object) keyed by "kind", whose values
// are lists (Array) containing the "item" values of a
// "kind".
//
function (keys, values, rereduce) {
  var items = {}

  if (rereduce == false) {
    for (var i = 0; i < values.length; ++i)
      if (!items[values[i].kind])
        items[values[i].kind] = [values[i].item]
      else
        items[values[i].kind].push (values[i].item)

  } else {
    // [ {a: [1,2,3], b: [3,4,5]}, {a: [5,6,7], c: [8,9,10]} ]
    //
    for (var i = 0; i < values.length; ++i)
      for (var j in values[i])
        if (!items[j])
          items[j] = values[i][j]
        else
          items[j].concat (values[i][j])
  }

  return items
}
