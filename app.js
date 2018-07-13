// require pour utiliser notre fichier .env contenant nos variables d'environnement
require('dotenv').config();
// déclare différents objets
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

// Je n'ai pas compris à quoi sert MemoryBotStorage, et pourquoi on la set
const inMemoryStorage = new builder.MemoryBotStorage();
const bot = new builder.UniversalBot(connector, (session) => session.beginDialog('menu')).set('storage', inMemoryStorage);

// objet json contenant nos différentes options
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

bot.dialog('menu', [
    (session) => {
        session.sendTyping();

        builder.Prompts.choice(
            session,
            'Choose option from the list below',
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
    }
]);

// Previous launch
bot.dialog('option3', [
    function (session) {
        filters = {};

        SpaceX.getLatestLaunch(filters, function (err, info) {
            console.log(info);
        });
    }
]);

// Next all launches
bot.dialog('option4', [
    function (session) {
        filters = {};

        SpaceX.getAllUpcomingLaunches(filters, function (err, info) {
            console.log(info);
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
            session.send(selectNumber.allMissionCardBuilder(session, info));
            builder.Prompts.text(session, 'Which mission number do you want to know about ?');
        });
    },
    (session, results) => {
        filters = {
            flight_number: results.response
        }

        if (results.response > 0 && results.response < 69) {
            SpaceX.getAllLaunches(filters, (err, info) => {
                session.send(selectNumber.selectedCardBuilder(session, info[0]));
            });
        } else {
            session.send('Bad input choice');
        }

        session.endDialog();
    }
]);
