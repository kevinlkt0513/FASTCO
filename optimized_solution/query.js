// Solution 2: Optimized Query
// Uses the specialized `autocomplete` operator and moves the `sort` operation inside the $search stage.

db.users.aggregate([
    {
      $search: {
        index: "giggers_full_text_search_edit",
        // Optimization 1: Move sort inside $search for better performance
        sort: { "name": 1 }, 
        compound: {
          filter: [
            { equals: { path: "country", value: "SG" } }
          ],
          // Use the 'should' clause to perform an OR search across multiple fields
          should: [
            {
              autocomplete: {
                path: "name",
                query: "S",
                fuzzy: {
                  maxEdits: 1,
                  // Optimization 2: Add prefixLength to improve relevance
                  prefixLength: 1 
                }
              }
            },
            {
              autocomplete: {
                path: "email",
                query: "S",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 1
                }
              }
            },
            {
              autocomplete: {
                path: "mobile_no",
                query: "S",
                fuzzy: {
                  maxEdits: 1,
                  prefixLength: 1
                }
              }
            }
          ],
          minimumShouldMatch: 1 
        }
      }
    },
    // The separate $sort stage is removed because sorting is now handled within $search
    {
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [{ $skip: 0 }, { $limit: 20 }]
      }
    }
  ])