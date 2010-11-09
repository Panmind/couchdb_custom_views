require 'couchrest'
require 'uri'
require 'digest/sha1'

module PM::CouchdbCustomViews
  module DesignDocument

    def document(*names)
      names.each {|name| install_document(name)}
    end

    private
      def install_document(name)
        src  = File.read(Rails.root.join('db', 'couchdb', "#{name}.yml"))
        doc  = parse_document(src)
        key  = doc['_id']
        curr = database.get(key) rescue nil

        if curr.nil?
          couch_conn_log "Creating document #{key}"
          database.save_doc(doc)

        elsif curr['ver'].nil? or curr['ver'] != doc['ver']
          couch_conn_log "Upgrading document #{key} from version #{curr['ver']} to #{doc['ver']}"
          database.delete_doc(curr)
          database.save_doc(doc)
        end

      rescue StandardError => e
        couch_error "Fatal: #{e.message}"
      rescue RestClient::Exception => e
        couch_error "#{e.class.name}: #{e.message}"
      end

      def parse_document(source)
        doc   = YAML.load(source)
        views = doc['views']

        # Update version with function sources hash
        doc['ver'] = "#{doc['ver']}-f#{function_sources_hash}"

        # Load function sources
        views.each_pair do |view, functions|
          functions.each_pair do |func, code|
            if code.kind_of?(Symbol)
              views[view][func] = function_sources[code]
            end

            if views[view][func].blank?
              couch_error "No function body defined for #{view}/#{func} [#{code}]"
            end
          end
        end

        return doc
      end

      def function_sources
        @@function_sources ||= begin
          base_dir = Rails.root.join('db', 'couchdb', 'javascript')
          Dir[(base_dir + '*.js').to_s].reduce({}) do |h, src|
            h.update(File.basename(src, '.js').to_sym => read_source(src))
          end
        end
      end

      def read_source(src)
        File.read(src).gsub(/^ *\/\/.*\n/, '')
      end

      def function_sources_hash
        @@function_sources_hash ||= Digest::SHA1.hexdigest(function_sources.values.sort.join)[0, 10]
      end

  end
end
