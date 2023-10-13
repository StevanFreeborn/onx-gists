namespace Server.API.Models;

record PagedGistsResponse(
  int PageNumber,
  int PageSize,
  int TotalPages,
  long TotalGists,
  bool HasNextPage,
  List<GistDto> Gists
)
{
  public int PageNumber { get; init; } = PageNumber;
  public int PageSize { get; init; } = PageSize;
  public int TotalPages { get; init; } = TotalPages;
  public long TotalGists { get; init; } = TotalGists;
  public bool HasNextPage { get; init; } = HasNextPage;
  public List<GistDto> Gists { get; init; } = Gists;
}