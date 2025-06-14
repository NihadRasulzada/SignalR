﻿namespace SignalR.Web.Hubs
{
    public interface IExampleTypeSafeHub
    {
        Task ReceiveMessageForAllClient(string message);
        Task ReceiveConnectedClientCountAllClient(int count);
        Task ReceiveMessageForCallerClient(string message);
    }
}
