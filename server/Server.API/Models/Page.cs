namespace Server.API.Models;

class Page<T>
{
  public long Count { get; set; }
  public List<T> Data { get; set; } = new();

  public Page(long count, List<T> data)
  {
    Count = count;
    Data = data;
  }
}