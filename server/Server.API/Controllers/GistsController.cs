namespace Server.API.Controllers;

static class GistsController
{
  public static async Task<IResult> GetGistAsync([AsParameters] GetGistRequest req)
  {
    var gistResult = await req.Repository.GetByIdAsync(req.Id);

    if (gistResult.IsFailed)
    {
      var error = gistResult.Errors.FirstOrDefault();
      return Results.Problem(
        title: "Unable to get gist",
        detail: error?.Message,
        statusCode: 500
      );
    }

    if (gistResult.Value == null)
    {
      return Results.NotFound();
    }

    var userId = req.Context.GetUserId();

    if (gistResult.Value.UserId != userId && gistResult.Value.Visibility == "private")
    {
      return Results.Forbid();
    }

    return Results.Ok(gistResult.Value);
  }

  public static async Task<IResult> GetGistsAsync([AsParameters] GetGistsRequest req)
  {
    var userId = req.Context.GetUserId();

    if (req.Filter.IncludePrivate && userId != req.Filter.UserId)
    {
      return Results.Unauthorized();
    }

    if (req.Filter.PageNumber < 1)
    {
      return Results.BadRequest("Page number must be greater than 0");
    }

    if (req.Filter.PageSize < 1 || req.Filter.PageSize > 100)
    {
      return Results.BadRequest("Page size must be between 1 and 100");
    }

    var gistsResult = await req.Repository.GetAllAsync(req.Filter);

    if (gistsResult.IsFailed)
    {
      var error = gistsResult.Errors.FirstOrDefault();
      return Results.Problem(
        title: "Unable to get gists",
        detail: error?.Message,
        statusCode: 500
      );
    }

    var page = gistsResult.Value;
    var totalPages = (int)Math.Ceiling(page.Count / (double)req.Filter.PageSize);

    var hasNextPage = req.Filter.PageNumber < totalPages;
    var gistDtos = page
      .Data
      .Select(gist => new GistDto(gist))
      .ToList();

    var pagedResult = new PagedGistsResponse(
      PageNumber: req.Filter.PageNumber,
      PageSize: gistDtos.Count,
      TotalPages: totalPages,
      TotalGists: page.Count,
      HasNextPage: hasNextPage,
      Gists: gistDtos
    );

    return Results.Ok(pagedResult);
  }

  public static async Task<IResult> UpdateGistAsync([AsParameters] UpdateGistRequest req)
  {
    var userId = req.Context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    if (req.Dto.UserId != userId)
    {
      return Results.Forbid();
    }

    var validationResult = await req.Validator.ValidateAsync(req.Dto);

    if (validationResult.IsValid == false)
    {
      return Results.ValidationProblem(validationResult.ToDictionary());
    }

    var updateResult = await req.Repository.UpdateAsync(req.Dto.ToGist());

    if (updateResult.Value == null)
    {
      return Results.NotFound();
    }

    if (updateResult.IsFailed)
    {
      var error = updateResult.Errors.FirstOrDefault();
      return Results.Problem(
        title: "Unable to update gist",
        detail: error?.Message,
        statusCode: 500
      );
    }

    return Results.Ok(new GistDto(updateResult.Value));
  }

  public static async Task<IResult> CreateGistAsync([AsParameters] CreateGistRequest req)
  {
    var userId = req.Context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    if (req.Dto.UserId != userId)
    {
      return Results.Forbid();
    }

    var validationResult = await req.Validator.ValidateAsync(req.Dto);

    if (validationResult.IsValid == false)
    {
      return Results.ValidationProblem(validationResult.ToDictionary());
    }

    var createResult = await req.Repository.CreateAsync(req.Dto.ToGist());

    if (createResult.IsFailed)
    {
      var error = createResult.Errors.FirstOrDefault();
      return Results.Problem(
        title: "Unable to create gist",
        detail: error?.Message,
        statusCode: 500
      );
    }

    return Results.CreatedAtRoute(
      routeName: "GetGistById",
      routeValues: new { createResult.Value.Id },
      value: new GistDto(createResult.Value)
    );
  }

  public static async Task<IResult> DeleteGistAsync([AsParameters] DeleteGistRequest req)
  {
    var userId = req.Context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    var gistResult = await req.Repository.GetByIdAsync(req.Id);

    if (gistResult.IsFailed)
    {
      var error = gistResult.Errors.FirstOrDefault();
      return Results.Problem(
        title: "Unable to get gist",
        detail: error?.Message,
        statusCode: 500
      );
    }

    if (gistResult.Value == null)
    {
      return Results.NotFound();
    }

    if (gistResult.Value.UserId != userId)
    {
      return Results.Forbid();
    }

    var deleteResult = await req.Repository.DeleteAsync(req.Id);

    if (deleteResult.IsFailed)
    {
      var error = deleteResult.Errors.FirstOrDefault();
      return Results.Problem(
        title: "Unable to delete gist",
        detail: error?.Message,
        statusCode: 500
      );
    }

    if (deleteResult.Value == false)
    {
      return Results.NotFound();
    }

    return Results.NoContent();
  }
}