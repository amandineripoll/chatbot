const builder = require('botbuilder');

module.exports = {
    cardBuilder: (session, data) => {
        const adaptiveCard = new builder.Message(session)
          .addAttachment({
                   contentType:"application/vnd.microsoft.card.adaptive",
                   content: {
                       type:"AdaptiveCard",
                       body: [{
                           "type":"Container",
                           "items": [
                                {
                                   "type":"TextBlock",
                                   "text":`#${data.flight_number}`,
                                   "weight":"bolder",
                                   "size":"medium"
                                },
                                {
                                    "type":"ColumnSet",
                                   "columns": [
                                        {
                                           "type":"Column",
                                           "width":"auto",
                                           "items": [
                                                {
                                                   "type":"Image",
                                                   "url":`${data.links.mission_patch_small}`,
                                                   "size":"medium",
                                                    "style":"person",
                                                }
                                            ]
                                        },
                                        {
                                           "type":"Column",
                                           "width":"stretch",
                                           "items": [
                                                {
                                                   "type":"TextBlock",
                                                    "text":`${data.mission_name}`,
                                                   "weight":"bolder",
                                                   "wrap":true
                                                },
                                                {
                                                    "type":"TextBlock",
                                                   "spacing":"none",
                                                   "text":"Launch date: {{DATE(" +data.launch_date_local + ",SHORT)}}",
                                                    "isSubtle":true,
                                                   "wrap":true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                           "type":"Container",
                           "items": [
                                {
                                   "type":"TextBlock",
                                   "text":`${data.details}`,
                                   "wrap":true
                                }
                            ]
                        }

                       ],
                       "actions": [
                            {
                               "type":"Action.ShowCard",
                                "title":"Payload",
                               "card": {
                                   "type":"AdaptiveCard",
                                   "body": [
                                        {
                                           "type":"FactSet",
                                            "facts": [
                                                {
                                                   "title":"Payload Id:",
                                                   "value":`${data.rocket.second_stage.payloads[0].payload_id}`,
                                                },
                                                {
                                                   "title":"List:",
                                                   "value":"Backlog"
                                                },
                                                {
                                                   "title":"Assigned to:",
                                                   "value":"Matt Hidinger"
                                                },
                                                {
                                                   "title":"Due date:",
                                                   "value":"Not set"
                                                }
                                            ]
                                        }
                                    ],
                                   "actions": [
                                        {
                                           "type":"Action.Submit",
                                           "title":"OK"
                                        }
                                    ]
                                }
                            },
                            {
                               "type":"Action.OpenUrl",
                               "title":"Watch webcast",
                               "url":`${data.links.video_link}`
                            },
                            {
                               "type":"Action.OpenUrl",
                               "title":"Telemetry",
                               "url":`${data.telemetry.flight_club}`
                            }
                        ]
                    }
                });

           return adaptiveCard;
         }
}
