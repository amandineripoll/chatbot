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
    }
};

bot.dialog('menu', [
    (session) => {
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

        session.beginDialog(menuItems[choice].item);
    }
]);

// About company
bot.dialog('option1', [
    function (session) {

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
        SpaceX.getAllUpcomingLaunches(filters, function (err, info) {
            const Info = info[0]

            const nextLaunchInfo = {
                'Flight number': Info.flight_number,
                'Mission name': Info.mission_name,
                'Launch year': Info.launch_year
            }

            session.send(nextLaunch.cardBuilder(session, nextLaunchInfo));
            session.endDialog();
        });
    }
]);

// Previous launch
bot.dialog('option3', [
    function (session) {
        SpaceX.getLatestLaunch(filters, function (err, info) {
            console.log(info);
        });
    }
]);

// Next all launches
bot.dialog('option4', [
    function (session) {
        SpaceX.getAllUpcomingLaunches(filters, function (err, info) {
            console.log(info);
        });
    }
]);

// Successful Launches
bot.dialog('option5', [
    function (session) {
        SpaceX.getAllLaunches(filters, function (err, info) {
            console.log(info);
        });
    }
]);