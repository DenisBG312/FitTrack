using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web;

namespace StrongerTogether.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GymsController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public GymsController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("{location}")]
        public async Task<IActionResult> GetGymsInLocation(string location)
        {
            var url = $"https://www.oink.bg/search/{HttpUtility.UrlEncode(location)}/fitnes-klub?sort=1";

            try
            {
                var response = await _httpClient.GetStringAsync(url);

                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(response);

                var gyms = new List<object>();

                var cards = htmlDoc.DocumentNode.SelectNodes("//section[contains(@class, 'css-11yf4yr')]");

                if (cards != null)
                {
                    foreach (var card in cards)
                    {
                        var nameNode = card.SelectSingleNode(".//h3");
                        var name = nameNode?.InnerText.Trim();

                        var linkNode = card.SelectSingleNode(".//a[contains(@class, 'chakra-link')]");
                        var link = linkNode?.GetAttributeValue("href", string.Empty);
                        if (!string.IsNullOrEmpty(link) && !link.StartsWith("http"))
                        {
                            link = "https://www.oink.bg" + link;
                        }

                        var ratingNode = card.SelectSingleNode(".//div[contains(@class, 'css-2ygcmq')]");
                        var rating = ratingNode?.InnerText.Trim();

                        var imgNode = card.SelectSingleNode(".//img");
                        var rawImage = imgNode?.GetAttributeValue("src", "");
                        var decodedImage = HttpUtility.HtmlDecode(rawImage);

                        var finalImage = decodedImage.StartsWith("http")
                            ? decodedImage
                            : $"https://www.oink.bg{decodedImage}";

                        gyms.Add(new
                        {
                            Name = name,
                            Link = link,
                            Rating = rating,
                            ImageUrl = finalImage
                        });
                    }
                }

                return Ok(gyms);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching data for location {location}: {ex.Message}");
            }
        }

    }
}
