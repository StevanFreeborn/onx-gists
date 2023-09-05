
namespace Server.API.Data;

class DbContext
{
  private const string GistsCollectionName = "gists";
  private readonly DbOptions _options;
  public IMongoCollection<Gist> Gists { get; set; }

  public DbContext(IOptions<DbOptions> options)
  {
    _options = options.Value;
    IMongoClient client = new MongoClient(_options.ConnectionString);
    IMongoDatabase database = client.GetDatabase(_options.DatabaseName);
    Gists = database.GetCollection<Gist>(GistsCollectionName);
  }
}