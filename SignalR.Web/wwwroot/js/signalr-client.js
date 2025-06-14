$(document).ready(function () {
    const broadcastMessageToAllClientHubMethodCall = "BroadcastMessageToAllClients"; 
    const receiveMessageForAllClientClientMethodCall = "ReceiveMessageForAllClient";
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/exampleTypeSafeHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    function start() {
        connection.start().then(() => console.log("Connection started"));
    }

    try {
        start();
    }
    catch {
        setTimeout(() => start(), 5000);
    }

    connection.on(receiveMessageForAllClientClientMethodCall, (message) => {
        console.log("Received message: " + message);
    })

    $("#btn-send-message-all-client").click(function () {
        const message = "Salam";

        connection.invoke(broadcastMessageToAllClientHubMethodCall, message)
            .catch(err => console.error("Error sending message: " + err));
    })
});
