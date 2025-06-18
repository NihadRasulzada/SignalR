$(document).ready(function () {
    const connection = new signalR.HubConnectionBuilder().withUrl("/exampleTypeSafeHub").configureLogging(signalR.LogLevel.Information).build();

    async function start() {
        try {
            await connection.start().then(() => {
                console.log("Connected to the hub");
                $("#connectionId").html(`Connection Id : ${connection.connectionId}`);
            });
        }
        catch (err) {
            console.error("Error while starting connection: ", err);
            setTimeout(() => start(), 5000)
        }

    }

    connection.onclose(async () => {
        await start();
    });

    start();

    const broadcastStreamDataToAllClient = "BroadcastStreamDataToAllClient";
    const receiveMessageAsStreamForAllClient = "ReceiveMessageAsStreamForAllClient";

    const broadCastFromHubToClient = "BroadCastFromHubToClient";

    $("btn_fromClient_toHub").click(function () {
        const names = $("#txt_stream").val();
        const namesAsChunk = names.split(";");
        const subject = new signalR.Subject();

        connection.send(broadcastStreamDataToAllClient, subject).catch(err => console.error("error", err));

        namesAsChunk.forEach(name => {
            subject.next(name);
        });

        subject.complete();
    });

    connection.on(receiveMessageAsStreamForAllClient, (name) => {
        $("#streamBox").append(`<p>${name}</p>`);
    })

    $("#btn_FromHubToClient").click(function () {

        connection.stream(broadCastFromHubToClient, 5).subscribe(
            {
                next: (message) => $("#streamBox").append(`<p>${message}</p>`)
            });

    })


});