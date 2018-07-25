require('dotenv').config();
const builder = require('botbuilder');
const restify = require('restify');
const server = restify.createServer();
const SpaceXAPI = require('SpaceX-API-Wrapper');
const companyInfo = require('./cardBuilder/companyInfo');
const nextLaunch = require('./cardBuilder/nextLaunch');
const nextAllLaunches = require('./cardBuilder/nextAllLaunches');
const previousLaunch = require('./cardBuilder/previousLaunch');
const successfulLaunches = require('./cardBuilder/successfulLaunches');
const selectNumber = require('./cardBuilder/selectNumber');

let SpaceX = new SpaceXAPI();

server.listen(process.env.PORT || 3978, () => console.log(`Serveur en écoute sur ${server.url}`));

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

const inMemoryStorage = new builder.MemoryBotStorage();
const bot = new builder.UniversalBot(connector, (session) => session.beginDialog('menu')).set('storage', inMemoryStorage);

const menuItems = {
    'About Company': {
        item: 'option1'
    },
    'Next Launch': {
        item: 'option2'
    },
    'Previous Launch': {
        item: 'option3'
    },
    'Next Launches': {
        item: 'option4'
    },
    'Successful Launches': {
        item: 'option5'
    },
    'Select a flight number': {
        item: 'option6'
    }
};

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

bot.dialog('menu', [
    (session) => {
        session.sendTyping();

        builder.Prompts.choice(
            session,
            `Hi, i'm the SpaceX API. Choose option from the list below :`,
            menuItems, {
                listStyle: 3
            }
        );
    },
    (session, results) => {
        const choice = results.response.entity;
        session.sendTyping();

        session.beginDialog(menuItems[choice].item);
    }
]);

// About company
bot.dialog('option1', [
    function (session) {
        filters = {};

        SpaceX.getCompanyInfo(function (err, info) {
            let Info = {
                Title: info.name,
                Founder: info.founder,
                Founded: info.founded,
                Employees: info.employees,
                Summary: info.summary
            }
            session.send(companyInfo.cardBuilder(session, Info));
            session.endDialog();
        });

    }
]);

// Next launch
bot.dialog('option2', [
    function (session) {
        filters = {};

        SpaceX.getAllUpcomingLaunches(filters, function (err, info) {
            session.send(nextLaunch.cardBuilder(session, info[0]));
            session.endDialog();
        });
    },

    (session, results) => {
        filters = {
            flight_number: results.response
        }

        if (results.response >= 65 && results.response <= 68) {
            SpaceX.getAllLaunches(filters, (err, info) => {
                session.send(selectNumber.selectedCardBuilder(session, info));
            });
        } else {
            session.send('Bad input choice');
        }

        session.endDialog();
    }
]);

// Previous launch
bot.dialog('option3', [
    function (session) {

        SpaceX.getLatestLaunch(function (err, info) {
            session.send(previousLaunch.cardBuilder(session, info));
            session.endDialog();

        });
    }
]);

// Next all launches
bot.dialog('option4', [
    function (session) {
        filters = {};

        SpaceX.getAllUpcomingLaunches(filters, function (err, info) {
            session.send(nextAllLaunches.cardBuilder(session, info));
            session.endDialog();
        });
    }
]);

// Successful Launches
bot.dialog('option5', [
    function (session) {
        filters = {
            launch_success: true
        };

        SpaceX.getAllLaunches(filters, function (err, info) {
            session.send(successfulLaunches.cardBuilder(session, info));
            session.endDialog();
        });
    }
]);

// Select number
bot.dialog('option6', [
    (session) => {
        filters = {}

        SpaceX.getAllLaunches(filters, (err, info) => {
            bot.storage = info.length

            session.send(selectNumber.allMissionCardBuilder(session, info));
            builder.Prompts.text(session, 'Which mission number do you want to know about ?');
        });
    },
    (session, results) => {
        filters = {
            flight_number: results.response
        }

        if (results.response > 0 && results.response <= bot.storage) {
            SpaceX.getAllLaunches(filters, (err, info) => {
                session.send(selectNumber.selectedCardBuilder(session, info[0]));
            });
        } else {
            session.send(selectNumber.failCardBuilder(session));
        }

        session.endDialog();
    }
]);
