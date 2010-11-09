module PM::CouchdbCustomViews
  module Helpers
    class << self

      def key(rows);         rows.first.try(:[], 'key')                 end
      def keys(rows);        rows.map {|_| _['key'] }                   end

      def value(rows);       rows.first.try(:[], 'value')               end
      def values(rows);      rows.map {|_| _['value'] }                 end

      def key_value(rows);   rows.first.try(:values_at, 'key', 'value') end
      def key_values(rows);  rows.map {|_| [_['key'], _['value']] }     end

      # Returns an hash containing only the _id and _rev properties of a document
      #
      # This is used e.g. in remove_all_tags because, under the hood, CouchRest's
      # bulk_delete is an alias for bulk_save, because CouchDB works this way :-)
      #
      def id_of(doc)
        doc.reject {|k,| !k.starts_with? '_' }
      end

      def del(doc)
        id_of(doc).update('_deleted' => true)
      end

    end
  end
end
