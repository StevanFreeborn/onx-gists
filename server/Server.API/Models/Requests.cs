
namespace Server.API.Models;

record GetGistRequest(
  HttpContext Context,
  [FromRoute] string Id,
  [FromServices] IGistRepository Repository
);

record GetGistsRequest(
  HttpContext Context,
  GistsFilter Filter,
  [FromServices] IGistRepository Repository
);

record GistsFilter
{
  public string UserId { get; init; } = string.Empty;
  public int PageNumber { get; init; } = 1;
  public int PageSize { get; init; } = 10;
  public bool IncludePrivate { get; init; } = false;
  public bool IncludePublic { get; init; } = true;
  public string SearchTerm { get; init; } = string.Empty;
  public string SortBy { get; init; } = string.Empty;
  public string SortDirection { get; init; } = string.Empty;

  public static async ValueTask<GistsFilter> BindAsync(HttpContext context, ParameterInfo parameter)
  {
    var query = context.Request.Query;
    var userId = query.TryGetValue("userId", out var id) ? id.ToString() : string.Empty;
    var pageNumber = query.TryGetValue("pageNumber", out var pn) && int.TryParse(pn.ToString(), out var parsedPN)
      ? parsedPN
      : 1;

    var pageSize = query.TryGetValue("pageSize", out var ps) && int.TryParse(ps.ToString(), out var parsedPS)
      ? parsedPS
      : 10;

    var includePrivate = query.TryGetValue("includePrivate", out var ip)
      ? bool.TryParse(ip.ToString(), out var parsedIP) && parsedIP
      : false;

    var includePublic = query.TryGetValue("includePublic", out var iPU)
      ? bool.TryParse(iPU.ToString(), out var parsedIPU) && parsedIPU
      : false;

    var searchTerm = query.TryGetValue("searchTerm", out var term) ? term.ToString() : string.Empty;

    var sortBy = query.TryGetValue("sort", out var sort)
      ? sort.ToString()
      : "created";

    var sortDirection = query.TryGetValue("direction", out var sortDir)
      ? sortDir.ToString()
      : "desc";

    var filter = new GistsFilter
    {
      UserId = userId,
      PageNumber = pageNumber,
      PageSize = pageSize,
      IncludePrivate = includePrivate,
      IncludePublic = includePublic,
      SearchTerm = searchTerm,
      SortBy = sortBy,
      SortDirection = sortDirection
    };

    return await ValueTask.FromResult(filter);
  }

  internal FilterDefinition<Gist> ToFilterDefinition()
  {
    var filter = Builders<Gist>.Filter.Empty;

    if (IncludePublic is false)
    {
      filter &= Builders<Gist>.Filter.Ne(gist => gist.Visibility, "public");
    }

    if (IncludePrivate is false)
    {
      filter &= Builders<Gist>.Filter.Ne(gist => gist.Visibility, "private");
    }

    if (string.IsNullOrWhiteSpace(UserId) is false)
    {
      filter &= Builders<Gist>.Filter.Eq(gist => gist.UserId, UserId);
    }

    if (string.IsNullOrWhiteSpace(SearchTerm) is false)
    {
      filter &= Builders<Gist>.Filter.Text(SearchTerm);
    }

    return filter;
  }

  internal SortDefinition<Gist> ToSortDefinition()
  {
    var sort = Builders<Gist>.Sort
      .Descending(gist => gist.Created)
      .Descending(gist => gist.Id);

    if (SortBy.Equals("created", StringComparison.OrdinalIgnoreCase))
    {
      sort = SortDirection.Equals("asc", StringComparison.OrdinalIgnoreCase)
        ? Builders<Gist>.Sort
          .Ascending(gist => gist.Created)
          .Ascending(gist => gist.Id)
        : Builders<Gist>.Sort
          .Descending(gist => gist.Created)
          .Descending(gist => gist.Id);
    }

    if (SortBy.Equals("updated", StringComparison.OrdinalIgnoreCase))
    {
      sort = SortDirection.Equals("asc", StringComparison.OrdinalIgnoreCase)
        ? Builders<Gist>.Sort
          .Ascending(gist => gist.Updated)
          .Ascending(gist => gist.Id)
        : Builders<Gist>.Sort
          .Descending(gist => gist.Updated)
          .Descending(gist => gist.Id);
    }

    return sort;
  }
}

record CreateGistRequest(
    HttpContext Context,
    [FromBody] NewGistDto Dto,
    [FromServices] IValidator<NewGistDto> Validator,
    [FromServices] IGistRepository Repository
);

record NewGistDto(
  string UserId,
  string Name,
  string Description,
  List<string> Formula,
  string Visibility,
  string LineWrapMode,
  int IndentSize
)
{
  internal Gist ToGist()
  {
    return new Gist
    {
      UserId = UserId,
      Name = Name,
      Description = Description,
      Formula = Formula,
      Visibility = Visibility,
      LineWrapMode = LineWrapMode,
      IndentSize = IndentSize
    };
  }
}

record UpdateGistRequest(
  HttpContext Context,
  [FromBody] GistDto Dto,
  [FromServices] IValidator<GistDto> Validator,
  [FromServices] IGistRepository Repository
);

record DeleteGistRequest(
  HttpContext Context,
  [FromRoute] string Id,
  [FromServices] IGistRepository Repository
);