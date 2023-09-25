namespace Server.API.Interfaces;

interface IGistRepository
{
  Task<Result<Gist>> CreateAsync(Gist gist);
  Task<Result<Gist?>> GetByIdAsync(string id);
}