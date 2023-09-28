namespace Server.API.Extensions;

static class HttpContextExtensions
{
  public static string? GetUserId(this HttpContext context)
  {
    return context.User.FindFirstValue(ClaimTypes.NameIdentifier);
  }
}