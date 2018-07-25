const builder = require('botbuilder');

module.exports = {
    cardBuilder: (session, data) => {
        console.log(data);

        const adaptiveCard = new builder.Message(session)
            .addAttachment({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                    type: "AdaptiveCard",
                    body: [{
                            "type": "TextBlock",
                            "text": `Numéro de vol : ${data.flight_number}`,
                            "wrap": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": `Nom de la mission : ${data.mission_name}`,
                            "wrap": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": `Nom de la fusée : ${data.rocket.rocket_name}`,
                            "wrap": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": "Launch date: {{DATE(" + data.launch_date_local + ",SHORT)}}",
                            "wrap": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": `Type : ${data.rocket.rocket_type}`,
                            "wrap": true,
                        },
                        {
                            "type": "TextBlock",
                            "text": `Temps en orbite : ${data.rocket.second_stage.payloads[0].orbit_params.lifespan_years} ans`,
                            "wrap": true,
                        }
                    ],
                    "actions": [{
                            "type": "Action.OpenUrl",
                            "title": "Reddit campaign",
                            "url": data.links.reddit_campaign
                        },
                        {
                            "type": "Action.Submit",
                            "title": "OK"
                        }
                    ]
                }
            });

        return adaptiveCard
    }
}