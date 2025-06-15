// See https://aka.ms/new-console-template for more information
using Microsoft.AspNetCore.SignalR.Client;
using SignalR.Console;
using System.Threading.Tasks;

internal class Program
{
    private static async Task Main(string[] args)
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

        while (true)
        {
            var key = Console.ReadLine();

            if (key == "exit") return;

            Product product = new()
            {
                Id = 1,
                Name = "Sample Product",
                Price = 19.99m
            };

            await connection.InvokeAsync("BroadcastTypedMessageToAllClient", product);
        }
    }
}