using Microsoft.AspNetCore.SignalR;
using SignalR.Web.Models;

namespace SignalR.Web.Hubs
{
    public class ExampleTypeSafeHub : Hub<IExampleTypeSafeHub>
    {
        private static int ConnectedClientCount = 0;

        // Sends a message to all clients
        public async Task BroadcastMessageToAllClient(string message)
        {
            await Clients.All.ReceiveMessageForAllClient(message);
        }

        public async Task BroadcastTypedMessageToAllClient(Product product)
        {
            await Clients.All.ReceiveTypedMessageForAllClient(product);
        }

        // Sends a message to the caller client only
        public async Task BroadcastMessageToCallerClient(string message)
        {
            await Clients.Caller.ReceiveMessageForCallerClient(message);
        }

        // Sends a message to all clients except the caller
        public async Task BroadcastMessageToOthersClient(string message)
        {
            await Clients.Others.ReceiveMessageForOthersClient(message);
        }

        // Sends a message to a specific client identified by connectionId
        public async Task BroadcastMessageToIndividualClient(string connectionId, string message)
        {
            await Clients.Client(connectionId).ReceiveMessageForIndividualClient(message);
        }

        // Sends a message to all clients in the specified group
        public async Task BroadcastMessageToGroupClients(string groupName, string message)
        {
            await Clients.Group(groupName).ReceiveMessageForGroupClients(message);
        }

        public async Task BroadcastStreamDataToAllClient(IAsyncEnumerable<string> nameAsChunk)
        {
            await foreach (var name in nameAsChunk)
            {
                await Clients.All.ReceiveMessageAsStreamForAllClient(name);
            }
        }

        public async IAsyncEnumerable<string> BroadCastFromHubToClient(int count)
        {

            foreach (var item in Enumerable.Range(1, count).ToList())
            {
                yield return $"{item}. data";
            }
        }

        // Adds the caller to the specified group and sends a notification to the group
        public async Task AddGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Caller.ReceiveMessageForCallerClient($"You have joined the {groupName} group.");

            await Clients.Group(groupName).ReceiveMessageForGroupClients($"User({Context.ConnectionId}) joined the {groupName} group.");
        }

        // Removes the caller from the specified group and sends a notification to the group
        public async Task RemoveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Caller.ReceiveMessageForCallerClient($"You have left the {groupName} group.");

            await Clients.Group(groupName).ReceiveMessageForGroupClients($"User({Context.ConnectionId}) left the {groupName} group.");
        }

        // Handles when a client connects and increments the connected client count
        public override async Task OnConnectedAsync()
        {
            ConnectedClientCount++;
            await Clients.All.ReceiveConnectedClientCountAllCLient(ConnectedClientCount);
            await base.OnConnectedAsync();
        }

        // Handles when a client disconnects and decrements the connected client count
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            ConnectedClientCount--;
            await Clients.All.ReceiveConnectedClientCountAllCLient(ConnectedClientCount);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
