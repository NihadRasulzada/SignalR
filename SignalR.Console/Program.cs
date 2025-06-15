// See https://aka.ms/new-console-template for more information
using Microsoft.AspNetCore.SignalR.Client;
using SignalR.Console;

internal class Program
{
    private static void Main(string[] args)
    {
        Console.WriteLine("SignalR Console Client");

        var connection = new HubConnectionBuilder()
            .WithUrl("https://localhost:7299/exampleTypeSafeHub")
            .Build();

        connection.StartAsync().ContinueWith((result) =>
        {
            Console.WriteLine(result.IsCompletedSuccessfully ? "Connected" : "Connection Failed");
        });

        connection.On<Product>("ReceiveTypedMessageForAllClient", (product) =>
        {
            Console.WriteLine($"Received message: {product}");
        });

        Console.ReadKey();
    }
}