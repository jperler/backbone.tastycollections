(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(func) {
    if (typeof define === 'function') {
      return define(['backbone'], func);
    } else {
      return func(Backbone);
    }
  })(function(Backbone) {
    var FilteredCollection, PaginatedCollection;
    FilteredCollection = (function(_super) {
      __extends(FilteredCollection, _super);

      function FilteredCollection() {
        return FilteredCollection.__super__.constructor.apply(this, arguments);
      }

      FilteredCollection.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.filters = {};
        return this.tastypieRelations = options.tastypieRelations;
      };

      FilteredCollection.prototype.getFilter = function(attr) {
        return this.filters[attr];
      };

      FilteredCollection.prototype.getFilters = function() {
        return this.filters;
      };

      FilteredCollection.prototype.addFilter = function(attr, value) {
        return this.filters[attr] = value;
      };

      FilteredCollection.prototype.addFilters = function(filters) {
        return _.extend(this.filters, filters);
      };

      FilteredCollection.prototype.removeFilter = function(attr) {
        return delete this.filters[attr];
      };

      FilteredCollection.prototype.updateKeys = function() {
        return _.each(this.filters, (function(_this) {
          return function(f, k) {
            if (_.isArray(f) && f.length && k.indexOf('__in') < 0) {
              _this.filters["" + k + "__in"] = _this.filters[k];
              return delete _this.filters[k];
            }
          };
        })(this));
      };

      FilteredCollection.prototype.cleanFilters = function() {
        return _.each(this.filters, (function(_this) {
          return function(f, k) {
            if (_.isArray(f) && !f.length) {
              return delete _this.filters[k];
            } else if (_.isUndefined(f) || _.isNull(f)) {
              return delete _this.filters[k];
            }
          };
        })(this));
      };

      FilteredCollection.prototype.fetch = function(options) {
        if (options == null) {
          options = {};
        }
        this.cleanFilters();
        if (this.tastypieRelations) {
          this.updateKeys();
        }
        options.traditional = true;
        options.reset = true;
        if (!options.data) {
          options.data = {};
        }
        _.extend(options.data, this.getFilters());
        return Backbone.Collection.prototype.fetch.call(this, options);
      };

      return FilteredCollection;

    })(Backbone.Collection);
    PaginatedCollection = (function(_super) {
      __extends(PaginatedCollection, _super);

      function PaginatedCollection() {
        return PaginatedCollection.__super__.constructor.apply(this, arguments);
      }

      PaginatedCollection.prototype.initialize = function() {
        PaginatedCollection.__super__.initialize.apply(this, arguments);
        this.limit = 10;
        this.current_page = 1;
        return this.display_pages = 5;
      };

      PaginatedCollection.prototype.addFilters = function(filters) {
        PaginatedCollection.__super__.addFilters.apply(this, arguments);
        if (filters.limit) {
          this.limit = filters.limit;
        }
        if (filters.offset) {
          this.offset = filters.offset;
        }
        if (filters.offset) {
          return this.current_page = (this.offset + this.limit) / this.limit;
        }
      };

      PaginatedCollection.prototype.parse = function(response) {
        this.total_records = response.meta.total_count;
        this.total_pages = Math.ceil(this.total_records / this.limit);
        return response.objects;
      };

      PaginatedCollection.prototype.info = function() {
        return {
          has_next: this.hasNext(),
          has_prev: this.hasPrev(),
          current_page: this.current_page,
          total_pages: this.total_pages,
          total_records: this.total_records,
          limit: this.limit,
          page_range: (function(_this) {
            return function() {
              var end, start;
              start = (function() {
                if (_this.current_page - _this.display_pages > 0) {
                  return _this.current_page - _this.display_pages;
                } else {
                  return 1;
                }
              })();
              end = (function() {
                if (_this.current_page + _this.display_pages < _this.total_pages) {
                  return _this.current_page + _this.display_pages;
                } else {
                  return _this.total_pages;
                }
              })();
              return _.range(start, end + 1);
            };
          })(this)()
        };
      };

      PaginatedCollection.prototype.getFilters = function() {
        this.addFilters(this.paginatedFilters());
        return this.filters;
      };

      PaginatedCollection.prototype.paginatedFilters = function() {
        return {
          limit: this.limit,
          offset: (this.current_page - 1) * this.limit
        };
      };

      PaginatedCollection.prototype.hasNext = function() {
        return this.current_page < this.total_pages;
      };

      PaginatedCollection.prototype.hasPrev = function() {
        return this.current_page > 1;
      };

      PaginatedCollection.prototype.nextPage = function() {
        if (this.hasNext()) {
          return this.current_page++;
        }
      };

      PaginatedCollection.prototype.prevPage = function() {
        if (this.hasPrev()) {
          return this.current_page--;
        }
      };

      PaginatedCollection.prototype.goTo = function(page) {
        return this.current_page = page;
      };

      PaginatedCollection.prototype.setLimit = function(limit) {
        return this.limit = limit;
      };

      return PaginatedCollection;

    })(FilteredCollection);
    return Backbone.Tastycollections = {
      FilteredCollection: FilteredCollection,
      PaginatedCollection: PaginatedCollection
    };
  });

}).call(this);
