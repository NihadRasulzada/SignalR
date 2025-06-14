using Microsoft.AspNetCore.SignalR;

namespace SignalR.Web.Hubs
{
    public class ExampleTypeSafeHub : Hub<IExampleTypeSafeHub>
    {
        static int ConnectedClientsCount = 0;
        public async Task BroadcastMessageToAllClients(string message)
        {
            await Clients.All.ReceiveMessageForAllClient(message);
        }

        public async Task BroadcastMessageToCallerClients(string message)
        {
            await Clients.Caller.ReceiveMessageForCallerClient(message);
        }

        public async Task BroadcastMessageToOtherClients(string message)
        {
            await Clients.Others.ReceiveMessageForOtherClient(message);
        }

        public override async Task OnConnectedAsync()
        {
            ConnectedClientsCount++;
            await Clients.All.ReceiveConnectedClientCountAllClient(ConnectedClientsCount);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            ConnectedClientsCount--;
            await Clients.All.ReceiveConnectedClientCountAllClient(ConnectedClientsCount);
        }
    }
}
