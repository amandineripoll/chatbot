const builder = require('botbuilder');

module.exports = {
    allMissionCardBuilder: (session, data) => {
        let bodyObject = [];

        data.forEach((element) => {
            bodyObject.push({
                "type": "TextBlock",
                "text": `${element.flight_number} : ${element.mission_name}`,
                "wrap": true
            })
        });

        const adaptiveCard = new builder.Message(session)
            .addAttachment({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                    type: "AdaptiveCard",
                    body: bodyObject
                }
            });

        return adaptiveCard
    },

    selectedCardBuilder: (session, data) => {
        const selectedCard = {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                "type": "AdaptiveCard",
                "body": [{
                        "type": "Container",
                        "items": [{
                                "type": "TextBlock",
                                "text": `Mission name : ${data.mission_name}`,
                                "weight": "bolder",
                                "size": "medium"
                            },
                            {
                                "type": "ColumnSet",
                                "columns": [{
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [{
                                            "type": "Image",
                                            "url": data.links.mission_patch_small,
                                            "size": "small",
                                            "style": "person"
                                        }]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [{
                                                "type": "TextBlock",
                                                "text": `#${data.flight_number}`,
                                                "weight": "bolder",
                                                "wrap": true
                                            },
                                            {
                                                "type": "TextBlock",
                                                "spacing": "none",
                                                "text": "Launch date: {{DATE(" + data.launch_date_local + ",SHORT)}}",
                                                "isSubtle": true,
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "items": [{
                            "type": "TextBlock",
                            "text": data.details,
                            "wrap": true
                        }]
                    }
                ],
                "actions": [{
                    "type": "Action.OpenUrl",
                    "title": "Video launch",
                    "url": data.links.video_link
                }, {
                    "type": "Action.ShowCard",
                    "title": "Rocket",
                    "card": {
                        "type": "AdaptiveCard",
                        "body": [{
                            "type": "FactSet",
                            "facts": [{
                                    "title": "Rocket id :",
                                    "value": data.rocket.rocket_id
                                },
                                {
                                    "title": "Rocket name :",
                                    "value": data.rocket.rocket_name
                                },
                                {
                                    "title": "Rocket type :",
                                    "value": data.rocket.rocket_type
                                }
                            ]
                        }]
                    }
                }, {
                    "type": "Action.ShowCard",
                    "title": "Launch site",
                    "card": {
                        "type": "AdaptiveCard",
                        "body": [{
                            "type": "FactSet",
                            "facts": [{
                                    "title": "Side id :",
                                    "value": data.launch_site.site_id
                                },
                                {
                                    "title": "Site name :",
                                    "value": data.launch_site.site_name
                                },
                                {
                                    "title": "Site long name :",
                                    "value": data.launch_site.site_name_long
                                }
                            ]
                        }]
                    }
                }, {
                    "type": "Action.Submit",
                    "title": "OK"
                }]
            }
        }

        const adaptiveCard = new builder.Message(session)
            .addAttachment(selectedCard);

        return adaptiveCard
    },

    failCardBuilder: (session) => {
        var bodyObject = [];

        bodyObject.push({
            "type": "TextBlock",
            "text": `Bad input choice`,
            "wrap": true
        })

        const adaptiveCard = new builder.Message(session)
            .addAttachment({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                    type: "AdaptiveCard",
                    body: bodyObject,
                    "actions": [{
                        "type": "Action.Submit",
                        "title": "Try again"
                    }]
                }
            });

        return adaptiveCard
    },
}