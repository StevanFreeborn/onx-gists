using System.Security.Claims;

namespace Server.API.Extensions;

public static class HttpContextExtensions
{
  public static string? GetUserId(this HttpContext context)
  {
    return context.User.FindFirstValue(ClaimTypes.NameIdentifier);
  }
}