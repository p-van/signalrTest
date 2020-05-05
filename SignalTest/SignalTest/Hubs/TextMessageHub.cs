using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalTest.Hubs
{
    public class TextMessageHub: Hub<IMyClient>
    {
        public async Task EchoTextMessage(string message, string connectionId)
        {
            await Clients.All.SendTextMessage(message, connectionId);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            
            await EchoTextMessage("Client Joined", this.Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }

    public interface IMyClient
    {
        Task SendTextMessage(string message, string connectionId);
    }
}