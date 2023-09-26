namespace Server.API.Dtos;

class GistDto
{
  public string Id { get; set; } = string.Empty;
  public string UserId { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public List<string> Formula { get; set; } = new();
  public string Visibility { get; set; } = string.Empty;
  public string LineWrapMode { get; set; } = string.Empty;
  public int IndentSize { get; set; }
  public DateTimeOffset Created { get; set; }
  public DateTimeOffset Updated { get; set; }

  public GistDto()
  {
  }

  public GistDto(Gist gist)
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