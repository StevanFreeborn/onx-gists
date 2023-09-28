namespace Server.API.Models;

record GetGistRequest(
  HttpContext Context,
  [FromRoute] string Id,
  [FromServices] IGistRepository Repository
);

record GetGistsRequest(
  HttpContext Context,
  GistsFilter Filter,
  [FromServices] IGistRepository Repository,
  [FromQuery] int PageNumber = 1,
  [FromQuery] int PageSize = 10
);

record GistsFilter
{
  public bool IncludePrivate { get; init; } = false;

  public static ValueTask<GistsFilter> BindAsync(HttpContext context, ParameterInfo parameter)
  {
    var filter = new GistsFilter
    {
      IncludePrivate = bool.TryParse(context.Request.Query["includePrivate"], out var includePrivate) && includePrivate
    };

    return ValueTask.FromResult(filter);
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