namespace Server.API.Data;

interface IGistRepository
{
  Task<Result<Gist>> CreateAsync(Gist gist);
  Task<Result<Gist?>> UpdateAsync(Gist gist);
  Task<Result<Gist?>> GetByIdAsync(string id);
  Task<Result<bool>> DeleteAsync(string id);
  Task<Result<List<Gist>>> GetAllAsync(GistsFilter filter);
}