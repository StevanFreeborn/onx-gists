
using MongoDB.Driver.Linq;

namespace Server.API.Data;

class GistRepository : IGistRepository
{
  private readonly DbContext _context;

  public GistRepository(DbContext context)
  {
    _context = context;
  }

  public async Task<Result<Gist>> CreateAsync(Gist gist)
  {
    try
    {
      await _context.Gists.InsertOneAsync(gist);
      return Result.Ok(gist);
    }
    catch (Exception ex)
    {
      return Result.Fail(ex.Message);
    }
  }

  public async Task<Result<bool>> DeleteAsync(string id)
  {
    try
    {
      var result = await _context.Gists.DeleteOneAsync(gist => gist.Id == id);
      return Result.Ok(result.DeletedCount > 0);
    }
    catch (Exception ex)
    {
      return Result.Fail(ex.Message);
    }
  }

  public async Task<Result<List<Gist>>> GetAllAsync(GistsFilter filter)
  {
    try
    {
      var countFacetName = "count";
      var dataFacetName = "data";

      var countFacet = AggregateFacet.Create(countFacetName,
        PipelineDefinition<Gist, AggregateCountResult>.Create(
          new[]
          {
            PipelineStageDefinitionBuilder.Count<Gist>()
          }
        )
      );

      var dataFacet = AggregateFacet.Create(dataFacetName,
        PipelineDefinition<Gist, Gist>.Create(
          new[]
          {
              PipelineStageDefinitionBuilder.Skip<Gist>(10),
              PipelineStageDefinitionBuilder.Limit<Gist>(10),
          }
        )
      );

      var aggregate = await _context.Gists.Aggregate()
        .Facet(countFacet, dataFacet).FirstOrDefaultAsync();

      var count = aggregate
        .Facets
        .First(facet => facet.Name == countFacetName)
        .Output<AggregateCountResult>()[0];

      var data = aggregate
        .Facets
        .First(facet => facet.Name == dataFacetName)
        .Output<Gist>();

      var page = new Page<Gist>(
        count.Count,
        data: data.ToList()
      );

      var gistsQuery = _context.Gists.AsQueryable();

      if (filter.IncludePrivate == false)
      {
        gistsQuery = gistsQuery.Where(gist => gist.Visibility == "public");
      }

      return Result.Ok(await gistsQuery.ToListAsync());
    }
    catch (Exception ex)
    {
      return Result.Fail(ex.Message);
    }
  }

  public async Task<Result<Gist?>> GetByIdAsync(string id)
  {
    try
    {
      var gist = await _context.Gists.Find(gist => gist.Id == id).FirstOrDefaultAsync();
      return Result.Ok<Gist?>(gist);
    }
    catch (Exception ex)
    {
      return Result.Fail(ex.Message);
    }
  }

  public async Task<Result<Gist?>> UpdateAsync(Gist gist)
  {
    try
    {
      gist.Updated = DateTimeOffset.UtcNow;

      var updatedGist = await _context.Gists.FindOneAndReplaceAsync(
        g => g.Id == gist.Id,
        gist,
        new() { ReturnDocument = ReturnDocument.After }
      );

      return Result.Ok<Gist?>(updatedGist);
    }
    catch (Exception ex)
    {
      return Result.Fail(ex.Message);
    }
  }
}