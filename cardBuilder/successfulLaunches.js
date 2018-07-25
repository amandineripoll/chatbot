const builder = require('botbuilder');

module.exports = {
    cardBuilder: (session, data) => {
        let allLaunches = [];

        data.forEach(element => {
            allLaunches.push({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                    "type": "AdaptiveCard",
                    "body": [{
                            "type": "Container",
                            "items": [{
                                    "type": "TextBlock",
                                    "text": `Mission name : ${element.mission_name}`,
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
                                                "url": element.links.mission_patch_small,
                                                "size": "small",
                                                "style": "person"
                                            }]
                                        },
                                        {
                                            "type": "Column",
                                            "width": "stretch",
                                            "items": [{
                                                    "type": "TextBlock",
                                                    "text": `#${element.flight_number}`,
                                                    "weight": "bolder",
                                                    "wrap": true
                                                },
                                                {
                                                    "type": "TextBlock",
                                                    "spacing": "none",
                                                    "text": "Launch date: {{DATE(" + element.launch_date_local + ",SHORT)}}",
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
                                "text": element.details,
                                "wrap": true
                            }]
                        }
                    ],
                    "actions": [{
                        "type": "Action.OpenUrl",
                        "title": "Video launch",
                        "url": element.links.video_link
                    }, {
                        "type": "Action.ShowCard",
                        "title": "Rocket",
                        "card": {
                            "type": "AdaptiveCard",
                            "body": [{
                                "type": "FactSet",
                                "facts": [{
                                        "title": "Rocket id :",
                                        "value": element.rocket.rocket_id
                                    },
                                    {
                                        "title": "Rocket name :",
                                        "value": element.rocket.rocket_name
                                    },
                                    {
                                        "title": "Rocket type :",
                                        "value": element.rocket.rocket_type
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
                                        "value": element.launch_site.site_id
                                    },
                                    {
                                        "title": "Site name :",
                                        "value": element.launch_site.site_name
                                    },
                                    {
                                        "title": "Site long name :",
                                        "value": element.launch_site.site_name_long
                                    }
                                ]
                            }]
                        }
                    }, {
                        "type": "Action.Submit",
                        "title": "OK"
                    }]
                }
            })
        });

        const adaptiveCard = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(allLaunches);

        return adaptiveCard
    }
}