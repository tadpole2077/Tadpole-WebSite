using System.Text.Json.Serialization;

namespace TadpoleSite.Server.Models
{
    public class TestUser
    {
        public required string Name { get; set; }
        public required string DOB { get; set; }

        // Option to use field - slight perf improvement, improved readibility - if not using getter and setter, but need to set serialisation property as MVC ignores returning fields.
        [JsonInclude]
        public int Age;

        [JsonInclude]
        public string[]? Hobbies;

        [JsonInclude]
        public UserAttributes[]? Attributes;
    }

    public class UserAttributes
    {
        [JsonInclude]
        public string? key;

        [JsonInclude]
        public string? value;
    }
}
