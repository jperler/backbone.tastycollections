((func) ->
    # AMD definition
    if typeof define == 'function'
        define ['backbone'] , func
    # global definition
    else func Backbone
) (Backbone) ->

    class FilteredCollection extends Backbone.Collection
        initialize: (options = {}) ->
            @filters = {}
            @tastypieRelations = options.tastypieRelations
        getFilter: (attr) -> @filters[attr]
        getFilters: -> @filters
        addFilter: (attr, value) -> @filters[attr] = value
        addFilters: (filters) -> _.extend @filters, filters
        removeFilter: (attr) -> delete @filters[attr]
        updateKeys: ->
            _.each @filters, (f, k) =>
                if _.isArray(f) and f.length and k.indexOf('__in') < 0
                   @filters["#{ k }__in"] = @filters[k]
                   delete @filters[k]
        cleanFilters: ->
            _.each @filters, (f, k) =>
                if _.isArray(f) and not f.length then delete @filters[k]
                else if _.isUndefined(f) or _.isNull(f) then delete @filters[k]
        fetch: (options = {}) ->
            defaults =
                traditional: true
                # without resetting the collections, order is not maintained if
                # we are relying on the order coming from tastypie
                reset: true
            @cleanFilters()
            if @tastypieRelations then @updateKeys()
            if not options.data then options.data = {}
            _.extend options.data, @getFilters()
            options = _.extend defaults, options
            Backbone.Collection.prototype.fetch.call @, options

    class PaginatedCollection extends FilteredCollection
        initialize: ->
            super
            @limit = 10
            @current_page = 1
            @display_pages = 5

        addFilters: (filters) ->
            super
            if filters.limit then @limit = filters.limit
            if filters.offset then @offset = filters.offset
            # set current page as an ovveride to the initialize'd current page
            if filters.offset then @current_page = (@offset + @limit) / @limit

        parse: (response) ->
            @total_records = response.meta.total_count
            @total_pages = Math.ceil @total_records / @limit
            response.objects

        info: ->
            has_next: @hasNext()
            has_prev: @hasPrev()
            current_page: @current_page
            total_pages: @total_pages
            total_records: @total_records
            limit: @limit
            page_range: do =>
                start = do =>
                    if @current_page - @display_pages > 0
                        @current_page - @display_pages
                    else 1
                end = do =>
                    if @current_page + @display_pages < @total_pages
                        @current_page + @display_pages
                    else @total_pages
                _.range start, end + 1

        getFilters: ->
            @addFilters @paginatedFilters()
            @filters

        paginatedFilters: ->
            limit: @limit
            offset: (@current_page - 1) * @limit

        hasNext: -> @current_page < @total_pages
        hasPrev: -> @current_page > 1
        nextPage: -> if @hasNext() then @current_page++
        prevPage: -> if @hasPrev() then @current_page--
        goTo: (page) -> @current_page = page
        setLimit: (limit) -> @limit = limit

    Backbone.Tastycollections =
        FilteredCollection: FilteredCollection
        PaginatedCollection: PaginatedCollection
