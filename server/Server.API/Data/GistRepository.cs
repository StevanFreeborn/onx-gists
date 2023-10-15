
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

  public async Task<Result<Page<Gist>>> GetAllAsync(GistsFilter filter)
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
              PipelineStageDefinitionBuilder.Skip<Gist>(
                (filter.PageNumber - 1) * filter.PageSize
              ),
              PipelineStageDefinitionBuilder.Limit<Gist>(
                filter.PageSize
              ),
          }
        )
      );

      var aggregate = await _context.Gists.Aggregate()
        .Match(filter.ToFilterDefinition())
        .Facet(countFacet, dataFacet)
        .FirstOrDefaultAsync();

      var countOutput = aggregate
        .Facets
        .First(facet => facet.Name == countFacetName)
        .Output<AggregateCountResult>();

      if (countOutput.Count == 0)
      {
        return Result.Ok(new Page<Gist>(0, data: new List<Gist>()));
      }

      var count = countOutput[0].Count;

      var data = aggregate
        .Facets
        .First(facet => facet.Name == dataFacetName)
        .Output<Gist>();

      var page = new Page<Gist>(
        count: count,
        data: data.ToList()
      );

      return Result.Ok(page);
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