// Panmind Pridoli - (C) 2010 Mind2Mind S.r.l
//
// -*- CouchDB Reduce Function -*-
//
// == Description ==
//
// This function reduces a mapped dataset to a dictionary (Object)
// keyed by string, values are integers representing how many times
// the key occurs in the dataset.
//
// == Input and output ==
//
// The first argument, "keys", contains arrays in the form [a, b],
// where "a" is a key emitted by the map function, and "b" is the
// CouchDB id of the document from which the key was generateyay:
//
//   [ [ 1, $id ], [ 1, $id ], [ 1, $id ],
//     [ 2, $id ], [ 2, $id ], [ 2, $id ] ]
//
// The second argument, "values", is an array of the values emitted for
// the respective elements in "keys":
//
//   [ 'foo', 'bar', 'baz', 'a', 'c', 'yay' ]
//
// == Re-reduce ==
//
// This whole dataset could be splitted in partitions, each one passed
// to a different process or server. Each intermediate result is then
// passed to the reduce function again, triggering a re-reduce.
//
// == Example ==
//
// Let's assume that from a dataset, map emitted six tuples whose first
// element is the item id, and the second one is an associated tag.  If
// we have two items (with ID 1 and 2), the first one tagged with "foo",
// "bar" and "baz" and the second one tagged with "foo" "baz" and "yay",
// the map () would have emitted the following output:
//
// [ [ 1, 'foo' ], [ 1, 'bar' ], [ 1, 'baz' ],
//   [ 2, 'foo' ], [ 2, 'baz' ], [ 2, 'yay' ] ]
//
// For the sake of this example, we assume it has been splitted into two
// arrays of 3 items each.
//
//  - vjt  Sat Jan 23 16:27:42 CET 2010
//
function (keys, values, rereduce) {
  var hash = {}

  if (rereduce == false) {

    // Reduce case: "values" holds an array of tags, the number of
    // occurrences of a tag in the array represents how many times
    // that tag was applied. The calculated output is a dictionary
    // keyed by tag and whose values are the number of occurrences
    //
    // P1: [ 'foo', 'bar', 'baz' ] -> { foo: 1, bar: 1, baz: 1 }
    // P2: [ 'foo', 'baz', 'yay' ] -> { foo: 1, baz: 1, yay: 1 }
    //
    for (var i = 0; i < values.length; ++i)
      if (hash[values[i]])
        hash[values[i]]++
      else
        hash[values[i]] = 1

  } else {

    // Rereduce case: "values" holds an array of hashes, reduced
    // by the following code into a single one.
    //
    // [ { foo: 1, bar: 1, baz: 1 }, { foo: 1, baz: 1, yay: 1 } ]
    // ->
    // { foo: 2, bar: 1, baz: 1, yay: 1 }
    //
    for (var i = 0; i < values.length; ++i)
      for (var j in values[i])
        if (hash[j])
          hash[j] += values[i][j]
        else
          hash[j] = values[i][j]
  }

  return hash;
}
