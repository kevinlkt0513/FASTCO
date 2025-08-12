// Solution 1: Original Query
// Uses the `wildcard` operator for prefix matching and a separate $sort stage for ordering.

db.users.aggregate([
    {
      $search: {
        index: "giggers_full_text_search",
        compound: {
          filter: [
            { equals: { path: "country", value: "SG" } }
          ],
          should: [
            { compound: { must: [{ wildcard: { query: "S*", path: "name", allowAnalyzedField: true } }] } },
            { compound: { must: [{ wildcard: { query: "S*", path: "email", allowAnalyzedField: true } }] } },
            { compound: { must: [{ wildcard: { query: "S*", path: "mobile_no", allowAnalyzedField: true } }] } }
          ],
          minimumShouldMatch: 1
        }
      }
    },
    { $sort: { name: 1 } },
    {
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [{ $skip: 0 }, { $limit: 20 }]
      }
    }
  ])