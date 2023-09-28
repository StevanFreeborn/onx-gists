namespace Server.API.Models;

record PagedGistsResponse(
  int PageNumber,
  int PageSize,
  int TotalPages,
  bool HasNextPage,
  List<GistDto> Gists
)
{
  public int TotalItems => Gists.Count;
}