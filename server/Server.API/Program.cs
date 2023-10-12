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
      IssuerSigningKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwtOptions.Secret)
      ),
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
  .MapGet("/gists/{id}", GistsController.GetGistAsync)
  .RequireAuthorization()
  .WithName("GetGistById")
  .WithDescription("Gets the gist with the given id from the database");

app
  .MapGet("/gists", GistsController.GetGistsAsync)
  // .RequireAuthorization()
  .WithName("GetGists")
  .WithDescription("Gets all gists from the database");

app.MapPost("/gists", GistsController.CreateGistAsync)
  .RequireAuthorization()
  .WithName("AddGist")
  .WithDescription("Stores the given gist in the database");

app
  .MapPut("/gists", GistsController.UpdateGistAsync)
  .RequireAuthorization()
  .WithName("UpdateGist")
  .WithDescription("Updates the given gist in the database");

app
  .MapDelete("/gists/{id}", GistsController.DeleteGistAsync)
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