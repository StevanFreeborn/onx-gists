namespace Server.API.Models;

record GistDto(
  string Id,
  string UserId,
  string Name,
  string Description,
  List<string> Formula,
  string Visibility,
  string LineWrapMode,
  int IndentSize,
  DateTimeOffset Created,
  DateTimeOffset Updated
)
{
  internal GistDto(Gist gist) : this(
    gist.Id,
    gist.UserId,
    gist.Name,
    gist.Description,
    gist.Formula,
    gist.Visibility,
    gist.LineWrapMode,
    gist.IndentSize,
    gist.Created,
    gist.Updated
  )
  {
    Id = gist.Id;
    UserId = gist.UserId;
    Name = gist.Name;
    Description = gist.Description;
    Formula = gist.Formula;
    Visibility = gist.Visibility;
    LineWrapMode = gist.LineWrapMode;
    IndentSize = gist.IndentSize;
    Created = gist.Created;
    Updated = gist.Updated;
  }

  internal Gist ToGist()
  {
    return new Gist
    {
      Id = Id,
      UserId = UserId,
      Name = Name,
      Description = Description,
      Formula = Formula,
      Visibility = Visibility,
      LineWrapMode = LineWrapMode,
      IndentSize = IndentSize,
      Created = Created,
      Updated = Updated
    };
  }
}