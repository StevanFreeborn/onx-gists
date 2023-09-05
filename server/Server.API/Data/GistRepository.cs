
namespace Server.API.Data;

class GistRepository : IGistRepository
{
  private readonly DbContext _context;

  public GistRepository(DbContext context)
  {
    _context = context;
  }

  public async Task<Result<Gist>> CreateAsync(Gist gist)
  {
    try
    {
      await _context.Gists.InsertOneAsync(gist);
      return Result.Ok(gist);
    }
    catch (Exception ex)
    {
      return Result.Fail(ex.Message);
    }
  }
}