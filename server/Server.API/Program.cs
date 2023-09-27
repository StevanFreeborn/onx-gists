using Microsoft.AspNetCore.Mvc;

using Server.API.Data;
using Server.API.Extensions;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

var jwtOptions = new JwtOptions();
config.GetSection(nameof(JwtOptions)).Bind(jwtOptions);

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(
    o => o.TokenValidationParameters = new TokenValidationParameters
    {
      ValidIssuer = jwtOptions.Issuer,
      ValidAudience = jwtOptions.Audience,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,
      ClockSkew = TimeSpan.FromSeconds(0),
    }
  );

builder.Services.AddAuthorization();

builder.Services.AddCors(
  options => options.AddPolicy(
    "development",
    policy => policy
      .AllowCredentials()
      .AllowAnyHeader()
      .AllowAnyMethod()
      .WithOrigins("http://localhost:3000")
  )
);

builder.Services.Configure<DbOptions>(config.GetSection(nameof(DbOptions)));
builder.Services.AddSingleton<DbContext>();
builder.Services.AddScoped<IGistRepository, GistRepository>();
builder.Services.AddScoped<IValidator<NewGistDto>, NewGistDtoValidator>();
builder.Services.AddScoped<IValidator<GistDto>, GistDtoValidator>();

var app = builder.Build();

app
  .MapGet("/ping", () => new { Message = "I'm alive!" })
  .WithName("Ping")
  .WithDescription("Indicates if the gist service is up");

app
  .MapGet("/gists/{id}", async ([AsParameters] GetGistRequest req) =>
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

    if (gistResult.Value.UserId != userId && gistResult.Value.Visibility == "private")
    {
      return Results.Forbid();
    }

    return Results.Ok(gistResult.Value);
  })
  .RequireAuthorization()
  .WithName("GetGistById")
  .WithDescription("Gets the gist with the given id from the database");

app
  .MapGet("/gists", async ([AsParameters] GetGistsRequest req) =>
  {
    var userId = req.Context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    if (req.PageNumber < 1)
    {
      return Results.BadRequest("Page number must be greater than 0");
    }

    if (req.PageSize < 1 || req.PageSize > 100)
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

    var gists = gistsResult.Value;
    var totalPages = (int)Math.Ceiling(gists.Count() / (double)req.PageSize);
    var page = req.PageNumber;

    if (page > totalPages)
    {
      page = totalPages;
    }

    var hasNextPage = page < totalPages;
    var pagedGists = gists
      .Skip((page - 1) * req.PageSize)
      .Take(req.PageSize)
      .Select(gist => new GistDto(gist))
      .ToList();

    var pagedResult = new PagedGistsDto(
      page,
      pagedGists.Count(),
      gists.Count(),
      totalPages,
      hasNextPage,
      pagedGists
    );

    return Results.Ok(pagedResult);
  })
  .RequireAuthorization()
  .WithName("GetGists")
  .WithDescription("Gets all gists from the database");

app
  .MapPut("/gists", async ([AsParameters] UpdateGistRequest req) =>
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
  })
  .WithName("UpdateGist")
  .WithDescription("Updates the given gist in the database");

app
  .MapPost("/gists", async ([AsParameters] CreateGistRequest req) =>
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
        title: "Unable to create new gist",
        detail: error?.Message,
        statusCode: 500
      );
    }

    return Results.CreatedAtRoute(
      routeName: "GetGistById",
      routeValues: new { createResult.Value.Id },
      value: new GistDto(createResult.Value)
    );
  })
  .RequireAuthorization()
  .WithName("AddGist")
  .WithDescription("Stores the given gist in the database");

app
  .MapDelete("/gists/{id}", async ([AsParameters] DeleteGistRequest req) =>
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
  })
  .RequireAuthorization()
  .WithName("DeleteGist")
  .WithDescription("Deletes the given gist from the database");

if (app.Environment.IsDevelopment())
{
  app.UseCors("development");
}

app.UseAuthentication();
app.UseAuthorization();

app.Run();