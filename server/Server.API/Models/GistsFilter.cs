namespace Server.API.Models;

record GistsFilter(bool IncludePrivate = false)
{
  public static ValueTask<GistsFilter> BindAsync(HttpContext context, ParameterInfo parameter)
  {
    var filter = new GistsFilter
    {
      IncludePrivate = bool.TryParse(context.Request.Query["includePrivate"], out var includePrivate) && includePrivate
    };

    return ValueTask.FromResult(filter);
  }
}