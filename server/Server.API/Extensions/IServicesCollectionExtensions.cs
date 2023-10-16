namespace Server.API.Extensions;

public static class IServicesCollectionExtensions
{
  public static async Task AddIndexes(this IServiceCollection services)
  {
    var dbContext = services.BuildServiceProvider().GetRequiredService<DbContext>();

    var searchIndex = Builders<Gist>.IndexKeys
      .Text(g => g.Name)
      .Text(g => g.Description)
      .Text(g => g.Formula);

    var gistIndexModal = new CreateIndexModel<Gist>(
      searchIndex,
      new() { Name = "gist_search_index" }
    );

    await dbContext.Gists.Indexes.CreateOneAsync(gistIndexModal);
  }
}

