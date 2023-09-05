namespace Server.API.Models;

class Gist
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = string.Empty;

  [BsonElement("userId")]
  public string UserId { get; set; } = string.Empty;

  [BsonElement("name")]
  public string Name { get; set; } = string.Empty;

  [BsonElement("description")]
  public string Description { get; set; } = string.Empty;

  [BsonElement("formula")]
  public List<string> Formula { get; set; } = new();

  [BsonElement("visibility")]
  public string Visibility { get; set; } = string.Empty;

  [BsonElement("lineWrapMode")]
  public string LineWrapMode { get; set; } = string.Empty;

  [BsonElement("indentSize")]
  public int IndentSize { get; set; }

  [BsonElement("created")]
  public DateTimeOffset Created { get; set; } = DateTimeOffset.Now;

  [BsonElement("updated")]
  public DateTimeOffset Updated { get; set; } = DateTimeOffset.Now;
}