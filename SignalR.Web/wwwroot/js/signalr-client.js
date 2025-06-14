$(document).ready(function () {
    const broadcastMessageToAllClientHubMethodCall = "BroadcastMessageToAllClients"; 
    const broadcastMessageToCallerClients = "BroadcastMessageToCallerClients"; 
    const broadcastMessageToOtherClients = "BroadcastMessageToOtherClients"; 
    const receiveMessageForAllClientClientMethodCall = "ReceiveMessageForAllClient";
    const receiveMessageForCallerClient = "ReceiveMessageForCallerClient";
    const receiveMessageForOtherClient = "ReceiveMessageForOtherClient";
    const receiveConnectedClientCountAllClientClientMethodCall = "ReceiveConnectedClientCountAllClient";

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

    connection.on(receiveMessageForCallerClient, (message) => {
        console.log("Called Received message: " + message);
    })

    connection.on(receiveMessageForOtherClient, (message) => {
        console.log("Other Received message: " + message);
    })


    var span_client_count = $("#span-connected-client-count");
    connection.on(receiveConnectedClientCountAllClientClientMethodCall, (count) => {
        span_client_count.text(count);
        console.log("Connected client count: " + message);
    })

    $("#btn-send-message-all-client").click(function () {
        const message = "Salam";

        connection.invoke(broadcastMessageToAllClientHubMethodCall, message)
            .catch(err => console.error("Error sending message: " + err));
    })

    $("#btn-send-message-caller-client").click(function () {
        const message = "Caller Salam";

        connection.invoke(broadcastMessageToCallerClients, message)
            .catch(err => console.error("Error sending message: " + err));
    })

    $("#btn-send-message-other-client").click(function () {
        const message = "Other Salam";

        connection.invoke(broadcastMessageToOtherClients, message)
            .catch(err => console.error("Error sending message: " + err));
    })
});
