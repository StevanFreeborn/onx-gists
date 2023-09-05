using Microsoft.AspNetCore.Mvc;

using Server.API.Data;

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

var app = builder.Build();

app
  .MapGet("/ping", () => new { Message = "I'm alive!" })
  .WithName("Ping");

app.MapGet("/gists/{id}", (string id) => id).WithName("GetGistById");

app
  .MapPost("/gists", async (NewGistDto newGistDto, [FromServices] IValidator<NewGistDto> validator, [FromServices] IGistRepository repository) =>
  {
    var validationResult = await validator.ValidateAsync(newGistDto);

    if (validationResult.IsValid == false)
    {
      return Results.ValidationProblem(validationResult.ToDictionary());
    }

    var newGist = newGistDto.ToGist();

    var createResult = await repository.CreateAsync(newGist);

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
      value: createResult.Value
    );
  })
  .WithName("AddGist");

if (app.Environment.IsDevelopment())
{
  app.UseCors("development");
}

app.UseAuthentication();
app.UseAuthorization();

app.Run();