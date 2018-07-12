const builder = require('botbuilder');

module.exports = {
    cardBuilder: (session, data) => {
        var bodyObject = [];
    
        Object.keys(data).forEach(function (key) {
            bodyObject.push({
                "type": "TextBlock",
                "text": `${key} : ${data[key]}`,
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
    }
} 