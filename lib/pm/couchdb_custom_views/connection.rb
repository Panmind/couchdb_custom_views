require 'pm/couchdb_custom_views/helpers'

module PM::CouchdbCustomViews
  module Connection
    # Connects to the database referenced by the given URI or
    # returns the connected instance if no URI is given.
    #
    def database(uri = nil)
      return @@db if defined?(@@db)

      if uri
        uri  = ::URI.parse(uri).to_s
        @@db = ::CouchRest.database!(uri)
        @@db.info

        if Rails.env.test? || Rails.env.cucumber?
          # Recreate test database
          couch_conn_log "Dropping and recreating #{@@db.name}"

          @@db.delete!
          @@db = CouchRest.database!(uri)
        end
      end

      couch_error "No Database URI defined for #{self.name}" unless defined?(@@db)

    rescue Errno::ECONNREFUSED => e
      couch_error e.message
    end

    def rows_of(name, options = {})
      database.view(name, options)['rows']
    end

    def couch_helper
      Helpers
    end

    protected
      def couch_error(message)
        uri = " [#{@@db.root}]" rescue nil
        raise RuntimeError, "CouchDB#{uri}: #{message}"
      end

    private
      def couch_conn_log(message, level = :info)
        couch_log(database.root, message, level)
      end

      def couch_doc_log(action, *documents)
        documents.flatten.each { |document| couch_log(action, document.inspect) }
      end

      def couch_log(pfx, message, level = :debug)
        return unless Rails.logger.send("#{level}?")
        Rails.logger.send(level) {"  \e[4;34;1mCouchDB #{pfx}\e[0m     #{message} "}
      end

      module DSL
        # Generates a method named +name+ that calls the given +view+ with the
        # given +options+. The generated method is then attached to the model
        # on which the plugin is applied, either in the class or instance context.
        #
        # The given block is evaluated within the model context (either class or
        # instance), every time the generated method is called. This makes possible
        # to refer to instance methods in the block, such as .id, and add these
        # values in the options hash passed to CouchDB.
        #
        # If the block specifies a fixed number of arguments (e.g. not *args), its
        # arity is checked against the given arguments, mimicking Ruby's builtin
        # ones, to aid debugging.
        #
        def couch_api(name, view, options = {}, &block)
          helper = Helpers.method(options.delete(:fetch) || :values)
          empty  = options.delete(:nil)

          options.freeze # To be extra-sure

          # This method is defined INSIDE the model!
          #
          if block
            define_method(name) { |*args|
              if block.arity >= 0 && args.size != block.arity
                raise ArgumentError,
                  "wrong number of arguments (#{args.size} for #{block.arity})",
                  caller(2)
              end

              opts = options.merge(instance_exec(*args, &block))
              ret  = helper.call(rows_of(view, opts))
              ret.nil? ? empty : ret
            }
          else
            define_method(name) { |*args|
              ret = helper.call(rows_of(view, options.dup))
              ret.nil? ? empty : ret
            }
          end
        end
      end
  end

end
