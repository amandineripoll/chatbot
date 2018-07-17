const builder = require('botbuilder');

module.exports = {
    cardBuilder: (session, data) => {
        let allLaunches = [];

        data.forEach(element => {
            allLaunches.push({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "Container",
                            "items": [{
                                    "type": "TextBlock",
                                    "text": `#${element.flight_number}`,
                                    "weight": "bolder",
                                    "size": "medium"
                                },
                                {
                                    "type": "ColumnSet",
                                    "columns": [
                                        // {
                                        //     "type": "Column",
                                        //     "width": "auto",
                                        //     "items": [{
                                        //         "type": "Image",
                                        //         "url": element.links.mission_patch_small,
                                        //         "size": "small",
                                        //         "style": "person"
                                        //     }]
                                        // },
                                        {
                                            "type": "Column",
                                            "width": "stretch",
                                            "items": [{
                                                    "type": "TextBlock",
                                                    "text": `Mission name : ${element.mission_name}`,
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
                            "items": [
                                {
                                    "type": "FactSet",
                                    "facts": [
                                        {
                                            "title": "Rocket name:",
                                            "value": `${element.rocket.rocket_name}`
                                        },
                                        {
                                            "title": "Rocket type:",
                                            "value": `${element.rocket.rocket_type}`
                                        },
                                        {
                                            "title": "Payload ID:",
                                            "value": `${element.rocket.second_stage.payloads[0].payload_id}`
                                        },
                                        {
                                            "title": "Payload type:",
                                            "value": `${element.rocket.second_stage.payloads[0].payload_type}`
                                        },
                                        {
                                            "title": "Orbit:",
                                            "value": `${element.rocket.second_stage.payloads[0].orbit}`
                                        },
                                        {
                                            "title": "Reference system:",
                                            "value": `${element.rocket.second_stage.payloads[0].orbit_params.reference_system}`
                                        },
                                        {
                                            "title": "Regime:",
                                            "value": `${element.rocket.second_stage.payloads[0].orbit_params.regime}`
                                        },
                                        {
                                            "title": "Lifespan years:",
                                            "value": `${element.rocket.second_stage.payloads[0].orbit_params.lifespan_years}`
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                }
            })
        });

        const adaptiveCard = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(allLaunches);

        return adaptiveCard
    }
}   