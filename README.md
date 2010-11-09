CouchDB Custom Views
====================

This code, extracted from an April 2010 version of http://panmind.org/
contains a CouchRest extension to map a database view to a Ruby method
with the minimum overhead possible, moving all calculations into the
CouchDB.

The code contains also routines for loading and upgrading design docs,
the views we used when ReS were implemented on CouchDB and some reusable
javascript methods with *extensive* documentation on the code flow from
and to the Javascript view server.

The Ruby code is in `lib/`, views in `db/couchdb` and reusable JS
functions in `db/couchdb/javascript`.

If you happen to use this code for your project, please give feedback!

Happy coding,

      -- the Panmind team
