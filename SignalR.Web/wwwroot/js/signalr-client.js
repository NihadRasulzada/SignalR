$(document).ready(function () {

    const connection = new signalR.HubConnectionBuilder().withUrl("/exampleTypeSafeHub").configureLogging(signalR.LogLevel.Information).build();

    const broadcastMessageToAllClientHubMethodCall = "BroadcastMessageToAllClient";
    const receiveMessageForAllClientClientMethodCall = "ReceiveMessageForAllClient";

    const broadcastTypedMessageToAllClient = "BroadcastTypedMessageToAllClient";
    const receiveTypedMessageForAllClient = "ReceiveTypedMessageForAllClient";

    const broadcastMessageToCallerClient = "BroadcastMessageToCallerClient";
    const receiveMessageForCallerClient = "ReceiveMessageForCallerClient";


    const broadcastMessageToOthersClient = "BroadcastMessageToOthersClient";
    const receiveMessageForOthersClient = "ReceiveMessageForOthersClient";


    const broadcastMessageToIndividualClient = "BroadcastMessageToIndividualClient";
    const receiveMessageForIndividualClient = "ReceiveMessageForIndividualClient";

    const receiveConnectedClientCountAllCLient = "ReceiveConnectedClientCountAllCLient";


    const groupA = "GroupA";
    const groupB = "GroupB";
    let currentGroupList = [];

    function refreshGroupList() {

        $("#groupList").empty();
        currentGroupList.forEach(x => {

            $("#groupList").append(`<p>${x}</p>`)
        })

    }

    $("#btn-groupA-add").click(function () {

        if (currentGroupList.includes(groupA)) return;

        connection.invoke("AddGroup", groupA).then(() => {

            currentGroupList.push(groupA);
            refreshGroupList();


        })
    })

    $("#btn-groupA-remove").click(function () {

        if (!currentGroupList.includes(groupA)) return;

        connection.invoke("RemoveGroup", groupA).then(() => {

            currentGroupList = currentGroupList.filter(x => x !== groupA)
            refreshGroupList();


        })

    })

    $("#btn-groupB-add").click(function () {

        if (currentGroupList.includes(groupB)) return;

        connection.invoke("AddGroup", groupB).then(() => {

            currentGroupList.push(groupB);
            refreshGroupList();


        })
    })
    $("#btn-groupB-remove").click(function () {

        if (!currentGroupList.includes(groupB)) return;
        connection.invoke("RemoveGroup", groupB).then(() => {

            currentGroupList = currentGroupList.filter(x => x !== groupB)
            refreshGroupList();


        })

    })

    $("#btn-groupA-send-message").click(function () {

        const message = "Group A Message";
        connection.invoke("BroadcastMessageToGroupClients", groupA, message).catch(err => console.error("error", err))
        console.log("Message sent.")

    })

    $("#btn-groupB-send-message").click(function () {

        const message = "Group B Message";
        connection.invoke("BroadcastMessageToGroupClients", groupB, message).catch(err => console.error("error", err))
        console.log("Message sent.")

    })

    connection.on("ReceiveMessageForGroupClients", (message) => {

        console.log("Received Message", message);
    })

    function start() {
        connection.start().then(() => {
            console.log("Connected to the hub");
            $("#connectionId").html(`Connection Id : ${connection.connectionId}`);
        });
    }

    try {
        start();
    }
    catch {
        setTimeout(() => start(), 5000)
    }

    const span_client_count = $("#span-connected-client-count");
    connection.on(receiveConnectedClientCountAllCLient, (count) => {
        span_client_count.text(count);
        console.log("Connected client count", count);
    })

    //subscribes
    connection.on(receiveMessageForAllClientClientMethodCall, (message) => {

        console.log("Received Message", message);
    })

    connection.on(receiveTypedMessageForAllClient, (product) => {

        console.log("Receive Typed Message", product);
    })

    connection.on(receiveMessageForCallerClient, (message) => {

        console.log("(Caller) Received Message", message);
    })

    connection.on(receiveMessageForOthersClient, (message) => {

        console.log("(Others) Received Message", message);
    })

    connection.on(receiveMessageForIndividualClient, (message) => {

        console.log("(Individual) Received Message", message);
    })

    $("#btn-send-message-all-client").click(function () {

        const message = "hello world";
        connection.invoke(broadcastMessageToAllClientHubMethodCall, message).catch(err => console.error("error", err))
        console.log("Message sent.")
    })

    $("#btn-send-message-caller-client").click(function () {

        const message = "hello world";
        connection.invoke(broadcastMessageToCallerClient, message).catch(err => console.error("error", err))
        console.log("Message sent.")
    })

    $("#btn-send-message-others-client").click(function () {

        const message = "hello world";
        connection.invoke(broadcastMessageToOthersClient, message).catch(err => console.error("error", err))
        console.log("Message sent.")
    })

    $("#btn-send-message-individual-client").click(function () {

        const message = "hello world";
        const connectionId = $("#text-connectionId").val();
        connection.invoke(broadcastMessageToIndividualClient, connectionId, message).catch(err => console.error("error", err))
        console.log("Message sent.")

    })

    $("#btn-send-typed-message-all-client").click(function () {
        console.log("Typed Message Button Clicked");
        const product = {
            Id: 1,
            Name: "Product 1",
            Price: 100.0
        };

        connection.invoke(broadcastTypedMessageToAllClient, product).catch(err => console.error("error", err)).then(() => { console.log("Typed Message Sended") })
    })

})
