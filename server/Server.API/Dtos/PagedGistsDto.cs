namespace Server.API.Dtos;

record PagedGistsDto(
  int PageNumber,
  int PageSize,
  int TotalItems,
  int TotalPages,
  bool HasNextPage,
  List<GistDto> Gists
);