using System.Data;

namespace Server.API.Dtos;

public class NewGistDto
{
  public string UserId { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public List<string> Formula { get; set; } = new();
  public string Visibility { get; set; } = string.Empty;
  public string LineWrapMode { get; set; } = string.Empty;
  public int IndentSize { get; set; }
}

public class NewGistDtoValidator : AbstractValidator<NewGistDto>
{
  public NewGistDtoValidator()
  {
    RuleFor(d => d.UserId).NotEmpty().WithMessage("UserId is required");
    RuleFor(d => d.Name).Length(1, 150).WithMessage("Name must be between 1 and 150 characters in length");
    RuleFor(d => d.Description).Length(1, 5000).WithMessage("Description must be between 1 and 5000 characters in length");
    RuleFor(d => d.Formula).NotEmpty().WithMessage("Formula must not be empty");
    RuleFor(d => d.Visibility).Must(BeValidAccessType).WithMessage("Visibility must be either private or public");
    RuleFor(d => d.LineWrapMode).Must(BeValidLineWrapMode).WithMessage("LineWrapMode must be noWrap or softWrap");
    RuleFor(d => d.IndentSize).Must(BeValidIndentSize).WithMessage("IndentSize must be 2, 4, or 8");
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