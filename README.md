# backbone.tastycollections

Lightweight pagination and filter collections that play nicely with Backbone.js &amp; Tastypie


## Installation
---
### AMD
```
define(['backbone.tastycollections', 'backbone'], function (Backbone) {
    var FilteredCollection = Backbone.Tastycollections.FilteredCollection,
        PaginatedCollection = Backbone.Tastycollections.PaginatedCollection;
});
```

Or you can go the regular route of including the backbone.tastycollection.js file as a script, works both ways.

## Documentation

### Backbone.Tastycollections.FilteredCollection
---

#### Constructor Options
##### tastypieRelations (default false)
If tastypieRelations is set to true, it will update filters which values are arrays. Instead of passing multiple filters and their values, it will update the key to <filter>__in and pass the filter's values in an array.

Here's how it would show up in the request data:

```
?title=titleA&title=titleB&title=titleC <-- tastypieRelations = false
?title__in=[titleA,titleB,titleC] <-- tastypieRelations = true
```

#### FilteredCollection.getFilter(attr)
Returns the filter for the given attribute.

#### FilteredCollection.getFilters()
Returns an object containing all of the collection's filters.

#### FilteredCollection.addFilter(attr, value)
Adds a filter to the collection.

#### FilteredCollection.addFilters(filters)
Adds multiple filters to the collection.

#### FilteredCollection.removeFilter(attr)
Removes a filter from the collection.

#### FilteredCollection.fetch()
A typical Backbone.Collection fetch method with the addition of automatically passing the filters.

### Backbone.Tastycollections.PaginatedCollection
---
PaginatedCollection is an extension of the FilteredCollection, so all of the methods above work just the same. One thing to keep in mind, when changing the collection's page, updating the limit or adding filters, the collection must be fetched manually. Other libraries like to bundle in fetching to these methods, but I find it to be more flexible by having this functionality separate.

e.g.

```
var collection = new Backbone.Tastycollections.PaginatedCollection({
    tastypieRelations: true
});
collection.setLimit(5);
collection.addFilters({
    title: 'Title',
    sort: 'asc'
});
colllection.goTo(5);
collection.fetch();
```

#### PaginatedCollection.info()
Returns an object containing all necessary context to render a pager view.

```
{
    has_next: true,
    has_prev: false,
    current_page: 1,
    total_pages: 2,
    total_records: 8,
    limit: 5,
    page_range: [1,2]
}
```
#### PaginatedCollection.hasNext()
Returns a bool indicating whether or not there is a next page of results.

#### PaginatedCollection.hasPrev()
Returns a bool indicating whether or not there is a previous page of results.

#### PaginatedCollection.nextPage()
Sets the collection to its next page.

#### PaginatedCollection.prevPage()
Sets the collection to its previous page.

#### PaginatedCollection.goTo(page)
Sets the collection to a given page.

#### PaginatedCollection.setLimit(limit)
Sets the limit to a given limit.
