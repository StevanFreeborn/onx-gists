namespace Server.API.Models;

class DbOptions
{
  public string ConnectionString { get; set; } = string.Empty;
  public string DatabaseName { get; set; } = string.Empty;
}