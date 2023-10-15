namespace Server.API.Data;

record DbOptions
{
  public string ConnectionString { get; init; } = string.Empty;
  public string DatabaseName { get; init; } = string.Empty;
}