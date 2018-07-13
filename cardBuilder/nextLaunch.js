const builder = require('botbuilder');

module.exports = {
    cardBuilder: (session, data) => {
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
                        "text": `Date de lancement : ${data.launch_date_local}`,
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
                    }],
                    "actions": [
                        {
                          "type": "Action.OpenUrl",
                          "title": "Vidéo",
                          "url": "https://www.youtube.com/watch?v=2hcM5hqQ45s"
                        }
                      ]
                }
            });
    
        return adaptiveCard
    }
} 