using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Threading.Tasks;
using System.Threading;
using System;

[Route("api/[controller]")]
public class VNCController : Controller
{
    [HttpGet("connect")]
    public async Task ConnectVnc()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            try
            {
                using (var clientWebSocket = new ClientWebSocket())
                {
                    Uri guacUri = new Uri("ws://localhost:4822/guacamole"); // Guacamole proxy URL
                    await clientWebSocket.ConnectAsync(guacUri, CancellationToken.None);

                    var serverWebSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                    await Task.WhenAll(
                        TransferData(clientWebSocket, serverWebSocket),
                        TransferData(serverWebSocket, clientWebSocket)
                    );
                }
            }
            catch (Exception ex)
            {
                HttpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await HttpContext.Response.WriteAsync($"Error: {ex.Message}");
            }
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            await HttpContext.Response.WriteAsync("Invalid WebSocket request");
        }
    }

    private async Task TransferData(WebSocket src, WebSocket dest)
    {
        var buffer = new byte[1024 * 4];
        WebSocketReceiveResult result = await src.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!result.CloseStatus.HasValue)
        {
            await dest.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
            result = await src.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        await dest.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
    }
}
