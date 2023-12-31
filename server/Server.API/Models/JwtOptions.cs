namespace Server.API.Models;

record JwtOptions
{
  public string Secret { get; init; } = string.Empty;
  public string Issuer { get; init; } = string.Empty;
  public string Audience { get; init; } = string.Empty;
}