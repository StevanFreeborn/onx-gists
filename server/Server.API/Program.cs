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
  .MapGet("/gists/{id}", async (
    HttpContext context,
    string id,
    [FromServices] IGistRepository repository
  ) =>
  {
    var userId = context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    var gistResult = await repository.GetByIdAsync(id);

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
  .MapPut("/gists", async (
    HttpContext context,
    GistDto updateGistDto,
    [FromServices] IValidator<GistDto> validator,
    [FromServices] IGistRepository repository
  ) =>
  {
    var userId = context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    if (updateGistDto.UserId != userId)
    {
      return Results.Forbid();
    }

    var validationResult = await validator.ValidateAsync(updateGistDto);

    if (validationResult.IsValid == false)
    {
      return Results.ValidationProblem(validationResult.ToDictionary());
    }

    var updateResult = await repository.UpdateAsync(updateGistDto.ToGist());

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
  .MapPost("/gists", async (
    HttpContext context,
    NewGistDto newGistDto,
    [FromServices] IValidator<NewGistDto> validator,
    [FromServices] IGistRepository repository
  ) =>
  {
    var userId = context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    if (newGistDto.UserId != userId)
    {
      return Results.Forbid();
    }

    var validationResult = await validator.ValidateAsync(newGistDto);

    if (validationResult.IsValid == false)
    {
      return Results.ValidationProblem(validationResult.ToDictionary());
    }

    var createResult = await repository.CreateAsync(newGistDto.ToGist());

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
  .MapDelete("/gists/{id}", async (
    HttpContext context,
    string id,
    [FromServices] IGistRepository repository
  ) =>
  {
    var userId = context.GetUserId();

    if (userId == null)
    {
      return Results.Unauthorized();
    }

    var gistResult = await repository.GetByIdAsync(id);

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

    var deleteResult = await repository.DeleteAsync(id);

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