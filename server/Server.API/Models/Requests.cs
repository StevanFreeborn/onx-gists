
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
  public int PageNumber { get; init; } = 1;
  public int PageSize { get; init; } = 10;
  public bool IncludePrivate { get; init; } = false;

  public static ValueTask<GistsFilter> BindAsync(HttpContext context, ParameterInfo parameter)
  {
    var filter = new GistsFilter
    {
      PageNumber = int.TryParse(context.Request.Query["pageNumber"], out var pageNumber) ? pageNumber : 1,
      PageSize = int.TryParse(context.Request.Query["pageSize"], out var pageSize) ? pageSize : 10,
      IncludePrivate = bool.TryParse(context.Request.Query["includePrivate"], out var includePrivate) && includePrivate
    };

    return ValueTask.FromResult(filter);
  }

  internal FilterDefinition<Gist> ToFilterDefinition()
  {
    var filter = Builders<Gist>.Filter.Empty;

    if (IncludePrivate is false)
    {
      filter &= Builders<Gist>.Filter.Eq(gist => gist.Visibility, "public");
    }

    return filter;
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