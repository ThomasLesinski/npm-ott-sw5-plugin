#!/usr/bin/env node

'use strict';

import inquirer from 'inquirer';
import Rx from 'rxjs';
import OttPluginController from './Controller/ott-plugin-controller.mjs';

const pluginController = new OttPluginController();
const prompts = new Rx.Subject();

let questions = [
    {
        type: 'input',
        name: 'plugin-name',
        message: 'Plugin name?',
        validate: function (input) {
            return input !== '';
        }
    }
];

inquirer.prompt(prompts).ui.process.subscribe(
    async function (event) {
        pluginController.setPluginName(event.answer);
        pluginController.createPlugin();
        prompts.complete();
    }
);

prompts.next(questions[0]);
