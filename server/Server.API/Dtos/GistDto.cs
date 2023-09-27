namespace Server.API.Dtos;

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

class GistDtoValidator : AbstractValidator<GistDto>
{
  public GistDtoValidator()
  {
    RuleFor(d => d.Id).NotEmpty().WithMessage("Id is required");
    RuleFor(d => d.UserId).NotEmpty().WithMessage("UserId is required");
    RuleFor(d => d.Name).Length(1, 150).WithMessage("Name must be between 1 and 150 characters in length");
    RuleFor(d => d.Description).Length(1, 5000).WithMessage("Description must be between 1 and 5000 characters in length");
    RuleFor(d => d.Formula).NotEmpty().WithMessage("Formula must not be empty");
    RuleFor(d => d.Visibility).Must(BeValidAccessType).WithMessage("Visibility must be either private or public");
    RuleFor(d => d.LineWrapMode).Must(BeValidLineWrapMode).WithMessage("LineWrapMode must be noWrap or softWrap");
    RuleFor(d => d.IndentSize).Must(BeValidIndentSize).WithMessage("IndentSize must be 2, 4, or 8");
    RuleFor(d => d.Created).NotEmpty().WithMessage("Created is required");
    RuleFor(d => d.Updated).NotEmpty().WithMessage("Updated is required");
  }

  private bool BeValidAccessType(string accessType)
  {
    return accessType == "public" || accessType == "private";
  }

  private bool BeValidLineWrapMode(string lineWrapMode)
  {
    return lineWrapMode == "noWrap" || lineWrapMode == "softWrap";
  }

  private bool BeValidIndentSize(int indentSize)
  {
    return indentSize == 2 || indentSize == 4 || indentSize == 8;
  }
}