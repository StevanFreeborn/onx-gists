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

record CreateGistRequest(
    HttpContext Context,
    [FromBody] NewGistDto Dto,
    [FromServices] IValidator<NewGistDto> Validator,
    [FromServices] IGistRepository Repository
);

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